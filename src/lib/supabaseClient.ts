import { createClient } from '@supabase/supabase-js';

const url = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '');
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(url, anonKey);
