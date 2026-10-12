import { BaseScraper, ScrapeQuery, ScrapedLead, ScraperConfig } from './base';

export class DomainScraper extends BaseScraper {
  constructor(config: ScraperConfig = {}) {
    super(config);
  }

  async scrape(query: ScrapeQuery): Promise<ScrapedLead[]> {
    const page = await this.newPage();
    const leads: ScrapedLead[] = [];

    try {
      const city = query.city || 'Sydney';
      const state = query.state || 'NSW';
      const searchUrl = `https://www.domain.com.au/real-estate-agencies/${city.toLowerCase()}-${state.toLowerCase()}-2000/`;

      const navigated = await this.safeNavigate(page, searchUrl);
      if (!navigated) throw new Error('Failed to navigate to Domain');

      await this.delay(this.getRandomDelay(3000, 5000));

      const cards = await page.$$('.agency-card');

      for (let i = 0; i < Math.min(cards.length, query.maxLeads || 20); i++) {
        try {
          const card = cards[i];

          const nameEl = await card.$('.agency-name');
          const name = nameEl ? ((await nameEl.textContent() ?? undefined) ?? '') : '';

          const phoneEl = await card.$('.agency-phone');
          const phone = phoneEl ? ((await phoneEl.textContent() ?? undefined) ?? '') : '';

          const websiteEl = await card.$('.agency-website a');
          const website = websiteEl ? ((await websiteEl.getAttribute('href')) ?? '') : '';

          const profileLinkEl = await card.$('a.agency-profile');
          const href = profileLinkEl ? ((await profileLinkEl.getAttribute('href')) ?? '') : '';
          const sourceId = href ? (href.split('/').pop() ?? `domain_${i}`) : `domain_${i}`;

          leads.push({
            source: 'domain',
            source_id: this.generateSourceId('domain', sourceId),
            name: name?.trim() || 'Domain Agent',
            phone: phone ? this.normalizePhone(phone, 'AU') : undefined,
            website: website || undefined,
            city,
            state,
            country: 'AU',
            category: query.category,
            has_website: !!website,
            has_whatsapp: false,
            has_booking: false,
            has_ssl: true,
            market: 'AU',
            raw_data: { profile_url: href },
          });
        } catch {
          continue;
        }
      }
    } finally {
      await this.closeBrowser();
    }

    return leads;
  }
}

export class RealEstateAuScraper extends BaseScraper {
  constructor(config: ScraperConfig = {}) {
    super(config);
  }

  async scrape(query: ScrapeQuery): Promise<ScrapedLead[]> {
    const page = await this.newPage();
    const leads: ScrapedLead[] = [];

    try {
      const city = query.city || 'Sydney';
      const state = query.state || 'NSW';
      const searchUrl = `https://www.realestate.com.au/agencies/${city.toLowerCase()}-${state.toLowerCase()}-2000`;

      const navigated = await this.safeNavigate(page, searchUrl);
      if (!navigated) throw new Error('Failed to navigate to Realestate.com.au');

      await this.delay(this.getRandomDelay(3000, 5000));

      const cards = await page.$$('.agency-card');

      for (let i = 0; i < Math.min(cards.length, query.maxLeads || 20); i++) {
        try {
          const card = cards[i];

          const nameEl = await card.$('.agency-name');
          const name = nameEl ? ((await nameEl.textContent() ?? undefined) ?? '') : '';

          const phoneEl = await card.$('.agency-phone');
          const phone = phoneEl ? ((await phoneEl.textContent() ?? undefined) ?? '') : '';

          const websiteEl = await card.$('.agency-website a');
          const website = websiteEl ? ((await websiteEl.getAttribute('href')) ?? '') : '';

          const profileLinkEl = await card.$('a.agency-profile');
          const href = profileLinkEl ? ((await profileLinkEl.getAttribute('href')) ?? '') : '';
          const sourceId = href ? (href.split('/').pop() ?? `realestate_au_${i}`) : `realestate_au_${i}`;

          leads.push({
            source: 'realestate_au',
            source_id: this.generateSourceId('realestate_au', sourceId),
            name: name?.trim() || 'Realestate.com.au Agent',
            phone: phone ? this.normalizePhone(phone, 'AU') : undefined,
            website: website || undefined,
            city,
            state,
            country: 'AU',
            category: query.category,
            has_website: !!website,
            has_whatsapp: false,
            has_booking: false,
            has_ssl: true,
            market: 'AU',
            raw_data: { profile_url: href },
          });
        } catch {
          continue;
        }
      }
    } finally {
      await this.closeBrowser();
    }

    return leads;
  }
}

