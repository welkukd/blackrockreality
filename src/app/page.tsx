'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6">
              Global Real Estate Lead Generation Platform
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Find Qualified Real Estate Leads
              <span className="block text-yellow-300">Worldwide</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-2xl">
              Scrape 50+ global property portals. Grade leads with market-specific AI. 
              Sell qualified leads to licensed agents. No license required.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-white text-blue-900 font-semibold rounded-lg hover:bg-white/90 transition-colors"
              >
                Start Free
              </Link>
              <Link
                href="/docs"
                className="px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:border-white/50 transition-colors"
              >
                View API Docs
              </Link>
            </div>
          </div>
        </div>
        
        {/* Trust indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-12 text-white/60 text-sm">
          <span>50+ Portals</span>
          <span>8 Markets</span>
          <span>Real-time Grading</span>
          <span>Free Tier Available</span>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built for Global Scale
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              One platform. Every major market. Automated lead generation that works while you sleep.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Multi-Market Scraping',
                desc: 'Zillow, Realtor.com, Rightmove, Zoopla, Bayut, 99acres, Domain, SUUMO, and 40+ more portals across US, UK, UAE, AU, SG, IN, JP, CA.',
                icon: '🌍',
              },
              {
                title: 'Market-Specific Grading',
                desc: 'AI grading tuned per market: WhatsApp weight in UAE/India, booking systems in US/UK, timeline urgency signals everywhere. No website = Grade A.',
                icon: '🎯',
              },
              {
                title: 'Agent-Ready API',
                desc: 'REST API with API key auth, rate limiting, webhook support. Agents buy leads via subscription or per-lead. White-label dashboard included.',
                icon: '⚡',
              },
              {
                title: 'SEO Content Engine',
                desc: 'Programmatic pages for "buy property in [city]", "[market] real estate guide", "[country] property investment". Auto-generates 10,000+ pages.',
                icon: '📈',
              },
              {
                title: 'WhatsApp Integration',
                desc: 'Gupshup Business API for instant lead notifications. Template messages for new leads, follow-ups, property alerts. 1000 free msgs/month.',
                icon: '💬',
              },
              {
                title: 'Free-Tier Deploy',
                desc: 'Vercel Hobby + Supabase Free + Groq Free + Resend Free. $0/month to start. Scales to millions of leads without infrastructure changes.',
                icon: '💰',
              },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Markets */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Live Markets
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each market has custom portal scrapers, grading weights, and compliance handling.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { flag: '🇺🇸', name: 'United States', portals: 'Zillow, Realtor.com, Redfin, Trulia', leads: 'High volume, high value' },
              { flag: '🇨🇦', name: 'Canada', portals: 'Realtor.ca, Zolo, Point2, REW', leads: 'Stable, mortgage-ready buyers' },
              { flag: '🇬🇧', name: 'United Kingdom', portals: 'Rightmove, Zoopla, OnTheMarket', leads: 'Chain-free, cash buyers' },
              { flag: '🇦🇪', name: 'UAE', portals: 'Bayut, Property Finder, Dubizzle', leads: 'Golden Visa, off-plan investors' },
              { flag: '🇦🇺', name: 'Australia', portals: 'Domain, Realestate.com.au, REIWA', leads: 'Pre-approval, investors' },
              { flag: '🇸🇬', name: 'Singapore', portals: 'PropertyGuru, 99.co, SRX', leads: 'HDB eligible, ABSD paid' },
              { flag: '🇮🇳', name: 'India', portals: '99acres, MagicBricks, Housing, NoBroker', leads: 'RERA verified, home loan ready' },
              { flag: '🇯🇵', name: 'Japan', portals: 'SUUMO, AtHome, Homes', leads: 'Earthquake resistant, near station' },
            ].map((market, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{market.flag}</span>
                  <h3 className="text-lg font-semibold text-gray-900">{market.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">{market.portals}</p>
                <p className="text-sm text-blue-600 font-medium">{market.leads}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Configure', desc: 'Pick markets, categories, cities. Set max leads per source. API key in hand.' },
              { step: '2', title: 'Grind', desc: 'Parallel scrapers hit 50+ portals. Dedupe by source_id. Raw leads saved to Supabase.' },
              { step: '3', title: 'Grade', desc: 'Market-specific AI scores each lead A-D. No website = instant Grade A. Factors logged.' },
              { step: '4', title: 'Sell', desc: 'Agents pull Grade A leads via API. Pay per lead or subscription. You keep 100% margin.' },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="absolute -top-4 left-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                  {step.step}
                </div>
                <div className="pt-8 pb-6 px-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
                {i < 3 && (
                  <div className="absolute top-2 right-0 w-full h-0.5 bg-gray-200 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Build Your Lead Empire?
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Deploy in 10 minutes. Start grinding leads today. Scale to 50 markets when you're ready.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-white text-blue-900 font-semibold rounded-lg hover:bg-white/90 transition-colors text-lg"
            >
              Deploy Free on Vercel
            </Link>
            <Link
              href="https://github.com"
              className="px-8 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:border-white/50 transition-colors text-lg"
            >
              View Source Code
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">BlackRockReality</h3>
              <p className="text-gray-400 text-sm">
                Global real estate lead generation platform. No license required. Built for scale.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link href="/docs" className="hover:text-white">API Docs</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Markets</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>US, CA, UK, UAE</li>
                <li>AU, SG, IN, JP</li>
                <li>+40 more coming</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
                <li><Link href="/compliance" className="hover:text-white">Compliance</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2025 BlackRockReality. Not a licensed brokerage. Lead generation platform only.
          </div>
        </div>
      </footer>
    </main>
  );
}