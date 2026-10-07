'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';


interface Stats {
  totalLeads: number;
  newLeadsToday: number;
  activeGrindJobs: number;
  apiKeys: number;
}

interface RecentLead {
  id: string;
  name: string;
  market: string;
  grade: string;
  status: string;
  created_at: string;
}

interface RecentJob {
  id: string;
  status: string;
  markets: string[];
  total_leads_found: number;
  total_leads_saved: number;
  created_at: string;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    newLeadsToday: 0,
    activeGrindJobs: 0,
    apiKeys: 0,
  });
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const storedKey = localStorage.getItem('brr_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      fetchData(storedKey);
    }
  }, []);

  const fetchData = async (key: string) => {
    try {
      const [leadsRes, jobsRes, keysRes] = await Promise.all([
        fetch('/api/leads?limit=5', { headers: { Authorization: `Bearer ${key}` } }),
        fetch('/api/grind?limit=5', { headers: { Authorization: `Bearer ${key}` } }),
        fetch('/api/apikeys', { headers: { Authorization: `Bearer ${key}` } }),
      ]);

      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setRecentLeads(data.leads || []);
        setStats(prev => ({ ...prev, totalLeads: data.total || 0 }));
      }
      if (jobsRes.ok) {
        const data = await jobsRes.json();
        setRecentJobs(data.jobs || []);
        setStats(prev => ({ ...prev, activeGrindJobs: data.jobs?.filter((j: any) => j.status === 'running').length || 0 }));
      }
      if (keysRes.ok) {
        const data = await keysRes.json();
        setStats(prev => ({ ...prev, apiKeys: data.keys?.length || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('brr_api_key', apiKey.trim());
      fetchData(apiKey.trim());
    }
  };

  const gradeColors: Record<string, string> = {
    A: 'bg-green-100 text-green-800',
    B: 'bg-blue-100 text-blue-800',
    C: 'bg-yellow-100 text-yellow-800',
    D: 'bg-red-100 text-red-800',
  };

  const statusColors: Record<string, string> = {
    new: 'bg-gray-100 text-gray-800',
    contacted: 'bg-blue-100 text-blue-800',
    qualified: 'bg-green-100 text-green-800',
    visit_scheduled: 'bg-purple-100 text-purple-800',
    visit_done: 'bg-indigo-100 text-indigo-800',
    negotiation: 'bg-orange-100 text-orange-800',
    closed_won: 'bg-emerald-100 text-emerald-800',
    closed_lost: 'bg-red-100 text-red-800',
    nurture: 'bg-slate-100 text-slate-800',
  };

  const jobStatusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-800',
    running: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!apiKey) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to BlackRockReality Dashboard</h1>
          <p className="text-gray-600 mb-6">
            Enter your API key to view your workspace data. You can create API keys from the API Keys page
            or use an existing one.
          </p>
          <form onSubmit={handleKeySubmit} className="max-w-md">
            <div className="space-y-4">
              <div>
                <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="rl_..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Access Dashboard
              </button>
            </div>
          </form>
          <p className="mt-6 text-sm text-gray-500">
            Don't have an API key? <Link href="/dashboard/api-keys" className="text-blue-600 hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your lead generation activity</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/leads"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            View All Leads
          </Link>
          <Link
            href="/dashboard/grind"
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Start Grind Job
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads.toLocaleString()}
          icon={<LeadsIcon />}
          color="blue"
        />
        <StatCard
          title="New Today"
          value={stats.newLeadsToday.toLocaleString()}
          icon={<NewLeadsIcon />}
          color="green"
        />
        <StatCard
          title="Active Grind Jobs"
          value={stats.activeGrindJobs}
          icon={<GrindIcon />}
          color="purple"
        />
        <StatCard
          title="API Keys"
          value={stats.apiKeys}
          icon={<KeysIcon />}
          color="orange"
        />
      </div>

      {/* Recent leads and jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
            <Link
              href="/dashboard/leads"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading || recentLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      {loading ? 'Loading...' : 'No leads yet. Start a grind job to collect leads.'}
                    </td>
                  </tr>
                ) : (
                  recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/leads?lead_id=${lead.id}`}
                          className="font-medium text-gray-900 hover:text-blue-600"
                        >
                          {lead.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {lead.market.toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${gradeColors[lead.grade] || 'bg-gray-100 text-gray-800'}`}>
                          {lead.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[lead.status] || 'bg-gray-100 text-gray-800'}`}>
                          {lead.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(lead.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Grind Jobs */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Grind Jobs</h2>
            <Link
              href="/dashboard/grind"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {loading || recentJobs.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                {loading ? 'Loading...' : 'No grind jobs yet. Start one to collect leads.'}
              </div>
            ) : (
              recentJobs.map((job) => (
                <div key={job.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${jobStatusColors[job.status] || 'bg-gray-100 text-gray-800'}`}>
                        {job.status}
                      </span>
                      <span className="text-sm text-gray-600">
                        {job.markets.join(', ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Found: {job.total_leads_found}</span>
                      <span>Saved: {job.total_leads_saved}</span>
                      <span>{formatDate(job.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/dashboard/grind"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
              </svg>
            </div>
            <h3 className="font-medium text-gray-900">Start Grind Job</h3>
            <p className="text-sm text-gray-600 mt-1">Scrape 50+ portals for fresh leads</p>
          </Link>
          <Link
            href="/dashboard/leads"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h3 className="font-medium text-gray-900">Manage Leads</h3>
            <p className="text-sm text-gray-600 mt-1">Filter, sort, and export leads</p>
          </Link>
          <Link
            href="/dashboard/api-keys"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
              </svg>
            </div>
            <h3 className="font-medium text-gray-900">API Keys</h3>
            <p className="text-sm text-gray-600 mt-1">Create and manage API access</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  };

  const cls = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`bg-white rounded-xl border p-6 ${cls}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${cls.replace('50', '100').replace('600', '500')}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function LeadsIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
    </svg>
  );
}

function NewLeadsIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
    </svg>
  );
}

function GrindIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
    </svg>
  );
}

function KeysIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
    </svg>
  );
}