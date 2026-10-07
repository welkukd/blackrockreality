-- BlackRockReality Global Real Estate Lead Gen Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workspaces (multi-tenant)
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  custom_domain TEXT,
  primary_color TEXT DEFAULT '#2563EB',
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'team', 'enterprise')),
  data_residency TEXT DEFAULT 'us' CHECK (data_residency IN ('us', 'eu', 'apac')),
  gdpr_compliant BOOLEAN DEFAULT TRUE,
  ccpa_compliant BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  country_code TEXT DEFAULT 'US',
  timezone TEXT DEFAULT 'UTC',
  role TEXT DEFAULT 'agent' CHECK (role IN ('owner', 'admin', 'manager', 'agent', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspace members with RBAC
CREATE TABLE workspace_members (
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'agent' CHECK (role IN ('owner', 'admin', 'manager', 'agent', 'viewer')),
  permissions JSONB DEFAULT '{"leads": true, "properties": true, "deals": true, "commission": true, "reports": true}',
  PRIMARY KEY (workspace_id, user_id)
);

-- API Keys
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  name TEXT DEFAULT 'Default',
  rate_limit INT DEFAULT 1000,
  requests_today INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads with market context
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  source TEXT,
  source_id TEXT NOT NULL,
  market TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  whatsapp TEXT,
  country_code TEXT DEFAULT 'US',
  budget_min NUMERIC(18, 2),
  budget_max NUMERIC(18, 2),
  budget_currency TEXT DEFAULT 'USD',
  property_type TEXT,
  preferred_locations TEXT[],
  preferred_countries TEXT[],
  purpose TEXT CHECK (purpose IN ('buy', 'rent', 'invest', 'lease')),
  timeline TEXT CHECK (timeline IN ('immediate', '1_3_months', '3_6_months', '6_12_months', 'flexible')),
  grade TEXT CHECK (grade IN ('A', 'B', 'C', 'D')),
  grade_score INT DEFAULT 0,
  grade_factors JSONB DEFAULT '{}',
  grade_model_version TEXT DEFAULT 'v1.0',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'visit_scheduled', 'visit_done', 'negotiation', 'closed_won', 'closed_lost', 'nurture')),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  intent_signals JSONB DEFAULT '{}',
  raw_data JSONB DEFAULT '{}',
  enrichment_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, source_id)
);

-- Properties with global fields
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  market TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT,
  listing_type TEXT CHECK (listing_type IN ('sale', 'rent', 'lease')),
  price NUMERIC(18, 2),
  price_currency TEXT DEFAULT 'USD',
  price_per_sqm NUMERIC(12, 2),
  area_sqm NUMERIC(12, 2),
  area_sqft NUMERIC(12, 2),
  bedrooms NUMERIC(3, 1),
  bathrooms NUMERIC(3, 1),
  parking_spaces INT DEFAULT 0,
  floor_number INT,
  total_floors INT,
  year_built INT,
  ownership_type TEXT CHECK (ownership_type IN ('freehold', 'leasehold', 'co_op', 'commonhold', 'strata', 'condominium')),
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  features TEXT[],
  images TEXT[],
  virtual_tour_url TEXT,
  video_url TEXT,
  listed_on_portals JSONB DEFAULT '[]',
  portal_listing_ids JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'pending', 'sold', 'rented', 'off_market')),
  views_count INT DEFAULT 0,
  inquiries_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deals with multi-currency & local tax
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  buyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  agent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  deal_type TEXT CHECK (deal_type IN ('sale', 'rent', 'lease')),
  price_currency TEXT DEFAULT 'USD',
  price_amount NUMERIC(18, 2),
  commission_currency TEXT DEFAULT 'USD',
  commission_rate NUMERIC(5, 2),
  commission_amount NUMERIC(18, 2),
  tds_rate NUMERIC(5, 2),
  vat_rate NUMERIC(5, 2),
  withholding_rate NUMERIC(5, 2),
  stamp_duty NUMERIC(18, 2),
  fx_rate NUMERIC(10, 6) DEFAULT 1.0,
  status TEXT DEFAULT 'negotiation' CHECK (status IN ('negotiation', 'under_contract', 'due_diligence', 'closing', 'closed', 'cancelled')),
  contract_date TIMESTAMPTZ,
  closing_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grind Jobs (scraping jobs)
