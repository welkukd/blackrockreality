'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';



interface Lead {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  market: string;
  category: string | null;
  rating: number | null;
  review_count: number | null;
  has_website: boolean;
  has_whatsapp: boolean;
  has_booking: boolean;
  has_ssl: boolean;
  grade: string;
  grade_score: number;
  grade_factors: string[];
  status: string;
  source: string;
  source_id: string;
  created_at: string;
  updated_at: string;
}

interface LeadFilters {
  grade: string;
  status: string;
  market: string;
  search: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [filters, setFilters] = useState<LeadFilters>({
    grade: '',
    status: '',
    market: '',
    search: '',
  });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'created_at',
    direction: 'desc',
  });

  useEffect(() => {
    const storedKey = localStorage.getItem('brr_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const fetchLeads = useCallback(async () => {
    if (!apiKey) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: pageSize.toString(),
        offset: ((page - 1) * pageSize).toString(),
      });

      if (filters.grade) params.set('grade', filters.grade);
      if (filters.status) params.set('status', filters.status);
      if (filters.market) params.set('market', filters.market);
      if (filters.search) params.set('search', filters.search);

      const res = await fetch(`/api/leads?${params}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        setTotal(data.total || 0);
      } else if (res.status === 401) {
        localStorage.removeItem('brr_api_key');
        setApiKey('');
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  }, [apiKey, page, pageSize, filters]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedLeads = [...leads].sort((a, b) => {
    const aVal = a[sortConfig.key as keyof Lead];
    const bVal = b[sortConfig.key as keyof Lead];
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    const comparison = String(aVal).localeCompare(String(bVal));
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const exportCSV = async () => {
    if (!apiKey) return;
    try {
      const res = await fetch(`/api/leads?export=csv&limit=10000`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads-${Date.now()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (!apiKey) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Leads Management</h1>
          <p className="text-gray-600 mb-6">
            Enter your API key to access leads data.
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
                fetchLeads();
              }
            }}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Access Leads
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
          <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-1">{total.toLocaleString()} total leads</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Export CSV
          </button>
          <Link
            href="/dashboard/grind"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Start Grind Job
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              id="search"
              type="text"
              placeholder="Name, email, phone..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            />
          </div>
          <div>
            <label htmlFor="grade-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Grade
            </label>
            <select
              id="grade-filter"
              value={filters.grade}
              onChange={(e) => setFilters(prev => ({ ...prev, grade: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            >
              <option value="">All Grades</option>
              <option value="A">Grade A</option>
              <option value="B">Grade B</option>
              <option value="C">Grade C</option>
              <option value="D">Grade D</option>
            </select>
          </div>
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="visit_scheduled">Visit Scheduled</option>
              <option value="visit_done">Visit Done</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed_won">Closed Won</option>
              <option value="closed_lost">Closed Lost</option>
              <option value="nurture">Nurture</option>
            </select>
          </div>
          <div>
            <label htmlFor="market-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Market
            </label>
            <select
              id="market-filter"
              value={filters.market}
              onChange={(e) => setFilters(prev => ({ ...prev, market: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            >
              <option value="">All Markets</option>
              <option value="US">US</option>
              <option value="CA">Canada</option>
              <option value="GB">UK</option>
              <option value="AE">UAE</option>
              <option value="AU">Australia</option>
              <option value="SG">Singapore</option>
              <option value="IN">India</option>
              <option value="JP">Japan</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ grade: '', status: '', market: '', search: '' })}
              className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading leads...</div>
        ) : sortedLeads.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No leads found. <Link href="/dashboard/grind" className="text-blue-600 hover:underline">Start a grind job</Link> to collect leads.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      { key: 'name', label: 'Name' },
                      { key: 'market', label: 'Market' },
                      { key: 'category', label: 'Category' },
                      { key: 'grade', label: 'Grade' },
                      { key: 'grade_score', label: 'Score' },
                      { key: 'status', label: 'Status' },
                      { key: 'source', label: 'Source' },
                      { key: 'created_at', label: 'Created' },
                    ].map((col) => (
                      <th
                        key={col.key}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                        onClick={() => handleSort(col.key)}
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          {sortConfig.key === col.key && (
                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/dashboard/leads?lead_id=${lead.id}`}
                          className="font-medium text-gray-900 hover:text-blue-600 max-w-xs truncate block"
                        >
                          {lead.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {lead.market.toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {lead.category || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${gradeColors[lead.grade] || 'bg-gray-100 text-gray-800'}`}>
                          {lead.grade}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {lead.grade_score}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[lead.status] || 'bg-gray-100 text-gray-800'}`}>
                          {lead.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {lead.source}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/leads?lead_id=${lead.id}`}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total.toLocaleString()}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={page * pageSize >= total}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}