export class ReiwaScraper extends BaseScraper {
  constructor(config: ScraperConfig = {}) {
    super(config);
  }

  async scrape(query: ScrapeQuery): Promise<ScrapedLead[]> {
    const page = await this.newPage();
    const leads: ScrapedLead[] = [];

    try {
      const city = query.city || 'Perth';
      const state = query.state || 'WA';
      const searchUrl = `https://reiwa.com/agents/${city.toLowerCase()}/`;

      const navigated = await this.safeNavigate(page, searchUrl);
      if (!navigated) throw new Error('Failed to navigate to REIWA');

      await this.delay(this.getRandomDelay(3000, 5000));

      const cards = await page.$$('.agent-card');

      for (let i = 0; i < Math.min(cards.length, query.maxLeads || 20); i++) {
        try {
          const card = cards[i];

          const nameEl = await card.$('.agent-name');
          const name = nameEl ? ((await nameEl.textContent() ?? undefined) ?? '') : '';

          const phoneEl = await card.$('.agent-phone');
          const phone = phoneEl ? ((await phoneEl.textContent() ?? undefined) ?? '') : '';

          const websiteEl = await card.$('.agent-website a');
          const website = websiteEl ? ((await websiteEl.getAttribute('href')) ?? '') : '';

          const profileLinkEl = await card.$('a.agent-profile');
          const href = profileLinkEl ? ((await profileLinkEl.getAttribute('href')) ?? '') : '';
          const sourceId = href ? (href.split('/').pop() ?? `reiwa_${i}`) : `reiwa_${i}`;

          leads.push({
            source: 'reiwa',
            source_id: this.generateSourceId('reiwa', sourceId),
            name: name?.trim() || 'REIWA Agent',
            phone: phone ? this.normalizePhone(phone, 'AU') : undefined,
            website: website || undefined,
            city,
            state,
            country: 'AU',
            category: query.category,
            has_website: !!website,
            has_whatsapp: false,
            has_booking: false,
            has_ssl: true,
            market: 'AU',
            raw_data: { profile_url: href },
          });
        } catch {
          continue;
        }
      }
    } finally {
      await this.closeBrowser();
    }

    return leads;
  }
}

export class PropertyGuruScraper extends BaseScraper {
  constructor(config: ScraperConfig = {}) {
    super(config);
  }

  async scrape(query: ScrapeQuery): Promise<ScrapedLead[]> {
    const page = await this.newPage();
    const leads: ScrapedLead[] = [];

    try {
      const city = query.city || 'Singapore';
      const searchUrl = `https://www.propertyguru.com.sg/property-agents/${city.toLowerCase()}`;

      const navigated = await this.safeNavigate(page, searchUrl);
      if (!navigated) throw new Error('Failed to navigate to PropertyGuru');

      await this.delay(this.getRandomDelay(3000, 5000));

      const cards = await page.$$('.agent-card');

      for (let i = 0; i < Math.min(cards.length, query.maxLeads || 20); i++) {
        try {
          const card = cards[i];

          const nameEl = await card.$('.agent-name');
          const name = nameEl ? ((await nameEl.textContent() ?? undefined) ?? '') : '';

          const phoneEl = await card.$('.agent-phone');
          const phone = phoneEl ? ((await phoneEl.textContent() ?? undefined) ?? '') : '';

          const whatsappEl = await card.$('.agent-whatsapp');
          const whatsapp = whatsappEl ? ((await whatsappEl.textContent() ?? undefined) ?? '') : '';

          const websiteEl = await card.$('.agent-website a');
          const website = websiteEl ? ((await websiteEl.getAttribute('href')) ?? '') : '';

          const profileLinkEl = await card.$('a.agent-profile');
          const href = profileLinkEl ? ((await profileLinkEl.getAttribute('href')) ?? '') : '';
          const sourceId = href ? (href.split('/').pop() ?? `propertyguru_${i}`) : `propertyguru_${i}`;

          leads.push({
            source: 'propertyguru',
            source_id: this.generateSourceId('propertyguru', sourceId),
            name: name?.trim() || 'PropertyGuru Agent',
            phone: phone ? this.normalizePhone(phone, 'SG') : undefined,
            whatsapp: whatsapp ? this.normalizePhone(whatsapp, 'SG') : undefined,
            website: website || undefined,
            city,
            country: 'SG',
            category: query.category,
            has_website: !!website,
            has_whatsapp: !!whatsapp,
            has_booking: false,
            has_ssl: true,
            market: 'SG',
            raw_data: { profile_url: href },
          });
        } catch {
          continue;
        }
      }
    } finally {
      await this.closeBrowser();
    }

    return leads;
  }
}

