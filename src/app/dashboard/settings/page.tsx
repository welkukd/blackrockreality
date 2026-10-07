'use client';

import { useState, useEffect } from 'react';



interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string;
  subscription_plan: string;
  data_residency: string;
  gdpr_compliant: boolean;
  ccpa_compliant: boolean;
}

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  country_code: string;
  timezone: string;
  role: string;
}

export default function SettingsPage() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [activeTab, setActiveTab] = useState<'workspace' | 'profile' | 'billing' | 'integrations'>('workspace');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem('brr_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const fetchData = async () => {
    if (!apiKey) return;

    try {
      const [wsRes, profileRes] = await Promise.all([
        fetch('/api/workspace', { headers: { Authorization: `Bearer ${apiKey}` } }),
        fetch('/api/profile', { headers: { Authorization: `Bearer ${apiKey}` } }),
      ]);

      if (wsRes.ok) {
        const data = await wsRes.json();
        setWorkspace(data.workspace);
      }
      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (apiKey) fetchData();
  }, [apiKey]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) return;

    setSaving(true);
    setMessage(null);

    try {
      let res: Response | null = null;
      if (activeTab === 'workspace') {
        res = await fetch('/api/workspace', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(workspace),
        });
      } else if (activeTab === 'profile') {
        res = await fetch('/api/profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(profile),
        });
      }

      if (res?.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully' });
        fetchData();
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!apiKey) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600 mb-6">
            Enter your API key to manage settings.
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
                fetchData();
              }
            }}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Access Settings
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="p-12 text-center text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your workspace, profile, and integrations</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Tab navigation */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px" aria-label="Settings tabs">
            {[
              { id: 'workspace', label: 'Workspace' },
              { id: 'profile', label: 'Profile' },
              { id: 'billing', label: 'Billing' },
              { id: 'integrations', label: 'Integrations' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab panels */}
        <div className="p-6">
          {activeTab === 'workspace' && workspace && (
            <form onSubmit={handleSave} className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Workspace Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="ws-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Workspace Name
                  </label>
                  <input
                    id="ws-name"
                    type="text"
                    value={workspace.name}
                    onChange={(e) => setWorkspace(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="ws-slug" className="block text-sm font-medium text-gray-700 mb-1">
                    Slug (URL identifier)
                  </label>
                  <input
                    id="ws-slug"
                    type="text"
                    value={workspace.slug}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="ws-color" className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Color
                  </label>
                  <input
                    id="ws-color"
                    type="color"
                    value={workspace.primary_color}
                    onChange={(e) => setWorkspace(prev => prev ? { ...prev, primary_color: e.target.value } : null)}
                    className="w-full max-w-xs h-10 px-2 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label htmlFor="ws-residency" className="block text-sm font-medium text-gray-700 mb-1">
                    Data Residency
                  </label>
                  <select
                    id="ws-residency"
                    value={workspace.data_residency}
                    onChange={(e) => setWorkspace(prev => prev ? { ...prev, data_residency: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  >
                    <option value="us">United States</option>
                    <option value="eu">European Union</option>
                    <option value="apac">Asia Pacific</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ws-plan" className="block text-sm font-medium text-gray-700 mb-1">
                    Subscription Plan
                  </label>
                  <select
                    id="ws-plan"
                    value={workspace.subscription_plan}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  >
                    <option value="free">Free</option>
                    <option value="team">Team</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-medium font-medium text-gray-900 mb-4">Compliance</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={workspace.gdpr_compliant}
                      onChange={(e) => setWorkspace(prev => prev ? { ...prev, gdpr_compliant: e.target.checked } : null)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">GDPR Compliant (EU data protection)</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={workspace.ccpa_compliant}
                      onChange={(e) => setWorkspace(prev => prev ? { ...prev, ccpa_compliant: e.target.checked } : null)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">CCPA Compliant (California privacy)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Workspace'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'profile' && profile && (
            <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
              <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="full-name"
                    type="text"
                    value={profile.full_name || ''}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, full_name: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={profile.phone || ''}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    id="country"
                    value={profile.country_code}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, country_code: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AE">UAE</option>
                    <option value="AU">Australia</option>
                    <option value="SG">Singapore</option>
                    <option value="IN">India</option>
                    <option value="JP">Japan</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    value={profile.timezone}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, timezone: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time (US)</option>
                    <option value="America/Chicago">Central Time (US)</option>
                    <option value="America/Denver">Mountain Time (US)</option>
                    <option value="America/Los_Angeles">Pacific Time (US)</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Dubai">Dubai</option>
                    <option value="Asia/Singapore">Singapore</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                    <option value="Asia/Kolkata">Kolkata</option>
                    <option value="Australia/Sydney">Sydney</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Current Plan: Free</h3>
                <p className="text-blue-800">
                  You're on the Free plan. Upgrade to Team or Enterprise for higher rate limits,
                  more API keys, and priority support.
                </p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  View Pricing
                </button>
              </div>

              <h3 className="text-lg font-semibold text-gray-900">Usage This Month</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">API Requests</p>
                  <p className="text-3xl font-bold text-gray-900">0 / 1,000</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">API Keys</p>
                  <p className="text-3xl font-bold text-gray-900">0 / 5</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Leads Stored</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Third-party Integrations</h2>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">WhatsApp (Gupshup)</h3>
                    <p className="text-sm text-gray-600">Send lead notifications via WhatsApp Business API</p>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">Not Connected</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Email (Resend)</h3>
                    <p className="text-sm text-gray-600">Send transactional emails and notifications</p>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">Not Connected</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">AI/LLM (Groq)</h3>
                    <p className="text-sm text-gray-600">AI-powered lead enrichment and grading</p>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">Not Connected</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Configure Integrations</h3>
                <p className="text-blue-800 mb-4">
                  Add the following environment variables to your Vercel project settings to enable integrations:
                </p>
                <div className="bg-blue-900 text-blue-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`GUPSHUP_API_KEY=your-key
GUPSHUP_APP_NAME=your-app
GUPSHUP_SOURCE_NUMBER=your-number
RESEND_API_KEY=your-key
EMAIL_FROM=noreply@yourdomain.com
GROQ_API_KEY=your-key`}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}