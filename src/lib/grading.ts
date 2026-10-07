export interface ScrapedLead {
  source: string;
  source_id: string;
  name: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  category?: string;
  rating?: number;
  review_count?: number;
  has_website: boolean;
  has_whatsapp: boolean;
  has_booking: boolean;
  has_ssl: boolean;
  tech_stack?: string[];
  load_time_ms?: number;
  raw_data?: Record<string, any>;
  market: string;
}

export interface GradeResult {
  grade: 'A' | 'B' | 'C' | 'D';
  score: number;
  factors: string[];
}

export interface MarketConfig {
  noWebsiteBonus: number;
  sslWeight: number;
  whatsappWeight: number;
  bookingWeight: number;
  timelineWeights: Record<string, number>;
  sourceQuality: Record<string, number>;
  intentSignals: string[];
}

export const MARKET_CONFIGS: Record<string, MarketConfig> = {
  'US': {
    noWebsiteBonus: 35,
    sslWeight: 10,
    whatsappWeight: 5,
    bookingWeight: 15,
    timelineWeights: { immediate: 25, '1_3_months': 15, '3_6_months': 10 },
    sourceQuality: { zillow: 10, realtor_com: 10, redfin: 8, trulia: 5 },
    intentSignals: ['pre_approval', 'cash_buyer', 'investor', '1031_exchange'],
  },
  'CA': {
    noWebsiteBonus: 35,
    sslWeight: 10,
    whatsappWeight: 10,
    bookingWeight: 15,
    timelineWeights: { immediate: 25, '1_3_months': 15, '3_6_months': 10 },
    sourceQuality: { realtor_ca: 15, zolo: 10, point2: 8, rew: 8 },
    intentSignals: ['mortgage_preapproval', 'cash_buyer', 'investor', 'first_time_buyer'],
  },
  'UK': {
    noWebsiteBonus: 40,
    sslWeight: 15,
    whatsappWeight: 10,
    bookingWeight: 10,
    timelineWeights: { immediate: 20, '1_3_months': 15, '3_6_months': 10 },
    sourceQuality: { rightmove: 15, zoopla: 10, onthemarket: 8 },
    intentSignals: ['mortgage_in_principle', 'chain_free', 'cash_buyer', 'buy_to_let'],
  },
  'AE': {
    noWebsiteBonus: 35,
    sslWeight: 10,
    whatsappWeight: 25,
    bookingWeight: 15,
    timelineWeights: { immediate: 25, '1_3_months': 15 },
    sourceQuality: { bayut: 15, property_finder: 12, dubizzle: 8 },
    intentSignals: ['golden_visa', 'off_plan', 'high_yield', 'freehold'],
  },
  'AU': {
    noWebsiteBonus: 35,
    sslWeight: 10,
    whatsappWeight: 5,
    bookingWeight: 15,
    timelineWeights: { immediate: 20, '1_3_months': 15, '3_6_months': 10 },
    sourceQuality: { domain: 15, realestate_au: 15, reiwa: 8 },
    intentSignals: ['pre_approval', 'cash_buyer', 'investor', 'first_home_buyer'],
  },
  'SG': {
    noWebsiteBonus: 35,
    sslWeight: 10,
    whatsappWeight: 20,
    bookingWeight: 10,
    timelineWeights: { immediate: 25, '1_3_months': 15 },
    sourceQuality: { propertyguru: 15, '99co': 12, srx: 10 },
    intentSignals: ['hdb_eligible', 'cash_buyer', 'investor', 'absd_paid'],
  },
  'IN': {
    noWebsiteBonus: 40,
    sslWeight: 15,
    whatsappWeight: 20,
    bookingWeight: 10,
    timelineWeights: { immediate: 30, '1_3_months': 20, '3_6_months': 15 },
    sourceQuality: { '99acres': 10, magicbricks: 10, housing: 8, nobroker: 5 },
    intentSignals: ['rera_verified', 'ready_to_move', 'gst_compliant', 'home_loan_approved'],
  },
  'JP': {
    noWebsiteBonus: 30,
    sslWeight: 10,
    whatsappWeight: 5,
    bookingWeight: 10,
    timelineWeights: { immediate: 20, '1_3_months': 15 },
    sourceQuality: { suumo: 15, athome: 10, homes: 8 },
    intentSignals: ['earthquake_resistant', 'near_station', 'new_building', 'renovated'],
  },
};

export const DEFAULT_CONFIG: MarketConfig = {
  noWebsiteBonus: 35,
  sslWeight: 10,
  whatsappWeight: 10,
  bookingWeight: 10,
  timelineWeights: { immediate: 20, '1_3_months': 15, '3_6_months': 10 },
  sourceQuality: {},
  intentSignals: [],
};

export function gradeLead(lead: ScrapedLead): GradeResult {
  const config = MARKET_CONFIGS[lead.market] || DEFAULT_CONFIG;
  let score = 0;
  const factors: string[] = [];

  if (!lead.website) {
    score += config.noWebsiteBonus;
    factors.push('no_website');
  }

  if (!lead.has_ssl) {
    score += config.sslWeight;
    factors.push('no_ssl');
  }
  if (!lead.has_whatsapp) {
    score += config.whatsappWeight;
    factors.push('no_whatsapp');
  }
  if (!lead.has_booking) {
    score += config.bookingWeight;
    factors.push('no_booking');
  }
  if (lead.load_time_ms && lead.load_time_ms > 3000) {
    score += 10;
    factors.push('slow_site');
  }

  if (lead.raw_data?.timeline && config.timelineWeights[lead.raw_data.timeline]) {
    score += config.timelineWeights[lead.raw_data.timeline];
    factors.push(`urgent_${lead.raw_data.timeline}`);
  }

  if (lead.source && config.sourceQuality[lead.source]) {
    score += config.sourceQuality[lead.source];
    factors.push(`quality_source_${lead.source}`);
  }

  config.intentSignals.forEach((signal) => {
    if (lead.raw_data?.[signal]) {
      score += 5;
      factors.push(signal);
    }
  });

  if (score >= 80) return { grade: 'A', score, factors };
  if (score >= 60) return { grade: 'B', score, factors };
  if (score >= 40) return { grade: 'C', score, factors };
  if (score >= 20) return { grade: 'D', score, factors };
  return { grade: 'D', score, factors };
}

export function normalizePhone(phone: string, countryCode: string): string {
  const digits = phone.replace(/\D/g, '');
  const countryPrefixes: Record<string, string> = {
    US: '1', CA: '1', UK: '44', AE: '971', AU: '61', SG: '65', IN: '91', JP: '81',
  };
  const prefix = countryPrefixes[countryCode] || '1';
  if (digits.startsWith(prefix)) return `+${digits}`;
  if (digits.startsWith('0')) return `+${prefix}${digits.slice(1)}`;
  return `+${prefix}${digits}`;
}