export class NinetyNineCoScraper extends BaseScraper {
  constructor(config: ScraperConfig = {}) {
    super(config);
  }

  async scrape(query: ScrapeQuery): Promise<ScrapedLead[]> {
    const page = await this.newPage();
    const leads: ScrapedLead[] = [];

    try {
      const city = query.city || 'Singapore';
      const searchUrl = `https://www.99.co/singapore/agents/${city.toLowerCase()}`;

      const navigated = await this.safeNavigate(page, searchUrl);
      if (!navigated) throw new Error('Failed to navigate to 99.co');

      await this.delay(this.getRandomDelay(3000, 5000));

      const cards = await page.$$('.agent-card');

      for (let i = 0; i < Math.min(cards.length, query.maxLeads || 20); i++) {
        try {
          const card = cards[i];

          const nameEl = await card.$('.agent-name');
          const name = nameEl ? ((await nameEl.textContent() ?? undefined) ?? '') : '';

          const phoneEl = await card.$('.agent-phone');
          const phone = phoneEl ? ((await phoneEl.textContent() ?? undefined) ?? '') : '';

          const whatsappEl = await card.$('.agent-whatsapp');
          const whatsapp = whatsappEl ? ((await whatsappEl.textContent() ?? undefined) ?? '') : '';

          const websiteEl = await card.$('.agent-website a');
          const website = websiteEl ? ((await websiteEl.getAttribute('href')) ?? '') : '';

          const profileLinkEl = await card.$('a.agent-profile');
          const href = profileLinkEl ? ((await profileLinkEl.getAttribute('href')) ?? '') : '';
          const sourceId = href ? (href.split('/').pop() ?? `99co_${i}`) : `99co_${i}`;

          leads.push({
            source: '99co',
            source_id: this.generateSourceId('99co', sourceId),
            name: name?.trim() || '99.co Agent',
            phone: phone ? this.normalizePhone(phone, 'SG') : undefined,
            whatsapp: whatsapp ? this.normalizePhone(whatsapp, 'SG') : undefined,
            website: website || undefined,
            city,
            country: 'SG',
            category: query.category,
            has_website: !!website,
            has_whatsapp: !!whatsapp,
            has_booking: false,
            has_ssl: true,
            market: 'SG',
            raw_data: { profile_url: href },
          });
        } catch {
          continue;
        }
      }
    } finally {
      await this.closeBrowser();
    }

    return leads;
  }
}

export class SRXScraper extends BaseScraper {
  constructor(config: ScraperConfig = {}) {
    super(config);
  }

