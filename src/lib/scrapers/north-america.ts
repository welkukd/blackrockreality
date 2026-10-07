import { BaseScraper, ScrapeQuery, ScrapedLead, ScraperConfig } from './base';

export class ZillowScraper extends BaseScraper {
  constructor(config: ScraperConfig = {}) {
    super(config);
  }

  async scrape(query: ScrapeQuery): Promise<ScrapedLead[]> {
    const page = await this.newPage();
    const leads: ScrapedLead[] = [];

    try {
      const city = query.city || 'Los Angeles';
      const state = query.state || 'CA';
      const category = query.category || 'homes';
      const searchUrl = `https://www.zillow.com/${city}-${state}/${category}/`;

      const navigated = await this.safeNavigate(page, searchUrl);
      if (!navigated) throw new Error('Failed to navigate to Zillow');

      await this.delay(this.getRandomDelay(3000, 5000));

      const cards = await page.$$('[data-testid="property-card"]');
      
      for (let i = 0; i < Math.min(cards.length, query.maxLeads || 20); i++) {
        try {
          const card = cards[i];
          
          const nameEl = await card.$('[data-testid="property-card-addr"]');
          const name = nameEl ? ((await nameEl.textContent() ?? undefined) ?? '') : '';
          
          const priceEl = await card.$('[data-testid="property-card-price"]');
          const priceText = priceEl ? ((await priceEl.textContent() ?? undefined) ?? '') : '';
          
          const linkEl = await card.$('a[data-testid="property-card-link"]');
          const href = linkEl ? ((await linkEl.getAttribute('href')) ?? '') : '';
          const sourceId = href ? (href.split('/').pop() ?? `zillow_${i}`) : `zillow_${i}`;
          
          await card.click();
          await this.delay(this.getRandomDelay(2000, 4000));
          
          const agentNameEl = await page.$('[data-testid="agent-name"]');
          const agentName = agentNameEl ? ((await agentNameEl.textContent() ?? undefined) ?? '') : '';
          
          const agentPhoneEl = await page.$('[data-testid="agent-phone"]');
          const agentPhone = agentPhoneEl ? ((await agentPhoneEl.textContent() ?? undefined) ?? '') : '';
          
          const agentWebsiteEl = await page.$('[data-testid="agent-website"] a');
          const agentWebsite = agentWebsiteEl ? ((await agentWebsiteEl.getAttribute('href')) ?? '') : '';
          
          await page.goBack();
          await this.delay(this.getRandomDelay(1000, 2000));

          leads.push({
            source: 'zillow',
            source_id: this.generateSourceId('zillow', sourceId),
            name: agentName?.trim() || name?.trim() || 'Zillow Agent',
            phone: agentPhone ? this.normalizePhone(agentPhone, 'US') : undefined,
            website: agentWebsite || undefined,
            address: name?.trim(),
            city,
            state,
            country: 'US',
            category: query.category,
            has_website: !!agentWebsite,
            has_whatsapp: false,
            has_booking: false,
            has_ssl: true,
            market: 'US',
            raw_data: { price: priceText, listing_url: href },
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

export class RealtorComScraper extends BaseScraper {
  constructor(config: ScraperConfig = {}) {
    super(config);
  }

  async scrape(query: ScrapeQuery): Promise<ScrapedLead[]> {
    const page = await this.newPage();
    const leads: ScrapedLead[] = [];

    try {
      const city = query.city || 'Los Angeles';
      const state = query.state || 'CA';
      const searchUrl = `https://www.realtor.com/realestateagents/${city}_${state}`;

      const navigated = await this.safeNavigate(page, searchUrl);
      if (!navigated) throw new Error('Failed to navigate to Realtor.com');

      await this.delay(this.getRandomDelay(3000, 5000));

      const cards = await page.$$('[data-testid="agent-card"]');
      
      for (let i = 0; i < Math.min(cards.length, query.maxLeads || 20); i++) {
        try {
          const card = cards[i];
          
          const nameEl = await card.$('[data-testid="agent-name"]');
          const name = nameEl ? ((await nameEl.textContent() ?? undefined) ?? '') : '';
          
          const phoneEl = await card.$('[data-testid="agent-phone"]');
          const phone = phoneEl ? ((await phoneEl.textContent() ?? undefined) ?? '') : '';
          
          const websiteEl = await card.$('[data-testid="agent-website"] a');
          const website = websiteEl ? ((await websiteEl.getAttribute('href')) ?? '') : '';
          
          const profileLinkEl = await card.$('a[data-testid="agent-profile-link"]');
          const href = profileLinkEl ? ((await profileLinkEl.getAttribute('href')) ?? '') : '';
          const sourceId = href ? (href.split('/').pop() ?? `realtor_${i}`) : `realtor_${i}`;

          leads.push({
            source: 'realtor_com',
            source_id: this.generateSourceId('realtor_com', sourceId),
            name: name?.trim() || 'Realtor.com Agent',
            phone: phone ? this.normalizePhone(phone, 'US') : undefined,
            website: website || undefined,
            city,
            state,
            country: 'US',
            category: query.category,
            has_website: !!website,
            has_whatsapp: false,
            has_booking: false,
            has_ssl: true,
            market: 'US',
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

export class RealtorCaScraper extends BaseScraper {
  constructor(config: ScraperConfig = {}) {
    super(config);
  }

  async scrape(query: ScrapeQuery): Promise<ScrapedLead[]> {
    const page = await this.newPage();
    const leads: ScrapedLead[] = [];

    try {
      const city = query.city || 'Toronto';
      const province = query.state || 'ON';
      const searchUrl = `https://www.realtor.ca/real-estate-agents/${province}/${city}`;

      const navigated = await this.safeNavigate(page, searchUrl);
      if (!navigated) throw new Error('Failed to navigate to Realtor.ca');

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
          const sourceId = href ? (href.split('/').pop() ?? `realtor_ca_${i}`) : `realtor_ca_${i}`;

          leads.push({
            source: 'realtor_ca',
            source_id: this.generateSourceId('realtor_ca', sourceId),
            name: name?.trim() || 'Realtor.ca Agent',
            phone: phone ? this.normalizePhone(phone, 'CA') : undefined,
            website: website || undefined,
            city,
            state: province,
            country: 'CA',
            category: query.category,
            has_website: !!website,
            has_whatsapp: false,
            has_booking: false,
            has_ssl: true,
            market: 'CA',
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

export class ZoloScraper extends BaseScraper {
  constructor(config: ScraperConfig = {}) {
    super(config);
  }

  async scrape(query: ScrapeQuery): Promise<ScrapedLead[]> {
    const page = await this.newPage();
    const leads: ScrapedLead[] = [];

    try {
      const city = query.city || 'Toronto';
      const province = query.state || 'ON';
      const searchUrl = `https://www.zolo.ca/${province}/${city.toLowerCase()}/real-agents`;

      const navigated = await this.safeNavigate(page, searchUrl);
      if (!navigated) throw new Error('Failed to navigate to Zolo');

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
          
          const profileLinkEl = await card.$('a[href*="/agent/"]');
          const href = profileLinkEl ? ((await profileLinkEl.getAttribute('href')) ?? '') : '';
          const sourceId = href ? (href.split('/').pop() ?? `zolo_${i}`) : `zolo_${i}`;

          leads.push({
            source: 'zolo',
            source_id: this.generateSourceId('zolo', sourceId),
            name: name?.trim() || 'Zolo Agent',
            phone: phone ? this.normalizePhone(phone, 'CA') : undefined,
            website: website || undefined,
            city,
            state: province,
            country: 'CA',
            category: query.category,
            has_website: !!website,
            has_whatsapp: false,
            has_booking: false,
            has_ssl: true,
            market: 'CA',
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

export const US_SCRAPERS = [ZillowScraper, RealtorComScraper];
export const CA_SCRAPERS = [RealtorCaScraper, ZoloScraper];