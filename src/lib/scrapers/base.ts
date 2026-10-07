import { Browser, Page } from 'playwright';

export interface ScraperConfig {
  headless?: boolean;
  timeout?: number;
  userAgent?: string;
  viewport?: { width: number; height: number };
}

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

export abstract class BaseScraper {
  protected config: ScraperConfig;
  protected leads: ScrapedLead[] = [];
  protected browser: Browser | null = null;

  constructor(config: ScraperConfig = {}) {
    this.config = {
      headless: true,
      timeout: 30000,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      viewport: { width: 1280, height: 800 },
      ...config,
    };
  }

  abstract scrape(query: ScrapeQuery): Promise<ScrapedLead[]>;

  protected async initBrowser(): Promise<Browser> {
    if (this.browser) return this.browser;
    const { chromium } = await import('playwright');
    this.browser = await chromium.launch({
      headless: this.config.headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
    return this.browser;
  }

  protected async newPage(): Promise<Page> {
    const browser = await this.initBrowser();
    const context = await browser.newContext({
      userAgent: this.config.userAgent,
      viewport: this.config.viewport,
      locale: 'en-US',
    });
    const page = await context.newPage();
    page.setDefaultTimeout(this.config.timeout || 30000);
    return page;
  }

  public async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  protected async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  protected getRandomDelay(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  protected async safeNavigate(page: Page, url: string): Promise<boolean> {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: this.config.timeout });
      return true;
    } catch {
      return false;
    }
  }

  protected async waitForSelector(page: Page, selector: string, timeout?: number): Promise<boolean> {
    try {
      await page.waitForSelector(selector, { timeout: timeout || 10000 });
      return true;
    } catch {
      return false;
    }
  }

  protected normalizePhone(phone: string, countryCode: string): string {
    const digits = phone.replace(/\D/g, '');
    const countryPrefixes: Record<string, string> = {
      US: '1', CA: '1', UK: '44', AE: '971', AU: '61', SG: '65', IN: '91', JP: '81',
    };
    const prefix = countryPrefixes[countryCode] || '1';
    if (digits.startsWith(prefix)) return `+${digits}`;
    if (digits.startsWith('0')) return `+${prefix}${digits.slice(1)}`;
    return `+${prefix}${digits}`;
  }

  protected generateSourceId(source: string, identifier: string): string {
    return `${source}_${identifier.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
  }
}

export interface ScrapeQuery {
  market: string;
  country: string;
  category?: string;
  city?: string;
  state?: string;
  maxLeads?: number;
}

export interface ScraperResult {
  leads: ScrapedLead[];
  errors: Record<string, string>;
}

export async function runScrapersParallel(
  scraperClasses: (new (config: ScraperConfig) => BaseScraper)[],
  query: ScrapeQuery,
  maxConcurrent: number = 3
): Promise<ScraperResult> {
  const allLeads: ScrapedLead[] = [];
  const errors: Record<string, string> = {};

  const queue = [...scraperClasses];
  const running: Promise<void>[] = [];

  const processQueue = async () => {
    while (queue.length > 0) {
      const ScraperClass = queue.shift()!;
      const scraper = new ScraperClass({ headless: true });
      const scraperName = ScraperClass.name;

      const promise = (async () => {
        try {
          const leads = await scraper.scrape(query);
          allLeads.push(...leads);
        } catch (error) {
          errors[scraperName] = error instanceof Error ? error.message : 'Unknown error';
        } finally {
          await scraper.closeBrowser();
        }
      })();

      running.push(promise);

      if (running.length >= maxConcurrent) {
        await Promise.race(running);
        const completedIndex = running.findIndex((p) => p === Promise.race(running));
        if (completedIndex !== -1) running.splice(completedIndex, 1);
      }
    }

    await Promise.all(running);
  };

  await processQueue();

  // Deduplicate by source_id
  const seen = new Set<string>();
  const uniqueLeads = allLeads.filter((lead) => {
    const key = `${lead.source}:${lead.source_id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { leads: uniqueLeads, errors };
}