  async scrape(query: ScrapeQuery): Promise<ScrapedLead[]> {
    const page = await this.newPage();
    const leads: ScrapedLead[] = [];

    try {
      const city = query.city || 'Singapore';
      const searchUrl = `https://www.srx.com.sg/agents/${city.toLowerCase()}`;

      const navigated = await this.safeNavigate(page, searchUrl);
      if (!navigated) throw new Error('Failed to navigate to SRX');

      await this.delay(this.getRandomDelay(3000, 5000));

      const cards = await page.$$('.agent-card');

      for (let i = 0; i < Math.min(cards.length, query.maxLeads || 20); i++) {
        try {
          const card = cards[i];

          const nameEl = await card.$('.agent-name');
          const name = nameEl ? ((await nameEl.textContent() ?? undefined) ?? '') : '';

          const phoneEl = await card.$('.agent-phone');
          const phone = phoneEl ? ((await phoneEl.textContent() ?? undefined) ?? '') : '';

          const whatsappEl = await card.$('.agent-whatsapp');
          const whatsapp = whatsappEl ? ((await whatsappEl.textContent() ?? undefined) ?? '') : '';

          const websiteEl = await card.$('.agent-website a');
          const website = websiteEl ? ((await websiteEl.getAttribute('href')) ?? '') : '';

          const profileLinkEl = await card.$('a.agent-profile');
          const href = profileLinkEl ? ((await profileLinkEl.getAttribute('href')) ?? '') : '';
          const sourceId = href ? (href.split('/').pop() ?? `srx_${i}`) : `srx_${i}`;

          leads.push({
            source: 'srx',
            source_id: this.generateSourceId('srx', sourceId),
            name: name?.trim() || 'SRX Agent',
            phone: phone ? this.normalizePhone(phone, 'SG') : undefined,
            whatsapp: whatsapp ? this.normalizePhone(whatsapp, 'SG') : undefined,
            website: website || undefined,
            city,
            country: 'SG',
            category: query.category,
            has_website: !!website,
            has_whatsapp: !!whatsapp,
            has_booking: false,
            has_ssl: true,
            market: 'SG',
            raw_data: { profile_url: href },
          });
        } catch {
          continue;
        }
      }
    } finally {
      await this.closeBrowser();
    }

    return leads;
  }
}

export class NinetyNineAcresScraper extends BaseScraper {
  constructor(config: ScraperConfig = {}) {
    super(config);
  }

  async scrape(query: ScrapeQuery): Promise<ScrapedLead[]> {
    const page = await this.newPage();
    const leads: ScrapedLead[] = [];

    try {
      const city = query.city || 'Mumbai';
      const state = query.state || 'Maharashtra';
      const searchUrl = `https://www.99acres.com/real-estate-agents/${city.toLowerCase()}-${state.toLowerCase()}`;

      const navigated = await this.safeNavigate(page, searchUrl);
      if (!navigated) throw new Error('Failed to navigate to 99acres');

      await this.delay(this.getRandomDelay(3000, 5000));

      const cards = await page.$$('.agent-card');

      for (let i = 0; i < Math.min(cards.length, query.maxLeads || 20); i++) {
        try {
          const card = cards[i];

          const nameEl = await card.$('.agent-name');
          const name = nameEl ? ((await nameEl.textContent() ?? undefined) ?? '') : '';

          const phoneEl = await card.$('.agent-phone');
          const phone = phoneEl ? ((await phoneEl.textContent() ?? undefined) ?? '') : '';

          const whatsappEl = await card.$('.agent-whatsapp');
          const whatsapp = whatsappEl ? ((await whatsappEl.textContent() ?? undefined) ?? '') : '';

          const websiteEl = await card.$('.agent-website a');
          const website = websiteEl ? ((await websiteEl.getAttribute('href')) ?? '') : '';

          const profileLinkEl = await card.$('a.agent-profile');
          const href = profileLinkEl ? ((await profileLinkEl.getAttribute('href')) ?? '') : '';
          const sourceId = href ? (href.split('/').pop() ?? `99acres_${i}`) : `99acres_${i}`;

          leads.push({
            source: '99acres',
            source_id: this.generateSourceId('99acres', sourceId),
            name: name?.trim() || '99acres Agent',
            phone: phone ? this.normalizePhone(phone, 'IN') : undefined,
            whatsapp: whatsapp ? this.normalizePhone(whatsapp, 'IN') : undefined,
            website: website || undefined,
            city,
            state,
            country: 'IN',
            category: query.category,
            has_website: !!website,
            has_whatsapp: !!whatsapp,
            has_booking: false,
            has_ssl: true,
            market: 'IN',
            raw_data: { profile_url: href },
          });
        } catch {
          continue;
        }
      }
    } finally {
      await this.closeBrowser();
    }

    return leads;
  }
}

