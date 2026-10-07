import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { validateApiKey, generateApiKey, hashApiKey, getKeyPrefix } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid API key' }, { status: 401 });
    }

    const apiKey = authHeader.slice(7);
    const keyData = await validateApiKey(apiKey, supabase);
    if (!keyData) {
      return NextResponse.json({ error: 'Invalid or expired API key' }, { status: 401 });
    }

    // Check if user is admin/owner
    const { data: member } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', keyData.workspace_id)
      .eq('user_id', keyData.user_id)
      .single();

    if (!member || !['owner', 'admin'].includes(member.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { data: keys, error } = await supabase
      .from('api_keys')
      .select('id, name, key_prefix, rate_limit, requests_today, is_active, expires_at, created_at')
      .eq('workspace_id', keyData.workspace_id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 });
    }

    return NextResponse.json({ keys });
  } catch (error) {
    console.error('API Keys GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid API key' }, { status: 401 });
    }

    const apiKey = authHeader.slice(7);
    const keyData = await validateApiKey(apiKey, supabase);
    if (!keyData) {
      return NextResponse.json({ error: 'Invalid or expired API key' }, { status: 401 });
    }

    // Check if user is admin/owner
    const { data: member } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', keyData.workspace_id)
      .eq('user_id', keyData.user_id)
      .single();

    if (!member || !['owner', 'admin'].includes(member.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { name = 'Default', rate_limit = 1000, expires_in_days = 365 } = body;

    const newApiKey = generateApiKey('rl');
    const keyHash = hashApiKey(newApiKey);
    const keyPrefix = getKeyPrefix(newApiKey);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expires_in_days);

    const { data: newKey, error } = await supabase
      .from('api_keys')
      .insert({
        workspace_id: keyData.workspace_id,
        user_id: keyData.user_id,
        key_hash: keyHash,
        key_prefix: keyPrefix,
        name,
        rate_limit,
        expires_at: expiresAt.toISOString(),
      })
      .select('id, name, key_prefix, rate_limit, requests_today, is_active, expires_at, created_at')
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 });
    }

    // Return the full key ONLY ONCE
    return NextResponse.json({
      key: newKey,
      api_key: newApiKey, // Only shown once!
      warning: 'Save this API key now. It will not be shown again.',
    });
  } catch (error) {
    console.error('API Keys POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid API key' }, { status: 401 });
    }

    const apiKey = authHeader.slice(7);
    const keyData = await validateApiKey(apiKey, supabase);
    if (!keyData) {
      return NextResponse.json({ error: 'Invalid or expired API key' }, { status: 401 });
    }

    // Check if user is admin/owner
    const { data: member } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', keyData.workspace_id)
      .eq('user_id', keyData.user_id)
      .single();

    if (!member || !['owner', 'admin'].includes(member.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get('key_id');

    if (!keyId) {
      return NextResponse.json({ error: 'key_id query parameter required' }, { status: 400 });
    }

    const body = await request.json();
    const { name, rate_limit, is_active, expires_in_days } = body;

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (rate_limit !== undefined) updates.rate_limit = rate_limit;
    if (is_active !== undefined) updates.is_active = is_active;
    if (expires_in_days !== undefined) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expires_in_days);
      updates.expires_at = expiresAt.toISOString();
    }

    const { data: updatedKey, error } = await supabase
      .from('api_keys')
      .update(updates)
      .eq('id', keyId)
      .eq('workspace_id', keyData.workspace_id)
      .select('id, name, key_prefix, rate_limit, requests_today, is_active, expires_at, created_at')
      .single();

    if (error || !updatedKey) {
      return NextResponse.json({ error: 'API key not found or update failed' }, { status: 404 });
    }

    return NextResponse.json({ key: updatedKey });
  } catch (error) {
    console.error('API Keys PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid API key' }, { status: 401 });
    }

    const apiKey = authHeader.slice(7);
    const keyData = await validateApiKey(apiKey, supabase);
    if (!keyData) {
      return NextResponse.json({ error: 'Invalid or expired API key' }, { status: 401 });
    }

    // Check if user is admin/owner
    const { data: member } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', keyData.workspace_id)
      .eq('user_id', keyData.user_id)
      .single();

    if (!member || !['owner', 'admin'].includes(member.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get('key_id');

    if (!keyId) {
      return NextResponse.json({ error: 'key_id query parameter required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', keyId)
      .eq('workspace_id', keyData.workspace_id);

    if (error) {
      return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Keys DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}