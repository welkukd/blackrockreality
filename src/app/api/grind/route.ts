import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { validateApiKey } from '@/lib/api-auth';
import { runScrapersParallel } from '@/lib/scrapers/base';
import { US_SCRAPERS, CA_SCRAPERS } from '@/lib/scrapers/north-america';
import { gradeLead } from '@/lib/grading';

export const dynamic = 'force-dynamic';

const MARKET_SCRAPERS: Record<string, any[]> = {
  US: US_SCRAPERS,
  CA: CA_SCRAPERS,
};

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

    const body = await request.json();
    const { markets, categories, cities, maxLeadsPerSource = 20 } = body;

    if (!markets || !Array.isArray(markets) || markets.length === 0) {
      return NextResponse.json({ error: 'Markets array is required' }, { status: 400 });
    }

    // Create grind job record
    const { data: job, error: jobError } = await supabase
      .from('grind_jobs')
      .insert({
        workspace_id: keyData.workspace_id || keyData.user_id, // fallback
        user_id: keyData.user_id,
        api_key_id: keyData.id,
        sources: markets.flatMap(m => MARKET_SCRAPERS[m]?.map(s => s.name) || []),
        markets,
        categories: categories || [],
        cities: cities || [],
        max_leads_per_source: maxLeadsPerSource,
        status: 'running',
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (jobError) {
      return NextResponse.json({ error: 'Failed to create grind job' }, { status: 500 });
    }

    // Run scraping in background (fire and forget)
    runGrindJob(job.id, markets, categories, cities, maxLeadsPerSource, keyData);

    return NextResponse.json({
      job_id: job.id,
      status: 'started',
      message: 'Grind job started. Check status with GET /api/grind?job_id=...',
    });
  } catch (error) {
    console.error('Grind API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function runGrindJob(
  jobId: string,
  markets: string[],
  categories: string[],
  cities: string[],
  maxLeadsPerSource: number,
  keyData: any
) {
  try {
    let allLeads: any[] = [];
    const allErrors: Record<string, string> = {};

    for (const market of markets) {
      const scrapers = MARKET_SCRAPERS[market];
      if (!scrapers || scrapers.length === 0) continue;

      for (const category of categories || ['residential']) {
        for (const city of cities || ['']) {
          const query = { market, country: market, category, city, maxLeads: maxLeadsPerSource };
          
          const { leads, errors } = await runScrapersParallel(scrapers, query, 2);
          allLeads.push(...leads);
          Object.assign(allErrors, errors);
        }
      }
    }

    // Grade all leads
    const gradedLeads = allLeads.map(lead => {
      const graded = gradeLead(lead);
      return { ...lead, grade: graded.grade, grade_score: graded.score, grade_factors: graded.factors };
    });

    // Save leads to database
    let saved = 0;
    for (const lead of gradedLeads) {
      const { error } = await supabase.from('leads').upsert({
        workspace_id: keyData.workspace_id || keyData.user_id,
        user_id: keyData.user_id,
        source: lead.source,
        source_id: lead.source_id,
        market: lead.market,
        country: lead.country,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        whatsapp: lead.whatsapp,
        website: lead.website,
        address: lead.address,
        city: lead.city,
        state: lead.state,
        category: lead.category,
        rating: lead.rating,
        review_count: lead.review_count,
        has_website: lead.has_website,
        has_whatsapp: lead.has_whatsapp,
        has_booking: lead.has_booking,
        has_ssl: lead.has_ssl,
        tech_stack: lead.tech_stack,
        load_time_ms: lead.load_time_ms,
        grade: lead.grade,
        grade_score: lead.grade_score,
        grade_factors: lead.grade_factors,
        raw_data: lead.raw_data,
        status: 'new',
      }, { onConflict: 'workspace_id,source_id' });

      if (!error) saved++;
    }

    // Update job status
    await supabase
      .from('grind_jobs')
      .update({
        status: 'completed',
        total_leads_found: allLeads.length,
        total_leads_saved: saved,
        error: Object.keys(allErrors).length > 0 ? JSON.stringify(allErrors) : null,
        completed_at: new Date().toISOString(),
      })
      .eq('id', jobId);

  } catch (error) {
    await supabase
      .from('grind_jobs')
      .update({
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        completed_at: new Date().toISOString(),
      })
      .eq('id', jobId);
  }
}

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
    const jobId = searchParams.get('job_id');

    if (jobId) {
      const { data: job, error } = await supabase
        .from('grind_jobs')
        .select('*')
        .eq('id', jobId)
        .eq('user_id', keyData.user_id)
        .single();

      if (error || !job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }

      return NextResponse.json(job);
    }

    // List recent jobs
    const { data: jobs, error } = await supabase
      .from('grind_jobs')
      .select('*')
      .eq('user_id', keyData.user_id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
    }

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Grind GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}