export class MagicBricksScraper extends BaseScraper {
  constructor(config: ScraperConfig = {}) {
    super(config);
  }

  async scrape(query: ScrapeQuery): Promise<ScrapedLead[]> {
    const page = await this.newPage();
    const leads: ScrapedLead[] = [];

    try {
      const city = query.city || 'Mumbai';
      const state = query.state || 'Maharashtra';
      const searchUrl = `https://www.magicbricks.com/real-estate-agents/${city.toLowerCase()}-${state.toLowerCase()}`;

      const navigated = await this.safeNavigate(page, searchUrl);
      if (!navigated) throw new Error('Failed to navigate to MagicBricks');

      await this.delay(this.getRandomDelay(3000, 5000));

      const cards = await page.$$('.agent-card');

      for (let i = 0; i < Math.min(cards.length, query.maxLeads || 20); i++) {
        try {
          const card = cards[i];

          const nameEl = await card.$('.agent-name');
          const name = nameEl ? ((await nameEl.textContent() ?? undefined) ?? '') : '';

          const phoneEl = await card.$('.agent-phone');
          const phone = phoneEl ? ((await phoneEl.textContent() ?? undefined) ?? '') : '';

          const whatsappEl = await card.$('.agent-whatsapp');
          const whatsapp = whatsappEl ? ((await whatsappEl.textContent() ?? undefined) ?? '') : '';

          const websiteEl = await card.$('.agent-website a');
          const website = websiteEl ? ((await websiteEl.getAttribute('href')) ?? '') : '';

          const profileLinkEl = await card.$('a.agent-profile');
          const href = profileLinkEl ? ((await profileLinkEl.getAttribute('href')) ?? '') : '';
          const sourceId = href ? (href.split('/').pop() ?? `magicbricks_${i}`) : `magicbricks_${i}`;

          leads.push({
            source: 'magicbricks',
            source_id: this.generateSourceId('magicbricks', sourceId),
            name: name?.trim() || 'MagicBricks Agent',
            phone: phone ? this.normalizePhone(phone, 'IN') : undefined,
            whatsapp: whatsapp ? this.normalizePhone(whatsapp, 'IN') : undefined,
            website: website || undefined,
            city,
            state,
            country: 'IN',
            category: query.category,
            has_website: !!website,
            has_whatsapp: !!whatsapp,
            has_booking: false,
            has_ssl: true,
            market: 'IN',
            raw_data: { profile_url: href },
          });
        } catch {
          continue;
        }
      }
    } finally {
      await this.closeBrowser();
    }

    return leads;
  }
}

export class HousingScraper extends BaseScraper {
  constructor(config: ScraperConfig = {}) {
    super(config);
  }

