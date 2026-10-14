import { Metadata } from 'next';

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
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using BlackRockReality ("the Service", "we", "our", "us"), you agree to be
              bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
            <p className="text-gray-700 mb-3">
              BlackRockReality is a lead generation platform that scrapes publicly available real estate
              professional data from property portals worldwide, grades leads using market-specific algorithms,
              and provides access via REST API and dashboard to licensed real estate agents and agencies.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-medium">
                <strong>Important:</strong> BlackRockReality is NOT a licensed real estate brokerage. We do not
                facilitate transactions, negotiate deals, or represent buyers/sellers. We are a lead generation
                and media platform only. Users are responsible for complying with all applicable real estate
                licensing laws in their jurisdictions.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Eligibility</h2>
            <p className="text-gray-700">
              You must be at least 18 years old and have the legal capacity to enter into these Terms.
              By using the Service, you represent and warrant that you meet these requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Accounts and API Keys</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>You are responsible for maintaining the confidentiality of your API keys</li>
              <li>You must not share API keys with unauthorized parties</li>
              <li>You are responsible for all activity under your API keys</li>
              <li>Notify us immediately of any unauthorized use of your API keys</li>
              <li>We may rotate or revoke API keys for security reasons</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Acceptable Use</h2>
            <p className="text-gray-700 mb-3">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Use the Service for any unlawful purpose</li>
              <li>Scrape, crawl, or extract data from our Service programmatically (except via our documented API)</li>
              <li>Exceed your API rate limits or attempt to circumvent them</li>
              <li>Interfere with the Service's operation or security</li>
              <li>Use lead data for spam, unsolicited communications, or any purpose violating applicable laws (TCPA, GDPR, CAN-SPAM, etc.)</li>
              <li>Resell or redistribute lead data without authorization</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Subscriptions and Billing</h2>
            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Plans</h3>
            <p className="text-gray-700 mb-3">
              We offer Free, Team, and Enterprise plans with different rate limits, features, and support levels.
              Current pricing is available on the Service.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Billing</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Subscriptions auto-renew unless cancelled</li>
              <li>Prices are in USD and exclude applicable taxes</li>
              <li>Payments processed by Stripe; we do not store full payment details</li>
              <li>Refunds at our discretion; contact support for requests</li>
              <li>Failed payments may result in service suspension</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Cancellation</h3>
            <p className="text-gray-700">
              You may cancel at any time. Access continues until the end of the current billing period.
              No prorated refunds for partial periods.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Intellectual Property</h2>
            <p className="text-gray-700 mb-3">
              The Service, including its software, algorithms, grading models, API, documentation, and branding,
              is owned by BlackRockReality and protected by intellectual property laws.
            </p>
            <p className="text-gray-700">
              Lead data provided through the Service is sourced from public portals. We claim no ownership
              over the underlying public data, but our grading, aggregation, and presentation are proprietary.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Data and Privacy</h2>
            <p className="text-gray-700">
              Your use of the Service is also governed by our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>,
              which is incorporated into these Terms by reference.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Disclaimers</h2>
            <p className="text-gray-700 mb-3">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
              EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Accuracy, completeness, or timeliness of lead data</li>
              <li>Merchantability or fitness for a particular purpose</li>
              <li>Non-infringement</li>
              <li>Uninterrupted or error-free operation</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Lead grades are algorithmic estimates based on public signals. They do not guarantee
              conversion, interest, or any specific outcome. Verify all lead information independently.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Limitation of Liability</h2>
            <p className="text-gray-700">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, BLACKROCKREALITY SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS,
              DATA, OR BUSINESS OPPORTUNITIES, ARISING FROM OR RELATED TO YOUR USE OF THE SERVICE.
              OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Indemnification</h2>
            <p className="text-gray-700">
              You agree to indemnify and hold harmless BlackRockReality from any claims, damages, losses,
              and expenses (including attorney fees) arising from your use of the Service, violation
              of these Terms, or violation of any third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Termination</h2>
            <p className="text-gray-700 mb-3">
              We may suspend or terminate your access to the Service at any time, with or without cause,
              including for violation of these Terms. Upon termination:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Your right to use the Service immediately ceases</li>
              <li>API keys are revoked</li>
              <li>Data may be deleted per our retention policy</li>
              <li>No refunds for prepaid periods (except as required by law)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Governing Law and Disputes</h2>
            <p className="text-gray-700 mb-3">
              These Terms are governed by the laws of the State of Delaware, USA, without regard to
              conflict of laws principles. Any disputes will be resolved in the state and federal courts
              located in Delaware.
            </p>
            <p className="text-gray-700">
              If you are a consumer in the EU, you may also have the right to bring claims in your
              country of residence under applicable consumer protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">14. Changes to Terms</h2>
            <p className="text-gray-700">
              We may modify these Terms at any time. Material changes will be communicated via email
              or through the Service at least 30 days before taking effect. Continued use after
              changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">15. General Provisions</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Entire Agreement:</strong> These Terms and the Privacy Policy constitute the entire agreement</li>
              <li><strong>Severability:</strong> If any provision is unenforceable, the remainder remains in effect</li>
              <li><strong>No Waiver:</strong> Failure to enforce a right does not waive it</li>
              <li><strong>Assignment:</strong> We may assign these Terms; you may not without our consent</li>
              <li><strong>Force Majeure:</strong> We are not liable for delays due to events beyond our control</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">16. Contact Us</h2>
            <p className="text-gray-700">
              Questions about these Terms? Contact us at:
            </p>
            <address className="not-italic text-gray-700">
              BlackRockReality<br />
              Email: <a href="mailto:legal@blackrockreality.com" className="text-blue-600 hover:underline">legal@blackrockreality.com</a>
            </address>
          </section>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <a href="/" className="text-blue-600 hover:underline">← Back to Home</a>
        </div>
      </div>
    </div>
  );
}