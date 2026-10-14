import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | BlackRockReality',
  description: 'Privacy Policy for BlackRockReality Global Real Estate Lead Generation Platform',
};

export default function PrivacyPage() {
  const lastUpdated = 'October 14, 2026';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: {lastUpdated}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              BlackRockReality (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) operates a global real estate lead generation platform
              (the &ldquo;Service&rdquo;). This Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Personal Information</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Account information: name, email, phone number, company details</li>
              <li>API keys and authentication credentials</li>
              <li>Billing and payment information (processed by Stripe)</li>
              <li>Communication preferences and support correspondence</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Usage Data</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>API request logs (endpoint, timestamp, response status)</li>
              <li>Grind job history and lead acquisition metrics</li>
              <li>Dashboard interactions and feature usage</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Lead Data (Processed on Behalf of Customers)</h3>
            <p className="text-gray-700">
              We scrape publicly available real estate professional data from property portals worldwide.
              This data includes business names, contact information, and professional details that are
              publicly listed. We act as a data processor for this information on behalf of our customers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Provide and maintain the Service</li>
              <li>Authenticate and authorize API access</li>
              <li>Process billing and subscriptions</li>
              <li>Send service notifications and updates</li>
              <li>Improve and optimize the platform</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-3">We do not sell your personal information. We may share data with:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Service Providers:</strong> Vercel (hosting), Supabase (database), Stripe (payments), Resend (email)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Retention</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Account data: Retained while account is active, deleted within 30 days of account closure</li>
              <li>API logs: Retained for 90 days for security and debugging</li>
              <li>Billing records: Retained for 7 years for tax compliance</li>
              <li>Lead data: Retained per workspace settings, deleted on workspace deletion</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
            <p className="text-gray-700 mb-3">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Access your personal data</li>
              <li>Rectify inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Restrict or object to processing</li>
              <li>Data portability</li>
              <li>Withdraw consent (where processing is based on consent)</li>
            </ul>
            <p className="text-gray-700 mt-3">
              To exercise these rights, contact us at <a href="mailto:privacy@blackrockreality.com" className="text-blue-600 hover:underline">privacy@blackrockreality.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. International Data Transfers</h2>
            <p className="text-gray-700">
              We use Supabase with data residency options (US, EU, APAC). You can select your preferred
              region in Workspace Settings. Standard Contractual Clauses apply for cross-border transfers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Security</h2>
            <p className="text-gray-700">
              We implement appropriate technical and organizational measures including encryption at rest
              and in transit, API key authentication, rate limiting, and regular security assessments.
              However, no internet transmission is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Children&apos;s Privacy</h2>
            <p className="text-gray-700">
              Our Service is not directed to individuals under 18. We do not knowingly collect personal
              information from children. If you believe we have collected such information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of any material
              changes by email or through the Service. The &ldquo;Last updated&rdquo; date at the top indicates
              when the latest changes were made.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact Us</h2>
            <p className="text-gray-700">
              If you have questions about this Privacy Policy, contact us at:
            </p>
            <address className="not-italic text-gray-700">
              BlackRockReality<br />
              Email: <a href="mailto:privacy@blackrockreality.com" className="text-blue-600 hover:underline">privacy@blackrockreality.com</a>
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