  async scrape(query: ScrapeQuery): Promise<ScrapedLead[]> {
    const page = await this.newPage();
    const leads: ScrapedLead[] = [];

    try {
      const city = query.city || 'Mumbai';
      const state = query.state || 'Maharashtra';
      const searchUrl = `https://housing.com/real-estate-agents/${city.toLowerCase()}-${state.toLowerCase()}`;

      const navigated = await this.safeNavigate(page, searchUrl);
      if (!navigated) throw new Error('Failed to navigate to Housing');

      await this.delay(this.getRandomDelay(3000, 5000));

      const cards = await page.$$('.agent-card');

      for (let i = 0; i < Math.min(cards.length, query.maxLeads || 20); i++) {
        try {
          const card = cards[i];

          const nameEl = await card.$('.agent-name');
          const name = nameEl ? ((await nameEl.textContent() ?? undefined) ?? '') : '';

          const phoneEl = await card.$('.agent-phone');
          const phone = phoneEl ? ((await phoneEl.textContent() ?? undefined) ?? '') : '';

          const whatsappEl = await card.$('.agent-whatsapp');
          const whatsapp = whatsappEl ? ((await whatsappEl.textContent() ?? undefined) ?? '') : '';

          const websiteEl = await card.$('.agent-website a');
          const website = websiteEl ? ((await websiteEl.getAttribute('href')) ?? '') : '';

          const profileLinkEl = await card.$('a.agent-profile');
          const href = profileLinkEl ? ((await profileLinkEl.getAttribute('href')) ?? '') : '';
          const sourceId = href ? (href.split('/').pop() ?? `housing_${i}`) : `housing_${i}`;

          leads.push({
            source: 'housing',
            source_id: this.generateSourceId('housing', sourceId),
            name: name?.trim() || 'Housing Agent',
            phone: phone ? this.normalizePhone(phone, 'IN') : undefined,
            whatsapp: whatsapp ? this.normalizePhone(whatsapp, 'IN') : undefined,
            website: website || undefined,
            city,
            state,
            country: 'IN',
            category: query.category,
            has_website: !!website,
            has_whatsapp: !!whatsapp,
            has_booking: false,
            has_ssl: true,
            market: 'IN',
            raw_data: { profile_url: href },
          });
        } catch {
          continue;
        }
      }
    } finally {
      await this.closeBrowser();
    }

    return leads;
  }
}

export class SUUMOScraper extends BaseScraper {
  constructor(config: ScraperConfig = {}) {
    super(config);
  }

  async scrape(query: ScrapeQuery): Promise<ScrapedLead[]> {
    const page = await this.newPage();
    const leads: ScrapedLead[] = [];

    try {
      const city = query.city || 'Tokyo';
      const searchUrl = `https://suumo.jp/jj/kaiin/ichiran/${city.toLowerCase()}/`;

      const navigated = await this.safeNavigate(page, searchUrl);
      if (!navigated) throw new Error('Failed to navigate to SUUMO');

      await this.delay(this.getRandomDelay(3000, 5000));

      const cards = await page.$$('.agent-card');

      for (let i = 0; i < Math.min(cards.length, query.maxLeads || 20); i++) {
        try {
          const card = cards[i];

          const nameEl = await card.$('.agent-name');
          const name = nameEl ? ((await nameEl.textContent() ?? undefined) ?? '') : '';

          const phoneEl = await card.$('.agent-phone');
          const phone = phoneEl ? ((await phoneEl.textContent() ?? undefined) ?? '') : '';

          const websiteEl = await card.$('.agent-website a');
          const website = websiteEl ? ((await websiteEl.getAttribute('href')) ?? '') : '';

          const profileLinkEl = await card.$('a.agent-profile');
          const href = profileLinkEl ? ((await profileLinkEl.getAttribute('href')) ?? '') : '';
          const sourceId = href ? (href.split('/').pop() ?? `suumo_${i}`) : `suumo_${i}`;

          leads.push({
            source: 'suumo',
            source_id: this.generateSourceId('suumo', sourceId),
            name: name?.trim() || 'SUUMO Agent',
            phone: phone ? this.normalizePhone(phone, 'JP') : undefined,
            website: website || undefined,
            city,
            country: 'JP',
            category: query.category,
            has_website: !!website,
            has_whatsapp: false,
            has_booking: false,
            has_ssl: true,
            market: 'JP',
            raw_data: { profile_url: href },
          });
        } catch {
          continue;
        }
      }
    } finally {
      await this.closeBrowser();
    }

    return leads;
  }
}

export class AtHomeScraper extends BaseScraper {
  constructor(config: ScraperConfig = {}) {
    super(config);
  }

