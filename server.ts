import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import { GoogleGenAI } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── 클라이언트 초기화 ───────────────────────────────────────────────────────
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const gemini = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

const claude = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

// Supabase URL에서 /rest/v1/ suffix 제거
const supabaseUrl = (process.env.SUPABASE_URL ?? "").replace(/\/rest\/v1\/?$/, "");
const supabase = supabaseUrl && process.env.SUPABASE_ANON_KEY
  ? createClient(supabaseUrl, process.env.SUPABASE_ANON_KEY)
  : null;

// 스타일별 결과 이미지 (Gemini/Claude는 텍스트 분석만, 이미지는 스타일 매핑)
const STYLE_RESULT_IMAGES: Record<string, string> = {
  minimalist:  "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200",
  industrial:  "https://images.unsplash.com/photo-1565953522043-baea26b83b7e?auto=format&fit=crop&q=80&w=1200",
  luxury:      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200",
  scandinavian:"https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1200",
  biophilic:   "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=1200",
};

// ─── 분석 프롬프트 빌더 ──────────────────────────────────────────────────────
function buildPrompt(styleName: string, params: Record<string, number>, customColors: string[]) {
  const colorLine = customColors.length > 0
    ? `- 다음 색상을 우선 반영해주세요: ${customColors.join(", ")}`
    : "";
  return `당신은 전문 인테리어 디자이너입니다. 업로드된 공간 사진을 분석하고, '${styleName}' 스타일로 리디자인했을 때의 결과를 아래 JSON 형식으로만 반환하세요. 다른 텍스트는 절대 포함하지 마세요.

{
  "coreStyle": "메인 스타일 키워드 (예: 노르딕 미니멀리즘)",
  "colorHarmony": ["#HEX1", "#HEX2", "#HEX3"],
  "suitability": 숫자(0-100 사이 정수),
  "details": "현재 공간의 특징과 ${styleName} 적용 시 변화 포인트를 한국어 2~3문장으로 설명.",
  "spaceType": "감지된 공간 타입 (예: 거실, 침실, 주방)"
}

세부 조건:
- 모던함 ${params.modernity ?? 50}%, 아늑함 ${params.coziness ?? 50}%, 미니멀리즘 ${params.minimalism ?? 50}% 수치 반영
${colorLine}
- colorHarmony는 실제로 적용할 추천 HEX 색상 정확히 3가지`;
}

// ─── JSON 파싱 헬퍼 ──────────────────────────────────────────────────────────
function parseAnalysis(text: string) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" })); // base64 이미지 처리

  // ─── 헬스 체크 ──────────────────────────────────────────────────────────────
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      gemini: !!gemini,
      claude: !!claude,
      supabase: !!supabase,
    });
  });

  // ─── AI 인테리어 분석 (핵심 엔드포인트) ────────────────────────────────────
  app.post("/api/analyze", async (req, res) => {
    const { imageBase64, mimeType, styleId, styleName, params, customColors, isPro, userId } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "이미지가 없습니다. 먼저 사진을 찍어주세요." });
    }

    const prompt = buildPrompt(styleName ?? "미니멀리스트", params ?? {}, customColors ?? []);
    let analysisText = "";

    try {
      if (isPro && claude) {
        // ── Pro 유저: Claude 3.5 Sonnet (고품질) ──
        const response = await claude.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: (mimeType || "image/webp") as "image/webp" | "image/jpeg" | "image/png" | "image/gif",
                    data: imageBase64,
                  },
                },
                { type: "text", text: prompt },
              ],
            },
          ],
        });
        analysisText = response.content[0].type === "text" ? response.content[0].text : "";
      } else {
        // ── Free 유저: Gemini 1.5 Flash (가성비) ──
        if (!gemini) return res.status(500).json({ error: "Gemini API 키가 설정되지 않았습니다." });
        const response = await gemini.models.generateContent({
          model: "gemini-1.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                { inlineData: { mimeType: mimeType || "image/webp", data: imageBase64 } },
                { text: prompt },
              ],
            },
          ],
        });
        analysisText = response.text ?? "";
      }

      let analysis: Record<string, unknown>;
      try {
        analysis = parseAnalysis(analysisText);
      } catch {
        return res.status(500).json({ error: "AI 응답 파싱 실패. 다시 시도해주세요.", raw: analysisText });
      }

      const resultImage = STYLE_RESULT_IMAGES[styleId] ?? STYLE_RESULT_IMAGES["minimalist"];

      // ── Pro 유저: Supabase Storage에 이미지 저장 ──────────────────────────
      let storedImageUrl: string | null = null;
      if (isPro && supabase && userId && imageBase64) {
        try {
          const imageBuffer = Buffer.from(imageBase64, "base64");
          const fileName = `${userId}/${Date.now()}.webp`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("user-images")
            .upload(fileName, imageBuffer, {
              contentType: "image/webp",
              upsert: false,
            });
          if (!uploadError && uploadData) {
            const { data: publicData } = supabase.storage
              .from("user-images")
              .getPublicUrl(uploadData.path);
            storedImageUrl = publicData.publicUrl;
          }
        } catch {
          // 저장 실패해도 분석 결과는 반환
        }
      }

      // ── Supabase DB에 분석 이력 저장 (Pro만 영구, Free는 건너뜀) ──────────
      if (isPro && supabase && userId) {
        try {
          await supabase.from("analyses").insert({
            user_id: userId,
            style: styleName,
            image_url: storedImageUrl ?? resultImage,
            result: analysis,
            model_used: claude ? "claude-3-5-sonnet" : "gemini-1.5-flash",
          });
        } catch { /* 저장 실패 무시 */ }
      }

      res.json({
        imageUrl: storedImageUrl ?? resultImage,
        modelUsed: isPro && claude ? "Claude 3.5 Sonnet" : "Gemini 1.5 Flash",
        analysis: {
          coreStyle: analysis.coreStyle ?? styleName,
          colorHarmony: analysis.colorHarmony ?? ["#E8E1D9", "#333333", "#A89F91"],
          suitability: analysis.suitability ?? 85,
          details: analysis.details ?? "",
          fineTuning: params,
        },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "알 수 없는 오류";
      res.status(500).json({ error: message });
    }
  });

  // ─── Stripe 결제 세션 생성 ──────────────────────────────────────────────────
  app.post("/api/create-checkout-session", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe가 설정되지 않았습니다." });
    }

    const { planId, successUrl, cancelUrl } = req.body;

    const prices: Record<string, { amount: number; name: string }> = {
      "pro":          { amount: 14900, name: "프로 구독 (₩14,900/월)" },
      "token-basic":  { amount: 4900,  name: "베이직 팩 100토큰" },
      "token-smart":  { amount: 19000, name: "스마트 팩 500토큰" },
      "token-pro":    { amount: 49000, name: "프로 팩 1,500토큰" },
    };

    const plan = prices[planId];
    if (!plan) {
      return res.status(400).json({ error: "유효하지 않은 상품 ID입니다." });
    }

    try {
      const session = await (stripe.checkout.sessions as any).create({
        automatic_payment_methods: { enabled: true },
        line_items: [
          {
            price_data: {
              currency: "krw",
              product_data: { name: plan.name },
              unit_amount: plan.amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      res.json({ id: session.id });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "결제 오류";
      res.status(500).json({ error: message });
    }
  });

  // ─── Vite 미들웨어 (개발) / 정적 파일 (프로덕션) ───────────────────────────
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
    console.log(`Gemini: ${gemini ? "✓" : "✗"}  Claude: ${claude ? "✓" : "✗"}  Supabase: ${supabase ? "✓" : "✗"}`);
  });
}

startServer();
