'use client';

import { useState, useEffect, useCallback } from 'react';

export const dynamic = 'force-dynamic';


interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  rate_limit: number;
  requests_today: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showNewKey, setShowNewKey] = useState<string | null>(null);
  const [form, setForm] = useState({ name: 'Default', rate_limit: 1000, expires_in_days: 365 });
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [editForm, setEditForm] = useState({ name: '', rate_limit: 1000, is_active: true, expires_in_days: 365 });

  useEffect(() => {
    const storedKey = localStorage.getItem('brr_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const fetchKeys = useCallback(async () => {
    if (!apiKey) return;

    try {
      const res = await fetch('/api/apikeys', {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys || []);
      } else if (res.status === 401) {
        localStorage.removeItem('brr_api_key');
        setApiKey('');
      }
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/apikeys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        setShowNewKey(data.api_key);
        setShowCreateForm(false);
        setForm({ name: 'Default', rate_limit: 1000, expires_in_days: 365 });
        fetchKeys();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create API key');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKey) return;

    try {
      const res = await fetch(`/api/apikeys?key_id=${editingKey.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        setEditingKey(null);
        fetchKeys();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to update API key');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const handleDelete = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/apikeys?key_id=${keyId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (res.ok) {
        fetchKeys();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete API key');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const handleToggleActive = async (key: ApiKey) => {
    try {
      const res = await fetch(`/api/apikeys?key_id=${key.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ is_active: !key.is_active }),
      });

      if (res.ok) {
        fetchKeys();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to update API key');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const startEdit = (key: ApiKey) => {
    setEditingKey(key);
    setEditForm({
      name: key.name,
      rate_limit: key.rate_limit,
      is_active: key.is_active,
      expires_in_days: key.expires_at ? Math.ceil((new Date(key.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 365,
    });
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (!apiKey) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">API Keys</h1>
          <p className="text-gray-600 mb-6">
            Enter your API key to manage API access.
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
                fetchKeys();
              }
            }}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Access API Keys
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
          <h1 className="text-2xl font-semibold text-gray-900">API Keys</h1>
          <p className="text-gray-600 mt-1">Manage API access for your workspace</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Create API Key
        </button>
      </div>

      {/* Create Key Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowCreateForm(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Create API Key</h2>
              <button onClick={() => setShowCreateForm(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label htmlFor="key-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Key Name
                </label>
                <input
                  id="key-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>
              <div>
                <label htmlFor="rate-limit" className="block text-sm font-medium text-gray-700 mb-1">
                  Rate Limit (requests/day)
                </label>
                <input
                  id="rate-limit"
                  type="number"
                  min="1"
                  max="100000"
                  value={form.rate_limit}
                  onChange={(e) => setForm(prev => ({ ...prev, rate_limit: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>
              <div>
                <label htmlFor="expires-in" className="block text-sm font-medium text-gray-700 mb-1">
                  Expires In (days)
                </label>
                <input
                  id="expires-in"
                  type="number"
                  min="1"
                  max="3650"
                  value={form.expires_in_days}
                  onChange={(e) => setForm(prev => ({ ...prev, expires_in_days: parseInt(e.target.value) || 365 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Key'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Show New Key Modal */}
      {showNewKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowNewKey(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">API Key Created</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Your API Key</label>
                <div className="flex gap-2">
                  <code className="flex-1 text-sm font-mono text-gray-900 break-all">{showNewKey}</code>
                  <button
                    onClick={() => copyToClipboard(showNewKey)}
                    className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                <strong>Important:</strong> This key will only be shown once. Save it securely now.
              </div>
              <button
                onClick={() => setShowNewKey(null)}
                className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                I've Saved It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Key Modal */}
      {editingKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setEditingKey(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Edit API Key</h2>
              <button onClick={() => setEditingKey(null)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Key Name
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>
              <div>
                <label htmlFor="edit-rate-limit" className="block text-sm font-medium text-gray-700 mb-1">
                  Rate Limit (requests/day)
                </label>
                <input
                  id="edit-rate-limit"
                  type="number"
                  min="1"
                  max="100000"
                  value={editForm.rate_limit}
                  onChange={(e) => setEditForm(prev => ({ ...prev, rate_limit: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="edit-active"
                  type="checkbox"
                  checked={editForm.is_active}
                  onChange={(e) => setEditForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="edit-active" className="text-sm text-gray-700">Active</label>
              </div>
              <div>
                <label htmlFor="edit-expires" className="block text-sm font-medium text-gray-700 mb-1">
                  Expires In (days)
                </label>
                <input
                  id="edit-expires"
                  type="number"
                  min="1"
                  max="3650"
                  value={editForm.expires_in_days}
                  onChange={(e) => setEditForm(prev => ({ ...prev, expires_in_days: parseInt(e.target.value) || 365 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditingKey(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Keys Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading API keys...</div>
        ) : keys.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No API keys yet</h3>
            <p className="text-gray-600 mb-6">Create your first API key to start accessing the BlackRockReality API.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create API Key
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prefix</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate Limit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage Today</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {keys.map((key) => (
                  <tr key={key.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{key.name}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{key.key_prefix}••••</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{key.rate_limit.toLocaleString()}/day</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{key.requests_today.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={key.is_active}
                          onChange={() => handleToggleActive(key)}
                          className="sr-only peer"
                        />
                        <div className={`w-11 h-6 rounded-full peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
                      </label>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {key.expires_at ? formatDate(key.expires_at) : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(key.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(key)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(key.id)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Usage Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-3">API Key Usage</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Include the API key in the Authorization header: <code className="bg-white px-2 py-0.5 rounded text-blue-900">Authorization: Bearer rl_...</code></li>
          <li>• Rate limits reset daily at midnight UTC</li>
          <li>• Inactive keys will return 401 Unauthorized</li>
          <li>• Expired keys are automatically deactivated</li>
          <li>• Keys are workspace-scoped — all keys in a workspace share the same data access</li>
        </ul>
      </div>
    </div>
  );
}