  async scrape(query: ScrapeQuery): Promise<ScrapedLead[]> {
    const page = await this.newPage();
    const leads: ScrapedLead[] = [];

    try {
      const city = query.city || 'Tokyo';
      const searchUrl = `https://www.athome.co.jp/kaiin/ichiran/${city.toLowerCase()}/`;

      const navigated = await this.safeNavigate(page, searchUrl);
      if (!navigated) throw new Error('Failed to navigate to AtHome');

      await this.delay(this.getRandomDelay(3000, 5000));

      const cards = await page.$$('.agent-card');

      for (let i = 0; i < Math.min(cards.length, query.maxLeads || 20); i++) {
        try {
          const card = cards[i];

          const nameEl = await card.$('.agent-name');
          const name = nameEl ? ((await nameEl.textContent() ?? undefined) ?? '') : '';

          const phoneEl = await card.$('.agent-phone');
          const phone = phoneEl ? ((await phoneEl.textContent() ?? undefined) ?? '') : '';

          const websiteEl = await card.$('.agent-website a');
          const website = websiteEl ? ((await websiteEl.getAttribute('href')) ?? '') : '';

          const profileLinkEl = await card.$('a.agent-profile');
          const href = profileLinkEl ? ((await profileLinkEl.getAttribute('href')) ?? '') : '';
          const sourceId = href ? (href.split('/').pop() ?? `athome_${i}`) : `athome_${i}`;

          leads.push({
            source: 'athome',
            source_id: this.generateSourceId('athome', sourceId),
            name: name?.trim() || 'AtHome Agent',
            phone: phone ? this.normalizePhone(phone, 'JP') : undefined,
            website: website || undefined,
            city,
            country: 'JP',
            category: query.category,
            has_website: !!website,
            has_whatsapp: false,
            has_booking: false,
            has_ssl: true,
            market: 'JP',
            raw_data: { profile_url: href },
          });
        } catch {
          continue;
        }
      }
    } finally {
      await this.closeBrowser();
    }

    return leads;
  }
}

export class HomesScraper extends BaseScraper {
  constructor(config: ScraperConfig = {}) {
    super(config);
  }

  async scrape(query: ScrapeQuery): Promise<ScrapedLead[]> {
    const page = await this.newPage();
    const leads: ScrapedLead[] = [];

    try {
      const city = query.city || 'Tokyo';
      const searchUrl = `https://www.homes.co.jp/kaiin/ichiran/${city.toLowerCase()}/`;

      const navigated = await this.safeNavigate(page, searchUrl);
      if (!navigated) throw new Error('Failed to navigate to Homes');

      await this.delay(this.getRandomDelay(3000, 5000));

      const cards = await page.$$('.agent-card');

      for (let i = 0; i < Math.min(cards.length, query.maxLeads || 20); i++) {
        try {
          const card = cards[i];

          const nameEl = await card.$('.agent-name');
          const name = nameEl ? ((await nameEl.textContent() ?? undefined) ?? '') : '';

          const phoneEl = await card.$('.agent-phone');
          const phone = phoneEl ? ((await phoneEl.textContent() ?? undefined) ?? '') : '';

          const websiteEl = await card.$('.agent-website a');
          const website = websiteEl ? ((await websiteEl.getAttribute('href')) ?? '') : '';

          const profileLinkEl = await card.$('a.agent-profile');
          const href = profileLinkEl ? ((await profileLinkEl.getAttribute('href')) ?? '') : '';
          const sourceId = href ? (href.split('/').pop() ?? `homes_${i}`) : `homes_${i}`;

          leads.push({
            source: 'homes',
            source_id: this.generateSourceId('homes', sourceId),
            name: name?.trim() || 'Homes Agent',
            phone: phone ? this.normalizePhone(phone, 'JP') : undefined,
            website: website || undefined,
            city,
            country: 'JP',
            category: query.category,
            has_website: !!website,
            has_whatsapp: false,
            has_booking: false,
            has_ssl: true,
            market: 'JP',
            raw_data: { profile_url: href },
          });
        } catch {
          continue;
        }
      }
    } finally {
      await this.closeBrowser();
    }

    return leads;
  }
}

export const AU_SCRAPERS = [DomainScraper, RealEstateAuScraper, ReiwaScraper];
export const SG_SCRAPERS = [PropertyGuruScraper, NinetyNineCoScraper, SRXScraper];
export const IN_SCRAPERS = [NinetyNineAcresScraper, MagicBricksScraper, HousingScraper];
export const JP_SCRAPERS = [SUUMOScraper, AtHomeScraper, HomesScraper];