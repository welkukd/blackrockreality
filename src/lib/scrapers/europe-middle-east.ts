import { BaseScraper, ScrapeQuery, ScrapedLead, ScraperConfig } from './base';

export class RightmoveScraper extends BaseScraper {
  constructor(config: ScraperConfig = {}) {
    super(config);
  }

  async scrape(query: ScrapeQuery): Promise<ScrapedLead[]> {
    const page = await this.newPage();
    const leads: ScrapedLead[] = [];

    try {
      const city = query.city || 'London';
      const searchUrl = `https://www.rightmove.co.uk/estate-agents/branch.html?searchLocation=${encodeURIComponent(city)}`;

      const navigated = await this.safeNavigate(page, searchUrl);
      if (!navigated) throw new Error('Failed to navigate to Rightmove');

      await this.delay(this.getRandomDelay(3000, 5000));

      const cards = await page.$$('.branchCard');

      for (let i = 0; i < Math.min(cards.length, query.maxLeads || 20); i++) {
        try {
          const card = cards[i];

          const nameEl = await card.$('.branchCard-title');
          const name = nameEl ? ((await nameEl.textContent() ?? undefined) ?? '') : '';

          const phoneEl = await card.$('.branchCard-phone');
          const phone = phoneEl ? ((await phoneEl.textContent() ?? undefined) ?? '') : '';

          const websiteEl = await card.$('.branchCard-website a');
          const website = websiteEl ? ((await websiteEl.getAttribute('href')) ?? '') : '';

          const linkEl = await card.$('.branchCard-title a');
          const href = linkEl ? ((await linkEl.getAttribute('href')) ?? '') : '';
          const sourceId = href ? (href.split('/').pop() ?? `rightmove_${i}`) : `rightmove_${i}`;

          leads.push({
            source: 'rightmove',
            source_id: this.generateSourceId('rightmove', sourceId),
            name: name?.trim() || 'Rightmove Agent',
            phone: phone ? this.normalizePhone(phone, 'UK') : undefined,
            website: website || undefined,
            city,
            country: 'UK',
            category: query.category,
            has_website: !!website,
            has_whatsapp: false,
            has_booking: false,
            has_ssl: true,
            market: 'UK',
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

export class ZooplaScraper extends BaseScraper {
  constructor(config: ScraperConfig = {}) {
    super(config);
  }

  async scrape(query: ScrapeQuery): Promise<ScrapedLead[]> {
    const page = await this.newPage();
    const leads: ScrapedLead[] = [];

    try {
      const city = query.city || 'London';
      const searchUrl = `https://www.zoopla.co.uk/find-agents/estate-agents/${city.toLowerCase()}/`;

      const navigated = await this.safeNavigate(page, searchUrl);
      if (!navigated) throw new Error('Failed to navigate to Zoopla');

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

          const profileLinkEl = await card.$('a.agent-profile-link');
          const href = profileLinkEl ? ((await profileLinkEl.getAttribute('href')) ?? '') : '';
          const sourceId = href ? (href.split('/').pop() ?? `zoopla_${i}`) : `zoopla_${i}`;

          leads.push({
            source: 'zoopla',
            source_id: this.generateSourceId('zoopla', sourceId),
            name: name?.trim() || 'Zoopla Agent',
            phone: phone ? this.normalizePhone(phone, 'UK') : undefined,
            website: website || undefined,
            city,
            country: 'UK',
            category: query.category,
            has_website: !!website,
            has_whatsapp: false,
            has_booking: false,
            has_ssl: true,
            market: 'UK',
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

export class OnTheMarketScraper extends BaseScraper {
  constructor(config: ScraperConfig = {}) {
    super(config);
  }

  async scrape(query: ScrapeQuery): Promise<ScrapedLead[]> {
    const page = await this.newPage();
    const leads: ScrapedLead[] = [];

    try {
      const city = query.city || 'London';
      const searchUrl = `https://www.onthemarket.com/agents/office/${city.toLowerCase()}/`;

      const navigated = await this.safeNavigate(page, searchUrl);
      if (!navigated) throw new Error('Failed to navigate to OnTheMarket');

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
          const sourceId = href ? (href.split('/').pop() ?? `onthemarket_${i}`) : `onthemarket_${i}`;

          leads.push({
            source: 'onthemarket',
            source_id: this.generateSourceId('onthemarket', sourceId),
            name: name?.trim() || 'OnTheMarket Agent',
            phone: phone ? this.normalizePhone(phone, 'UK') : undefined,
            website: website || undefined,
            city,
            country: 'UK',
            category: query.category,
            has_website: !!website,
            has_whatsapp: false,
            has_booking: false,
            has_ssl: true,
            market: 'UK',
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

export class BayutScraper extends BaseScraper {
  constructor(config: ScraperConfig = {}) {
    super(config);
  }

  async scrape(query: ScrapeQuery): Promise<ScrapedLead[]> {
    const page = await this.newPage();
    const leads: ScrapedLead[] = [];

    try {
      const city = query.city || 'Dubai';
      const searchUrl = `https://www.bayut.com/brokers/uae/${city.toLowerCase()}/`;

      const navigated = await this.safeNavigate(page, searchUrl);
      if (!navigated) throw new Error('Failed to navigate to Bayut');

      await this.delay(this.getRandomDelay(3000, 5000));

      const cards = await page.$$('.broker-card');

      for (let i = 0; i < Math.min(cards.length, query.maxLeads || 20); i++) {
        try {
          const card = cards[i];

          const nameEl = await card.$('.broker-name');
          const name = nameEl ? ((await nameEl.textContent() ?? undefined) ?? '') : '';

          const phoneEl = await card.$('.broker-phone');
          const phone = phoneEl ? ((await phoneEl.textContent() ?? undefined) ?? '') : '';

          const whatsappEl = await card.$('.broker-whatsapp');
          const whatsapp = whatsappEl ? ((await whatsappEl.textContent() ?? undefined) ?? '') : '';

          const websiteEl = await card.$('.broker-website a');
          const website = websiteEl ? ((await websiteEl.getAttribute('href')) ?? '') : '';

          const profileLinkEl = await card.$('a.broker-profile');
          const href = profileLinkEl ? ((await profileLinkEl.getAttribute('href')) ?? '') : '';
          const sourceId = href ? (href.split('/').pop() ?? `bayut_${i}`) : `bayut_${i}`;

          leads.push({
            source: 'bayut',
            source_id: this.generateSourceId('bayut', sourceId),
            name: name?.trim() || 'Bayut Agent',
            phone: phone ? this.normalizePhone(phone, 'AE') : undefined,
            whatsapp: whatsapp ? this.normalizePhone(whatsapp, 'AE') : undefined,
            website: website || undefined,
            city,
            country: 'AE',
            category: query.category,
            has_website: !!website,
            has_whatsapp: !!whatsapp,
            has_booking: false,
            has_ssl: true,
            market: 'AE',
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

export class PropertyFinderScraper extends BaseScraper {
  constructor(config: ScraperConfig = {}) {
    super(config);
  }

  async scrape(query: ScrapeQuery): Promise<ScrapedLead[]> {
    const page = await this.newPage();
    const leads: ScrapedLead[] = [];

    try {
      const city = query.city || 'Dubai';
      const searchUrl = `https://www.propertyfinder.ae/en/brokers/${city.toLowerCase()}.html`;

      const navigated = await this.safeNavigate(page, searchUrl);
      if (!navigated) throw new Error('Failed to navigate to Property Finder');

      await this.delay(this.getRandomDelay(3000, 5000));

      const cards = await page.$$('.broker-card');

      for (let i = 0; i < Math.min(cards.length, query.maxLeads || 20); i++) {
        try {
          const card = cards[i];

          const nameEl = await card.$('.broker-name');
          const name = nameEl ? ((await nameEl.textContent() ?? undefined) ?? '') : '';

          const phoneEl = await card.$('.broker-phone');
          const phone = phoneEl ? ((await phoneEl.textContent() ?? undefined) ?? '') : '';

          const whatsappEl = await card.$('.broker-whatsapp');
          const whatsapp = whatsappEl ? ((await whatsappEl.textContent() ?? undefined) ?? '') : '';

          const websiteEl = await card.$('.broker-website a');
          const website = websiteEl ? ((await websiteEl.getAttribute('href')) ?? '') : '';

          const profileLinkEl = await card.$('a.broker-profile');
          const href = profileLinkEl ? ((await profileLinkEl.getAttribute('href')) ?? '') : '';
          const sourceId = href ? (href.split('/').pop() ?? `propertyfinder_${i}`) : `propertyfinder_${i}`;

          leads.push({
            source: 'property_finder',
            source_id: this.generateSourceId('property_finder', sourceId),
            name: name?.trim() || 'Property Finder Agent',
            phone: phone ? this.normalizePhone(phone, 'AE') : undefined,
            whatsapp: whatsapp ? this.normalizePhone(whatsapp, 'AE') : undefined,
            website: website || undefined,
            city,
            country: 'AE',
            category: query.category,
            has_website: !!website,
            has_whatsapp: !!whatsapp,
            has_booking: false,
            has_ssl: true,
            market: 'AE',
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

export class DubizzleScraper extends BaseScraper {
  constructor(config: ScraperConfig = {}) {
    super(config);
  }

  async scrape(query: ScrapeQuery): Promise<ScrapedLead[]> {
    const page = await this.newPage();
    const leads: ScrapedLead[] = [];

    try {
      const city = query.city || 'Dubai';
      const searchUrl = `https://www.dubizzle.com/property/brokers/${city.toLowerCase()}/`;

      const navigated = await this.safeNavigate(page, searchUrl);
      if (!navigated) throw new Error('Failed to navigate to Dubizzle');

      await this.delay(this.getRandomDelay(3000, 5000));

      const cards = await page.$$('.broker-card');

      for (let i = 0; i < Math.min(cards.length, query.maxLeads || 20); i++) {
        try {
          const card = cards[i];

          const nameEl = await card.$('.broker-name');
          const name = nameEl ? ((await nameEl.textContent() ?? undefined) ?? '') : '';

          const phoneEl = await card.$('.broker-phone');
          const phone = phoneEl ? ((await phoneEl.textContent() ?? undefined) ?? '') : '';

          const whatsappEl = await card.$('.broker-whatsapp');
          const whatsapp = whatsappEl ? ((await whatsappEl.textContent() ?? undefined) ?? '') : '';

          const websiteEl = await card.$('.broker-website a');
          const website = websiteEl ? ((await websiteEl.getAttribute('href')) ?? '') : '';

          const profileLinkEl = await card.$('a.broker-profile');
          const href = profileLinkEl ? ((await profileLinkEl.getAttribute('href')) ?? '') : '';
          const sourceId = href ? (href.split('/').pop() ?? `dubizzle_${i}`) : `dubizzle_${i}`;

          leads.push({
            source: 'dubizzle',
            source_id: this.generateSourceId('dubizzle', sourceId),
            name: name?.trim() || 'Dubizzle Agent',
            phone: phone ? this.normalizePhone(phone, 'AE') : undefined,
            whatsapp: whatsapp ? this.normalizePhone(whatsapp, 'AE') : undefined,
            website: website || undefined,
            city,
            country: 'AE',
            category: query.category,
            has_website: !!website,
            has_whatsapp: !!whatsapp,
            has_booking: false,
            has_ssl: true,
            market: 'AE',
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

export const UK_SCRAPERS = [RightmoveScraper, ZooplaScraper, OnTheMarketScraper];
export const AE_SCRAPERS = [BayutScraper, PropertyFinderScraper, DubizzleScraper];