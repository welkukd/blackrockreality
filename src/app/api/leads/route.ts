import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { validateApiKey } from '@/lib/api-auth';

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

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('lead_id');
    const grade = searchParams.get('grade');
    const status = searchParams.get('status');
    const market = searchParams.get('market');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const exportFormat = searchParams.get('export');

    if (leadId) {
      const { data: lead, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .eq('workspace_id', keyData.workspace_id)
        .single();

      if (error || !lead) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
      }

      return NextResponse.json(lead);
    }

    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .eq('workspace_id', keyData.workspace_id);

    if (grade) query = query.eq('grade', grade);
    if (status) query = query.eq('status', status);
    if (market) query = query.eq('market', market);

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: leads, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }

    if (exportFormat === 'csv') {
      const csv = leadsToCsv(leads || []);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="leads-${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ leads, total: count, limit, offset });
  } catch (error) {
    console.error('Leads GET error:', error);
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

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('lead_id');

    if (!leadId) {
      return NextResponse.json({ error: 'lead_id query parameter required' }, { status: 400 });
    }

    const body = await request.json();
    const { status, assigned_to } = body;

    const updates: any = {};
    if (status) updates.status = status;
    if (assigned_to) updates.assigned_to = assigned_to;

    const { data: lead, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', leadId)
      .eq('workspace_id', keyData.workspace_id)
      .select()
      .single();

    if (error || !lead) {
      return NextResponse.json({ error: 'Lead not found or update failed' }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error('Leads PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function leadsToCsv(leads: any[]): string {
  const headers = [
    'ID', 'Source', 'Source ID', 'Market', 'Country', 'Name', 'Phone', 'Email',
    'WhatsApp', 'Website', 'Address', 'City', 'State', 'Category', 'Rating',
    'Review Count', 'Has Website', 'Has WhatsApp', 'Has Booking', 'Has SSL',
    'Grade', 'Grade Score', 'Grade Factors', 'Status', 'Created At'
  ];

  const rows = leads.map(lead => [
    lead.id,
    lead.source,
    lead.source_id,
    lead.market,
    lead.country,
    lead.name,
    lead.phone || '',
    lead.email || '',
    lead.whatsapp || '',
    lead.website || '',
    lead.address || '',
    lead.city || '',
    lead.state || '',
    lead.category || '',
    lead.rating || '',
    lead.review_count || '',
    lead.has_website ? 'Yes' : 'No',
    lead.has_whatsapp ? 'Yes' : 'No',
    lead.has_booking ? 'Yes' : 'No',
    lead.has_ssl ? 'Yes' : 'No',
    lead.grade,
    lead.grade_score,
    (lead.grade_factors || []).join('; '),
    lead.status,
    lead.created_at,
  ]);

  return [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
}