import { useState } from 'react';
import {
  Key,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  CheckCircle2,
  Shield,
  Bell,
  Globe,
  User,
  Lock,
  Server,
  Link2,
  Plug,
} from 'lucide-react';
import { getApiKey, setApiKey as saveApiKey, API_BASE_URL, checkHealth } from '../api/client';

interface ApiKeyItem {
  id: string;
  key: string;
  name: string;
  created: string;
  lastUsed: string;
  status: 'active' | 'revoked';
}

const initialApiKeys: ApiKeyItem[] = [
  {
    id: '1',
    key: 'dv_live_sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    name: 'Production Key',
    created: '2024-01-10',
    lastUsed: '2 hours ago',
    status: 'active',
  },
  {
    id: '2',
    key: 'dv_test_sk_x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4',
    name: 'Test Key',
    created: '2024-01-12',
    lastUsed: '5 days ago',
    status: 'active',
  },
  {
    id: '3',
    key: 'dv_live_sk_z1x2c3v4b5n6m7a8s9d0f1g2h3j4k5l6',
    name: 'Old Production Key',
    created: '2023-11-05',
    lastUsed: '30 days ago',
    status: 'revoked',
  },
];

function ApiKeyRow({
  apiKey,
  onRevoke,
  onSetActive,
  isActiveKey,
}: {
  apiKey: ApiKeyItem;
  onRevoke: (id: string) => void;
  onSetActive: (key: string) => void;
  isActiveKey: boolean;
}) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const maskedKey = apiKey.key.substring(0, 12) + '••••••••••••••••••••••••';

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-white rounded-xl border p-5 transition-all ${
      isActiveKey
        ? 'border-emerald-300 ring-2 ring-emerald-100 shadow-sm'
        : apiKey.status === 'revoked'
        ? 'border-slate-200 opacity-60'
        : 'border-slate-200 hover:border-primary-200 hover:shadow-sm'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Key className={`w-4 h-4 ${isActiveKey ? 'text-emerald-600' : apiKey.status === 'active' ? 'text-primary-600' : 'text-slate-400'}`} />
            <span className="font-semibold text-slate-800 text-sm">{apiKey.name}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              apiKey.status === 'active'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-500'
            }`}>
              {apiKey.status}
            </span>
            {isActiveKey && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                ✓ Active for API calls
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <code className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded break-all">
              {showKey ? apiKey.key : maskedKey}
            </code>
            <button
              onClick={() => setShowKey(!showKey)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              title={showKey ? 'Hide key' : 'Show key'}
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              title="Copy key"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
            <span>Created: {apiKey.created}</span>
            <span>Last used: {apiKey.lastUsed}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {apiKey.status === 'active' && !isActiveKey && (
            <button
              onClick={() => onSetActive(apiKey.key)}
              className="flex items-center gap-1.5 text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Plug className="w-4 h-4" />
              Use This Key
            </button>
          )}
          {apiKey.status === 'active' && (
            <button
              onClick={() => onRevoke(apiKey.id)}
              className="flex items-center gap-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Revoke
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [apiKeys, setApiKeys] = useState(initialApiKeys);
  const [activeTab, setActiveTab] = useState('connection');
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [activeApiKey, setActiveApiKey] = useState(getApiKey());
  const [manualApiKey, setManualApiKey] = useState(getApiKey());
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [connectionMessage, setConnectionMessage] = useState('');

  const handleRevoke = (id: string) => {
    setApiKeys(apiKeys.map((k) => (k.id === id ? { ...k, status: 'revoked' as const } : k)));
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;
    const newKey: ApiKeyItem = {
      id: String(Date.now()),
      key: `dv_live_sk_${Array.from({ length: 32 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('')}`,
      name: newKeyName,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      status: 'active',
    };
    setApiKeys([newKey, ...apiKeys]);
    setNewKeyName('');
    setShowNewKeyForm(false);
  };

  const handleSetActiveKey = (key: string) => {
    saveApiKey(key);
    setActiveApiKey(key);
    setManualApiKey(key);
  };

  const handleSaveManualKey = () => {
    saveApiKey(manualApiKey);
    setActiveApiKey(manualApiKey);
  };

  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    setConnectionMessage('');
    try {
      const result = await checkHealth();
      if (result.success) {
        setConnectionStatus('success');
        setConnectionMessage('Successfully connected to backend API!');
      } else {
        setConnectionStatus('error');
        setConnectionMessage(result.error?.message || 'Could not connect to the backend.');
      }
    } catch {
      setConnectionStatus('error');
      setConnectionMessage('Connection failed. Make sure the backend is running.');
    }
  };

  const tabs = [
    { id: 'connection', label: 'Connection', icon: Link2 },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'webhooks', label: 'Webhooks', icon: Globe },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Settings</h2>
        <p className="text-slate-500">Manage backend connection, API keys, and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-white p-1.5 rounded-xl border border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── Connection Tab ─── */}
      {activeTab === 'connection' && (
        <div className="space-y-6">
          {/* Backend URL */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Backend Connection</h3>
                <p className="text-sm text-slate-500">Your frontend connects to the FastAPI backend</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Backend API URL</label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={API_BASE_URL}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-mono"
                  />
                </div>
                <button
                  onClick={handleTestConnection}
                  disabled={connectionStatus === 'testing'}
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  {connectionStatus === 'testing' ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Testing...
                    </>
                  ) : (
                    <>
                      <Plug className="w-4 h-4" />
                      Test Connection
                    </>
                  )}
                </button>
              </div>

              {connectionStatus === 'success' && (
                <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {connectionMessage}
                </div>
              )}
              {connectionStatus === 'error' && (
                <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  <p className="font-medium">❌ {connectionMessage}</p>
                  <p className="text-xs text-red-500 mt-1">
                    Make sure the backend is running: <code className="font-mono bg-red-100 px-1 rounded">cd backend && python run.py</code>
                  </p>
                </div>
              )}
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">How to start the backend</h4>
              <div className="space-y-2">
                <code className="block text-xs font-mono text-slate-600 bg-slate-900 text-slate-300 rounded-lg px-3 py-2">
                  $ cd doc_verify_api/backend
                </code>
                <code className="block text-xs font-mono text-slate-600 bg-slate-900 text-slate-300 rounded-lg px-3 py-2">
                  $ pip install -r requirements.txt
                </code>
                <code className="block text-xs font-mono text-slate-600 bg-slate-900 text-slate-300 rounded-lg px-3 py-2">
                  $ python run.py
                </code>
                <p className="text-xs text-slate-500 mt-2">
                  The server will start at <code className="font-mono bg-slate-100 px-1 rounded">{API_BASE_URL}</code>
                </p>
              </div>
            </div>
          </div>

          {/* Active API Key for requests */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Active API Key</h3>
                <p className="text-sm text-slate-500">This key is sent with every API request as a Bearer token</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">API Key (Bearer Token)</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={manualApiKey}
                  onChange={(e) => setManualApiKey(e.target.value)}
                  placeholder="Enter your API key (e.g., dv_live_sk_...)"
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleSaveManualKey}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  Save Key
                </button>
              </div>
              {activeApiKey && (
                <p className="text-xs text-emerald-600 mt-2">
                  ✓ API key is set. It will be sent as <code className="font-mono bg-emerald-50 px-1 rounded">Authorization: Bearer {activeApiKey.substring(0, 12)}...</code>
                </p>
              )}
              {!activeApiKey && (
                <p className="text-xs text-amber-600 mt-2">
                  ⚠ No API key set. Requests will be sent without authentication. Set one if your backend requires it.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── API Keys Tab ─── */}
      {activeTab === 'api-keys' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">API Keys</h3>
              <p className="text-sm text-slate-500 mt-0.5">Manage your API keys for authentication</p>
            </div>
            <button
              onClick={() => setShowNewKeyForm(true)}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-md shadow-primary-200"
            >
              <Plus className="w-4 h-4" />
              New Key
            </button>
          </div>

          {showNewKeyForm && (
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-5 animate-fade-in-up">
              <h4 className="text-sm font-bold text-slate-800 mb-3">Create New API Key</h4>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Key name (e.g., Production)"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateKey()}
                />
                <button
                  onClick={handleCreateKey}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowNewKeyForm(false)}
                  className="bg-white hover:bg-slate-50 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {apiKeys.map((key) => (
              <ApiKeyRow
                key={key.id}
                apiKey={key}
                onRevoke={handleRevoke}
                onSetActive={handleSetActiveKey}
                isActiveKey={activeApiKey === key.key}
              />
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-800">Security Tip</h4>
              <p className="text-sm text-amber-700 mt-1">
                Rotate your API keys regularly. Click "Use This Key" to set a key as the active authentication token for API requests.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Profile Settings</h3>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                defaultValue="Admin User"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                defaultValue="admin@docverify.in"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Organization</label>
              <input
                type="text"
                defaultValue="DocVerify Inc."
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
              <input
                type="text"
                defaultValue="Administrator"
                disabled
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500"
              />
            </div>
          </div>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
            Save Changes
          </button>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Change Password</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
                <input type="password" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                <input type="password" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                <input type="password" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
                Update Password
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Two-Factor Authentication</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
                <p className="text-xs text-slate-400 mt-1">Currently: <span className="text-amber-600 font-medium">Disabled</span></p>
              </div>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
                Enable 2FA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Notification Preferences</h3>
          <div className="space-y-4">
            {[
              { label: 'Email notifications for failed verifications', desc: 'Get notified when a verification fails', default: true },
              { label: 'Daily usage summary', desc: 'Receive a daily email with usage statistics', default: false },
              { label: 'API key expiration warnings', desc: 'Get notified before your API keys expire', default: true },
              { label: 'Rate limit alerts', desc: 'Get notified when approaching rate limits', default: true },
              { label: 'System maintenance notifications', desc: 'Get notified about scheduled maintenance', default: true },
            ].map((pref) => (
              <div key={pref.label} className="flex items-start justify-between gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                <div>
                  <span className="text-sm font-medium text-slate-800">{pref.label}</span>
                  <p className="text-xs text-slate-400 mt-0.5">{pref.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" defaultChecked={pref.default} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-primary-300/50 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
                </label>
              </div>
            ))}
          </div>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
            Save Preferences
          </button>
        </div>
      )}

      {/* Webhooks Tab */}
      {activeTab === 'webhooks' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Webhook Endpoints</h3>
              <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" />
                Add Endpoint
              </button>
            </div>
            <p className="text-sm text-slate-500">
              Configure webhook endpoints to receive real-time notifications for verification events.
            </p>

            <div className="bg-slate-50 rounded-xl p-6 text-center">
              <Server className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-slate-600 mb-1">No webhooks configured</h4>
              <p className="text-xs text-slate-400">Add a webhook endpoint to receive verification event notifications</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Webhook Events</h3>
            <div className="space-y-2">
              {[
                { event: 'verification.completed', desc: 'When a document verification is completed' },
                { event: 'verification.failed', desc: 'When a verification attempt fails' },
                { event: 'key.expiring', desc: 'When an API key is about to expire' },
                { event: 'rate_limit.reached', desc: 'When rate limit threshold is reached' },
              ].map((e) => (
                <div key={e.event} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <code className="text-sm font-mono text-primary-600">{e.event}</code>
                    <p className="text-xs text-slate-400 mt-0.5">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
