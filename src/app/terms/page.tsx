import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | BlackRockReality',
  description: 'Terms of Service for BlackRockReality Global Real Estate Lead Generation Platform',
};

export default function TermsPage() {
  const lastUpdated = 'October 14, 2026';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: {lastUpdated}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using BlackRockReality ("the Service", "we", "our", "us"), you agree to be bound
              by these Terms of Service ("Terms"). If you do not agree, you may not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed">
              BlackRockReality is a global real estate lead generation platform that scrapes publicly available
              real estate professional data from property portals worldwide, grades leads using market-specific
              AI models, and provides API access for agents to purchase qualified leads.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              We are not a licensed real estate brokerage. We do not facilitate transactions, negotiate deals,
              or represent buyers or sellers. We provide lead data only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Account Registration</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>You must be 18 or older to register</li>
              <li>You must provide accurate, complete registration information</li>
              <li>You are responsible for safeguarding your API keys and credentials</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. API Access and Usage</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>API access is granted via API keys with configurable rate limits</li>
              <li>You may not share, resell, or redistribute API access or lead data</li>
              <li>You must comply with all applicable laws when using lead data</li>
              <li>We may revoke or suspend API access for violations</li>
              <li>Rate limits and quotas apply per plan tier</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Lead Data License</h2>
            <p className="text-gray-700 leading-relaxed">
              We grant you a limited, non-exclusive, non-transferable license to use lead data for your
              internal business purposes only. You may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Resell, sublicense, or distribute lead data to third parties</li>
              <li>Use lead data for marketing without proper consent</li>
              <li>Combine lead data with other databases to create derivative products</li>
              <li>Scrape or crawl our platform programmatically</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Billing and Subscriptions</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Subscriptions auto-renew unless canceled before the renewal date</li>
              <li>Payments processed via Stripe; we do not store full card details</li>
              <li>Refunds at our discretion; contact support for billing issues</li>
              <li>Price changes apply at next renewal with 30 days notice</li>
              <li>Free tier has usage limits; upgrade for higher limits</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              The Service, including all software, algorithms, grading models, UI, and documentation,
              is owned by BlackRockReality and protected by copyright, trademark, and trade secret laws.
              You receive no ownership rights, only a license to use per these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Disclaimers</h2>
            <p className="text-gray-700 leading-relaxed">
              The Service is provided "as is" and "as available" without warranties of any kind.
              We do not guarantee lead accuracy, completeness, or conversion rates.
              Lead data is sourced from public portals and may contain errors or outdated information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, BlackRockReality shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages, or any loss of profits,
              data, or business opportunities. Our total liability shall not exceed the amount you paid
              in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify and hold harmless BlackRockReality from any claims, damages,
              or expenses arising from your use of the Service, violation of these Terms, or violation
              of any law or third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We may suspend or terminate your access at any time for violations of these Terms.
              You may terminate your account at any time from Dashboard Settings.
              Sections 5, 7, 8, 9, 10, 11, and 12 survive termination.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by the laws of the State of Delaware, USA, without regard to
              conflict of laws principles. Disputes shall be resolved in the state and federal courts
              of Delaware.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms from time to time. We will notify you of material changes
              by email or through the Service. Continued use after changes constitutes acceptance.
              The "Last updated" date at the top indicates when the latest changes were made.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">14. Contact Us</h2>
            <p className="text-gray-700">
              If you have questions about these Terms, contact us at:
            </p>
            <address className="not-italic text-gray-700">
              BlackRockReality<br />
              Email: <a href="mailto:legal@blackrockreality.com" className="text-blue-600 hover:underline">legal@blackrockreality.com</a>
            </address>
          </section>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <Link href="/" className="text-blue-600 hover:underline">&larr; Back to Home</Link>
        </div>
      </div>
    </div>
  );
}