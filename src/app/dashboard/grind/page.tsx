'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface GrindJob {
  id: string;
  status: string;
  sources: string[];
  markets: string[];
  categories: string[];
  cities: string[];
  max_leads_per_source: number;
  total_leads_found: number;
  total_leads_saved: number;
  error: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

interface NewJobForm {
  markets: string[];
  categories: string[];
  cities: string[];
  maxLeadsPerSource: number;
}

const AVAILABLE_MARKETS = ['US', 'CA', 'GB', 'AE', 'AU', 'SG', 'IN', 'JP'];
const AVAILABLE_CATEGORIES = ['residential', 'commercial', 'land', 'rental'];

export default function GrindPage() {
  const [jobs, setJobs] = useState<GrindJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewJobForm>({
    markets: ['US'],
    categories: ['residential'],
    cities: [''],
    maxLeadsPerSource: 20,
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    const storedKey = localStorage.getItem('brr_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const fetchJobs = useCallback(async () => {
    if (!apiKey) return;

    try {
      const res = await fetch('/api/grind', {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      } else if (res.status === 401) {
        localStorage.removeItem('brr_api_key');
        setApiKey('');
      }
    } catch (error) {
      console.error('Failed to fetch grind jobs:', error);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleMarketChange = (market: string) => {
    setForm(prev => {
      const markets = prev.markets.includes(market)
        ? prev.markets.filter(m => m !== market)
        : [...prev.markets, market];
      return { ...prev, markets };
    });
  };

  const handleCategoryChange = (category: string) => {
    setForm(prev => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);

    if (form.markets.length === 0) {
      setFormErrors(['Select at least one market']);
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('/api/grind', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          markets: form.markets,
          categories: form.categories,
          cities: form.cities.filter(c => c.trim()),
          maxLeadsPerSource: form.maxLeadsPerSource,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setShowForm(false);
        setForm({ markets: ['US'], categories: ['residential'], cities: [''], maxLeadsPerSource: 20 });
        fetchJobs();
      } else {
        const error = await res.json();
        setFormErrors([error.error || 'Failed to create grind job']);
      }
    } catch (error) {
      setFormErrors(['Network error. Please try again.']);
    } finally {
      setCreating(false);
    }
  };

  const jobStatusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-800',
    running: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!apiKey) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Grind Jobs</h1>
          <p className="text-gray-600 mb-6">
            Enter your API key to manage grind jobs.
          </p>
          <input
            type="password"
            placeholder="rl_..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full max-w-md mx-auto px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-4"
            autoComplete="off"
          />
          <button
            onClick={() => {
              if (apiKey.trim()) {
                localStorage.setItem('brr_api_key', apiKey.trim());
                fetchJobs();
              }
            }}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Access Grind Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Grind Jobs</h1>
          <p className="text-gray-600 mt-1">Scrape global property portals for fresh leads</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Start New Grind Job
        </button>
      </div>

      {/* New Job Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Start New Grind Job</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {formErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <ul className="text-red-700 text-sm space-y-1">
                    {formErrors.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Markets (required)</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_MARKETS.map(market => (
                    <label key={market} className="inline-flex items-center gap-2 px-3 py-1.5 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={form.markets.includes(market)}
                        onChange={() => handleMarketChange(market)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{market}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_CATEGORIES.map(category => (
                    <label key={category} className="inline-flex items-center gap-2 px-3 py-1.5 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={form.categories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="max-leads" className="block text-sm font-medium text-gray-700 mb-2">
                  Max Leads Per Source
                </label>
                <input
                  id="max-leads"
                  type="number"
                  min="1"
                  max="100"
                  value={form.maxLeadsPerSource}
                  onChange={(e) => setForm(prev => ({ ...prev, maxLeadsPerSource: parseInt(e.target.value) || 1 }))}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {creating ? 'Starting...' : 'Start Grind Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Jobs List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading grind jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No grind jobs yet</h3>
            <p className="text-gray-600 mb-6">Start your first grind job to scrape leads from 50+ global property portals.</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Grind Job
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {jobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${jobStatusColors[job.status] || 'bg-gray-100 text-gray-800'}`}>
                      {job.status.toUpperCase()}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {job.markets.map(m => m.toUpperCase()).join(', ')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {job.categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}
                        {job.cities.some(c => c.trim()) && ` · ${job.cities.filter(c => c.trim()).join(', ')}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
                    <span>Max/source: {job.max_leads_per_source}</span>
                    <span>Found: <span className="font-medium text-gray-900">{job.total_leads_found}</span></span>
                    <span>Saved: <span className="font-medium text-gray-900">{job.total_leads_saved}</span></span>
                    <span>Started: {formatDate(job.started_at)}</span>
                    <span>Completed: {formatDate(job.completed_at)}</span>
                  </div>

                  {job.error && (
                    <div className="w-full sm:w-auto">
                      <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                        Error: {job.error}
                      </p>
                    </div>
                  )}

                  {job.status === 'running' && (
                    <Link
                      href={`/dashboard/grind?job_id=${job.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}