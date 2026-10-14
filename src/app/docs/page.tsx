import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation | BlackRockReality',
  description: 'Complete API reference for BlackRockReality Global Real Estate Lead Generation Platform',
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">API Documentation</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Complete reference for the BlackRockReality REST API. All endpoints require API key authentication.
          </p>
        </div>

        {/* Authentication */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Authentication</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-gray-700 mb-4">
              All API requests require an <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">Authorization</code> header with your API key.
            </p>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre>{`Authorization: Bearer rl_abc123...`}</pre>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Create API keys from the <a href="/dashboard/api-keys" className="text-blue-600 hover:underline">API Keys dashboard</a>.
            </p>
          </div>
        </section>

        {/* Base URL */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Base URL</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm">
              <pre>{`https://blackrockreality.vercel.app/api`}</pre>
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Endpoints</h2>

          {/* Health Check */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
            <div className="bg-green-50 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">GET</span>
                <code className="text-sm font-mono text-gray-900">/health</code>
              </div>
              <p className="text-gray-600 mt-2">Health check endpoint - no authentication required</p>
            </div>
            <div className="p-6">
              <h3 className="font-medium text-gray-900 mb-3">Response</h3>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre>{`{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-10-14T07:00:00.000Z",
  "version": "1.0.0"
}`}</pre>
              </div>
            </div>
          </div>

          {/* Grind Jobs */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
            <div className="bg-blue-50 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">POST</span>
                <code className="text-sm font-mono text-gray-900">/grind</code>
              </div>
              <p className="text-gray-600 mt-2">Start a new grinding job to scrape leads from global property portals</p>
            </div>
            <div className="p-6">
              <h3 className="font-medium text-gray-900 mb-3">Request Body</h3>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre>{`{
  "markets": ["US", "CA", "AE"],
  "categories": ["residential", "commercial"],
  "cities": ["Los Angeles", "Dubai"],
  "maxLeadsPerSource": 20
}`}</pre>
              </div>

              <h3 className="font-medium text-gray-900 mt-6 mb-3">Response</h3>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre>{`{
  "job_id": "uuid",
  "status": "started",
  "message": "Grind job started. Check status with GET /api/grind?job_id=..."
}`}</pre>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
            <div className="bg-blue-50 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">GET</span>
                <code className="text-sm font-mono text-gray-900">/grind?job_id=...</code>
              </div>
              <p className="text-gray-600 mt-2">Check the status of a grinding job</p>
            </div>
          </div>

          {/* Leads */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
            <div className="bg-purple-50 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">GET</span>
                <code className="text-sm font-mono text-gray-900">/leads</code>
              </div>
              <p className="text-gray-600 mt-2">Fetch leads with filtering, sorting, and pagination</p>
            </div>
            <div className="p-6">
              <h3 className="font-medium text-gray-900 mb-3">Query Parameters</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="pb-2 font-medium">Parameter</th>
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="py-2 font-mono">grade</td><td className="py-2">string</td><td className="py-2 text-gray-600">Filter by grade (A, B, C, D)</td></tr>
                  <tr><td className="py-2 font-mono">status</td><td className="py-2">string</td><td className="py-2 text-gray-600">Filter by status (new, contacted, qualified, etc.)</td></tr>
                  <tr><td className="py-2 font-mono">market</td><td className="py-2">string</td><td className="py-2 text-gray-600">Filter by market (US, CA, GB, AE, AU, SG, IN, JP)</td></tr>
                  <tr><td className="py-2 font-mono">search</td><td className="py-2">string</td><td className="py-2 text-gray-600">Search name, email, phone</td></tr>
                  <tr><td className="py-2 font-mono">limit</td><td className="py-2">number</td><td className="py-2 text-gray-600">Results per page (default 50, max 100)</td></tr>
                  <tr><td className="py-2 font-mono">offset</td><td className="py-2">number</td><td className="py-2 text-gray-600">Pagination offset</td></tr>
                  <tr><td className="py-2 font-mono">sort</td><td className="py-2">string</td><td className="py-2 text-gray-600">Sort field (created_at, grade_score, etc.)</td></tr>
                  <tr><td className="py-2 font-mono">direction</td><td className="py-2">string</td><td className="py-2 text-gray-600">asc or desc</td></tr>
                  <tr><td className="py-2 font-mono">export</td><td className="py-2">string</td><td className="py-2 text-gray-600">Set to "csv" for CSV export</td></tr>
                </tbody>
              </table>

              <h3 className="font-medium text-gray-900 mt-6 mb-3">Response</h3>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre>{`{
  "leads": [
    {
      "id": "uuid",
      "source": "zillow",
      "source_id": "zillow_12345",
      "market": "US",
      "country": "US",
      "name": "John Smith",
      "phone": "+1555****4567",
      "email": "john@example.com",
      "website": "https://johnsmithrealtor.com",
      "city": "Los Angeles",
      "state": "CA",
      "grade": "A",
      "grade_score": 85,
      "grade_factors": ["no_website", "quality_source_zillow"],
      "status": "new",
      "created_at": "2026-10-14T07:00:00.000Z"
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}`}</pre>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
            <div className="bg-purple-50 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">GET</span>
                <code className="text-sm font-mono text-gray-900">/leads?export=csv</code>
              </div>
              <p className="text-gray-600 mt-2">Export leads as CSV (max 10,000 rows)</p>
            </div>
          </div>

          {/* API Keys */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
            <div className="bg-orange-50 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">POST</span>
                <code className="text-sm font-mono text-gray-900">/apikeys</code>
              </div>
              <p className="text-gray-600 mt-2">Create a new API key</p>
            </div>
            <div className="p-6">
              <h3 className="font-medium text-gray-900 mb-3">Request Body</h3>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre>{`{
  "name": "Production Key",
  "rate_limit": 1000,
  "expires_in_days": 365
}`}</pre>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
            <div className="bg-orange-50 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">GET</span>
                <code className="text-sm font-mono text-gray-900">/apikeys</code>
              </div>
              <p className="text-gray-600 mt-2">List all API keys for the workspace</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
            <div className="bg-orange-50 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">PATCH</span>
                <code className="text-sm font-mono text-gray-900">/apikeys?key_id=...</code>
              </div>
              <p className="text-gray-600 mt-2">Update an API key (rate_limit, is_active, expires_at, name)</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
            <div className="bg-red-50 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">DELETE</span>
                <code className="text-sm font-mono text-gray-900">/apikeys?key_id=...</code>
              </div>
              <p className="text-gray-600 mt-2">Delete an API key</p>
            </div>
          </div>

          {/* Webhook */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
            <div className="bg-indigo-50 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">POST</span>
                <code className="text-sm font-mono text-gray-900">/stripe/webhook</code>
              </div>
              <p className="text-gray-600 mt-2">Stripe webhook handler for subscription events</p>
            </div>
          </div>

          {/* Cron */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
            <div className="bg-yellow-50 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">GET</span>
                <code className="text-sm font-mono text-gray-900">/cron/reset-api-usage</code>
              </div>
              <p className="text-gray-600 mt-2">Daily cron to reset API key usage counters (requires CRON_SECRET)</p>
            </div>
          </div>
        </section>

        {/* Lead Grading */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Lead Grading System</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-gray-700 mb-6">
              Leads are automatically graded A-D based on market-specific signals. The grading algorithm evaluates:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="pb-2 font-medium">Market</th>
                    <th className="pb-2 font-medium">No Website</th>
                    <th className="pb-2 font-medium">No SSL</th>
                    <th className="pb-2 font-medium">No WhatsApp</th>
                    <th className="pb-2 font-medium">No Booking</th>
                    <th className="pb-2 font-medium">Immediate Timeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="py-2 font-medium">US</td><td className="py-2">+35</td><td className="py-2">+10</td><td className="py-2">+5</td><td className="py-2">+15</td><td className="py-2">+25</td></tr>
                  <tr><td className="py-2 font-medium">CA</td><td className="py-2">+35</td><td className="py-2">+10</td><td className="py-2">+10</td><td className="py-2">+15</td><td className="py-2">+25</td></tr>
                  <tr><td className="py-2 font-medium">UK</td><td className="py-2">+40</td><td className="py-2">+15</td><td className="py-2">+10</td><td className="py-2">+10</td><td className="py-2">+20</td></tr>
                  <tr><td className="py-2 font-medium">UAE</td><td className="py-2">+35</td><td className="py-2">+10</td><td className="py-2">+25</td><td className="py-2">+15</td><td className="py-2">+25</td></tr>
                  <tr><td className="py-2 font-medium">AU</td><td className="py-2">+35</td><td className="py-2">+10</td><td className="py-2">+5</td><td className="py-2">+15</td><td className="py-2">+20</td></tr>
                  <tr><td className="py-2 font-medium">SG</td><td className="py-2">+35</td><td className="py-2">+10</td><td className="py-2">+20</td><td className="py-2">+10</td><td className="py-2">+25</td></tr>
                  <tr><td className="py-2 font-medium">IN</td><td className="py-2">+40</td><td className="py-2">+15</td><td className="py-2">+20</td><td className="py-2">+10</td><td className="py-2">+30</td></tr>
                  <tr><td className="py-2 font-medium">JP</td><td className="py-2">+30</td><td className="py-2">+10</td><td className="py-2">+5</td><td className="py-2">+10</td><td className="py-2">+20</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Grades: A (80+) to B (60+) to C (40+) to D (20+) to F (under 20)
            </p>
          </div>
        </section>

        {/* Error Codes */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Error Codes</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Code</th>
                  <th className="pb-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr><td className="py-2">400</td><td className="py-2 font-mono">INVALID_REQUEST</td><td className="py-2 text-gray-600">Missing or invalid parameters</td></tr>
                <tr><td className="py-2">401</td><td className="py-2 font-mono">UNAUTHORIZED</td><td className="py-2 text-gray-600">Missing, invalid, or expired API key</td></tr>
                <tr><td className="py-2">403</td><td className="py-2 font-mono">FORBIDDEN</td><td className="py-2 text-gray-600">API key lacks permission for this workspace</td></tr>
                <tr><td className="py-2">404</td><td className="py-2 font-mono">NOT_FOUND</td><td className="py-2 text-gray-600">Resource not found</td></tr>
                <tr><td className="py-2">429</td><td className="py-2 font-mono">RATE_LIMITED</td><td className="py-2 text-gray-600">Daily rate limit exceeded</td></tr>
                <tr><td className="py-2">500</td><td className="py-2 font-mono">INTERNAL_ERROR</td><td className="py-2 text-gray-600">Server error - check logs</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Rate Limits */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Rate Limits</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <ul className="space-y-3 text-gray-700">
              <li><strong>Default:</strong> 1,000 requests/day per API key</li>
              <li><strong>Configurable:</strong> Up to 100,000 requests/day (set at key creation)</li>
              <li><strong>Reset:</strong> Daily at 00:00 UTC via cron job</li>
              <li><strong>Headers:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">X-RateLimit-Limit</code>, <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">X-RateLimit-Remaining</code>, <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">X-RateLimit-Reset</code></li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}