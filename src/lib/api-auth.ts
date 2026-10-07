import * as CryptoJS from 'crypto-js';

export interface ApiKeyData {
  id: string;
  user_id: string;
  workspace_id: string;
  key_hash: string;
  key_prefix: string;
  name: string;
  rate_limit: number;
  requests_today: number;
  is_active: boolean;
  expires_at?: string;
}

export function generateApiKey(prefix: string = 'rl'): string {
  const keyPrefix = `${prefix}_${CryptoJS.lib.WordArray.random(4).toString(CryptoJS.enc.Hex)}`;
  const keySuffix = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
  return `${keyPrefix}_${keySuffix}`;
}

export function hashApiKey(apiKey: string): string {
  return CryptoJS.SHA256(apiKey).toString(CryptoJS.enc.Hex);
}

export function getKeyPrefix(apiKey: string): string {
  return apiKey.slice(0, 8);
}

export async function validateApiKey(
  apiKey: string,
  supabase: any
): Promise<ApiKeyData | null> {
  const prefix = getKeyPrefix(apiKey);
  const keyHash = hashApiKey(apiKey);

  const { data, error } = await supabase
    .from('api_keys')
    .select('*, workspace_id')
    .eq('key_prefix', prefix)
    .single();

  if (error || !data) return null;
  if (data.key_hash !== keyHash) return null;
  if (!data.is_active) return null;
  if (data.expires_at && new Date(data.expires_at) < new Date()) return null;
  if (data.requests_today >= data.rate_limit) return null;

  return data;
}

export async function incrementApiKeyUsage(
  keyId: string,
  supabase: any
): Promise<void> {
  await supabase.rpc('increment_api_key_usage', { key_id: keyId });
}