CREATE TABLE grind_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  sources TEXT[],
  markets TEXT[],
  categories TEXT[],
  cities TEXT[],
  max_leads_per_source INT DEFAULT 50,
  total_leads_found INT DEFAULT 0,
  total_leads_saved INT DEFAULT 0,
  error TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WhatsApp Logs
CREATE TABLE whatsapp_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  to TEXT,
  type TEXT,
  template_id TEXT,
  text TEXT,
  status TEXT,
  response JSONB,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Pages (for SEO)
CREATE TABLE content_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  meta_description TEXT,
  content JSONB DEFAULT '{}',
  market TEXT NOT NULL,
  country TEXT NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  seo_score INT DEFAULT 0,
  views_count INT DEFAULT 0,
  leads_generated INT DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, slug)
);

-- Function to increment API key usage
CREATE OR REPLACE FUNCTION increment_api_key_usage(key_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE api_keys
  SET requests_today = requests_today + 1
  WHERE id = key_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset daily API key usage (run via cron)
CREATE OR REPLACE FUNCTION reset_api_key_usage()
RETURNS VOID AS $$
BEGIN
  UPDATE api_keys
  SET requests_today = 0
  WHERE is_active = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE grind_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Workspaces: users see their own workspaces
CREATE POLICY "Users can view own workspaces" ON workspaces
  FOR SELECT USING (
    id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Owners can update workspaces" ON workspaces
  FOR UPDATE USING (
    id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid() AND role = 'owner')
  );

-- Profiles: users see own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Workspace members: users see members of their workspaces
CREATE POLICY "View workspace members" ON workspace_members
  FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage members" ON workspace_members
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
  );

-- API Keys: users see own workspace keys
CREATE POLICY "View own API keys" ON api_keys
  FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Manage own API keys" ON api_keys
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
  );

-- Leads: workspace isolation
CREATE POLICY "View workspace leads" ON leads
  FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Manage workspace leads" ON leads
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

-- Properties: workspace isolation
CREATE POLICY "View workspace properties" ON properties
  FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Manage workspace properties" ON properties
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

-- Deals: workspace isolation
CREATE POLICY "View workspace deals" ON deals
  FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Manage workspace deals" ON deals
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

-- Grind Jobs: workspace isolation
CREATE POLICY "View workspace grind jobs" ON grind_jobs
  FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Manage workspace grind jobs" ON grind_jobs
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

-- WhatsApp Logs: workspace isolation
CREATE POLICY "View workspace whatsapp logs" ON whatsapp_logs
  FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Manage workspace whatsapp logs" ON whatsapp_logs
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

-- Content Pages: workspace isolation
CREATE POLICY "View workspace content pages" ON content_pages
  FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Manage workspace content pages" ON content_pages
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

-- Indexes for performance
CREATE INDEX idx_leads_workspace_grade ON leads(workspace_id, grade);
CREATE INDEX idx_leads_workspace_status ON leads(workspace_id, status);
CREATE INDEX idx_leads_workspace_market ON leads(workspace_id, market);
CREATE INDEX idx_leads_source ON leads(source, source_id);
CREATE INDEX idx_properties_workspace_market ON properties(workspace_id, market);
CREATE INDEX idx_properties_workspace_status ON properties(workspace_id, status);
CREATE INDEX idx_deals_workspace_status ON deals(workspace_id, status);
CREATE INDEX idx_grind_jobs_workspace ON grind_jobs(workspace_id);
CREATE INDEX idx_api_keys_prefix ON api_keys(key_prefix);
CREATE INDEX idx_content_pages_workspace_slug ON content_pages(workspace_id, slug);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_pages_updated_at BEFORE UPDATE ON content_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();