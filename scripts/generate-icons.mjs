/**
 * SPACE X-RAY 앱 아이콘 생성 스크립트
 * sharp로 SVG → PNG 변환하여 Android mipmap 폴더에 배치
 */
import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ─── SVG 아이콘 디자인 (1024x1024) ─────────────────────────────────────────
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0D0D1A"/>
      <stop offset="100%" stop-color="#0A0A14"/>
    </linearGradient>
    <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#5C6FFF"/>
      <stop offset="100%" stop-color="#00C4FF"/>
    </linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3D5AFE" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#3D5AFE" stop-opacity="0"/>
    </linearGradient>
    <filter id="blur">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
    <filter id="glow-filter">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <clipPath id="round">
      <rect width="1024" height="1024" rx="230" ry="230"/>
    </clipPath>
  </defs>

  <!-- 배경 -->
  <rect width="1024" height="1024" rx="230" fill="url(#bg)"/>

  <!-- 글로우 원 (배경 효과) -->
  <ellipse cx="512" cy="420" rx="340" ry="280" fill="#3D5AFE" opacity="0.08" filter="url(#blur)"/>

  <!-- 집 외곽선 (X-RAY 스타일) -->
  <!-- 지붕 -->
  <polygon points="512,180 820,440 204,440"
    fill="none" stroke="url(#blue)" stroke-width="22"
    stroke-linejoin="round" stroke-linecap="round"
    filter="url(#glow-filter)" opacity="0.95"/>

  <!-- 벽 좌측 -->
  <line x1="250" y1="440" x2="250" y2="730"
    stroke="url(#blue)" stroke-width="22" stroke-linecap="round"
    filter="url(#glow-filter)"/>

  <!-- 벽 우측 -->
  <line x1="774" y1="440" x2="774" y2="730"
    stroke="url(#blue)" stroke-width="22" stroke-linecap="round"
    filter="url(#glow-filter)"/>

  <!-- 바닥 -->
  <line x1="210" y1="730" x2="814" y2="730"
    stroke="url(#blue)" stroke-width="22" stroke-linecap="round"
    filter="url(#glow-filter)"/>

  <!-- 문 -->
  <rect x="436" y="580" width="152" height="150" rx="12"
    fill="none" stroke="#5C6FFF" stroke-width="14" opacity="0.7"/>

  <!-- X-RAY 스캔 라인 (수평) -->
  <rect x="180" y="538" width="664" height="6" rx="3"
    fill="url(#blue)" opacity="0.9" filter="url(#glow-filter)"/>

  <!-- 스캔 라인 글로우 -->
  <rect x="180" y="530" width="664" height="22" rx="3"
    fill="url(#glow)" opacity="0.5"/>

  <!-- 격자 세로선 (X-RAY 효과) -->
  <line x1="390" y1="440" x2="390" y2="730" stroke="#3D5AFE" stroke-width="1.5" opacity="0.25"/>
  <line x1="512" y1="440" x2="512" y2="730" stroke="#3D5AFE" stroke-width="1.5" opacity="0.25"/>
  <line x1="634" y1="440" x2="634" y2="730" stroke="#3D5AFE" stroke-width="1.5" opacity="0.25"/>

  <!-- 격자 가로선 -->
  <line x1="250" y1="540" x2="774" y2="540" stroke="#3D5AFE" stroke-width="1.5" opacity="0.2"/>
  <line x1="250" y1="630" x2="774" y2="630" stroke="#3D5AFE" stroke-width="1.5" opacity="0.2"/>

  <!-- 우상단 스캔 아이콘 (코너 마커) -->
  <g opacity="0.8">
    <line x1="790" y1="170" x2="840" y2="170" stroke="#00C4FF" stroke-width="8" stroke-linecap="round"/>
    <line x1="840" y1="170" x2="840" y2="220" stroke="#00C4FF" stroke-width="8" stroke-linecap="round"/>
  </g>
  <g opacity="0.8">
    <line x1="184" y1="170" x2="234" y2="170" stroke="#00C4FF" stroke-width="8" stroke-linecap="round"/>
    <line x1="184" y1="170" x2="184" y2="220" stroke="#00C4FF" stroke-width="8" stroke-linecap="round"/>
  </g>

  <!-- 하단 텍스트 -->
  <text x="512" y="860"
    font-family="Arial Black, Arial, sans-serif"
    font-size="72" font-weight="900"
    fill="white" text-anchor="middle"
    letter-spacing="6" opacity="0.95">SPACE</text>

  <text x="512" y="950"
    font-family="Arial Black, Arial, sans-serif"
    font-size="58" font-weight="900"
    fill="url(#blue)" text-anchor="middle"
    letter-spacing="16">X-RAY</text>
</svg>`;

// ─── Android 아이콘 크기 정의 ────────────────────────────────────────────────
const ANDROID_ICONS = [
  { density: 'mdpi',    size: 48  },
  { density: 'hdpi',    size: 72  },
  { density: 'xhdpi',   size: 96  },
  { density: 'xxhdpi',  size: 144 },
  { density: 'xxxhdpi', size: 192 },
];

// ─── 아이콘 생성 ─────────────────────────────────────────────────────────────
async function generateIcons() {
  const svgBuffer = Buffer.from(svgIcon);

  // assets/ 폴더에 1024px 원본 저장
  const assetsDir = join(ROOT, 'assets');
  mkdirSync(assetsDir, { recursive: true });
  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png()
    .toFile(join(assetsDir, 'icon-1024.png'));
  console.log('✓ assets/icon-1024.png 생성 완료');

  // Android mipmap 폴더에 각 크기별 생성
  for (const { density, size } of ANDROID_ICONS) {
    const dir = join(ROOT, `android/app/src/main/res/mipmap-${density}`);
    mkdirSync(dir, { recursive: true });

    // ic_launcher.png
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(dir, 'ic_launcher.png'));

    // ic_launcher_round.png (원형 아이콘)
    const circle = Buffer.from(
      `<svg><circle cx="${size/2}" cy="${size/2}" r="${size/2}" /></svg>`
    );
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .composite([{ input: circle, blend: 'dest-in' }])
      .toFile(join(dir, 'ic_launcher_round.png'));

    console.log(`✓ mipmap-${density}: ${size}x${size}px`);
  }

  // foreground 레이어 (adaptive icon용)
  for (const { density, size } of ANDROID_ICONS) {
    const dir = join(ROOT, `android/app/src/main/res/mipmap-${density}`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(dir, 'ic_launcher_foreground.png'));
  }

  console.log('\n🎉 모든 아이콘 생성 완료!');
}

generateIcons().catch(console.error);
