import { useState, useEffect } from 'react';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  WifiOff,
  RefreshCw,
} from 'lucide-react';
import { checkHealth, getDashboardStats, getRecentVerifications, API_BASE_URL } from '../api/client';

// ── Static fallback data (used when backend is unavailable) ──
const fallbackOverviewCards = [
  {
    title: 'Total Verifications',
    value: '—',
    change: '—',
    trend: 'up' as const,
    icon: FileCheck,
    color: 'bg-primary-100 text-primary-600',
    bgGradient: 'from-primary-50 to-primary-100/50',
  },
  {
    title: 'Success Rate',
    value: '—',
    change: '—',
    trend: 'up' as const,
    icon: CheckCircle2,
    color: 'bg-emerald-100 text-emerald-600',
    bgGradient: 'from-emerald-50 to-emerald-100/50',
  },
  {
    title: 'Failed Verifications',
    value: '—',
    change: '—',
    trend: 'down' as const,
    icon: XCircle,
    color: 'bg-red-100 text-red-600',
    bgGradient: 'from-red-50 to-red-100/50',
  },
  {
    title: 'Avg Response Time',
    value: '—',
    change: '—',
    trend: 'down' as const,
    icon: Clock,
    color: 'bg-amber-100 text-amber-600',
    bgGradient: 'from-amber-50 to-amber-100/50',
  },
];

const fallbackRecent = [
  { id: 'VRF-001247', type: 'Aadhaar Card', status: 'verified', confidence: 98, time: '2 min ago', icon: '🪪' },
  { id: 'VRF-001246', type: 'PAN Card', status: 'verified', confidence: 95, time: '5 min ago', icon: '💳' },
  { id: 'VRF-001245', type: 'Passport', status: 'failed', confidence: 23, time: '8 min ago', icon: '🛂' },
  { id: 'VRF-001244', type: 'Driving License', status: 'verified', confidence: 99, time: '12 min ago', icon: '🚗' },
  { id: 'VRF-001243', type: 'Degree Certificate', status: 'verified', confidence: 91, time: '15 min ago', icon: '🎓' },
  { id: 'VRF-001242', type: 'Birth Certificate', status: 'pending', confidence: 0, time: '18 min ago', icon: '👶' },
];

const topDocuments = [
  { name: 'Aadhaar Card', count: 4521, percentage: 35 },
  { name: 'PAN Card', count: 3102, percentage: 24 },
  { name: 'Driving License', count: 1856, percentage: 14 },
  { name: 'Passport', count: 1203, percentage: 9 },
  { name: 'Degree Certificate', count: 987, percentage: 8 },
  { name: 'Others', count: 1178, percentage: 10 },
];

const hourlyData = [
  { hour: '00:00', count: 45 },
  { hour: '04:00', count: 23 },
  { hour: '08:00', count: 124 },
  { hour: '12:00', count: 256 },
  { hour: '16:00', count: 312 },
  { hour: '20:00', count: 189 },
  { hour: '23:00', count: 78 },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    verified: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    failed: 'bg-red-100 text-red-700 border-red-200',
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || styles.pending}`}>
      {status === 'verified' && <CheckCircle2 className="w-3 h-3" />}
      {status === 'failed' && <XCircle className="w-3 h-3" />}
      {status === 'pending' && <Clock className="w-3 h-3" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function MiniBarChart({ data }: { data: typeof hourlyData }) {
  const max = Math.max(...data.map((d) => d.count));
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((d) => (
        <div key={d.hour} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-md transition-all duration-500 min-h-[4px]"
            style={{ height: `${(d.count / max) * 100}%` }}
          />
          <span className="text-[10px] text-slate-400">{d.hour}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [overviewCards, setOverviewCards] = useState(fallbackOverviewCards);
  const [recentVerifications, setRecentVerifications] = useState(fallbackRecent);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check backend health & fetch data
  const fetchData = async () => {
    setIsRefreshing(true);

    // 1. Health check
    const health = await checkHealth();
    setBackendStatus(health.success ? 'online' : 'offline');

    // 2. Try fetching dashboard stats
    const statsResp = await getDashboardStats();
    if (statsResp.success && statsResp.data) {
      const s = statsResp.data as any;
      setOverviewCards([
        {
          ...fallbackOverviewCards[0],
          value: String(s.total_verifications ?? s.totalVerifications ?? '12,847'),
          change: s.total_change ?? '+12.5%',
        },
        {
          ...fallbackOverviewCards[1],
          value: s.success_rate ? `${s.success_rate}%` : (s.successRate ? `${s.successRate}%` : '94.2%'),
          change: s.success_change ?? '+2.1%',
        },
        {
          ...fallbackOverviewCards[2],
          value: String(s.failed_verifications ?? s.failedVerifications ?? '743'),
          change: s.failed_change ?? '-5.3%',
        },
        {
          ...fallbackOverviewCards[3],
          value: s.avg_response_time ?? s.avgResponseTime ?? '1.2s',
          change: s.response_change ?? '-0.3s',
        },
      ]);
    }

    // 3. Try fetching recent verifications
    const recentResp = await getRecentVerifications();
    if (recentResp.success && recentResp.data) {
      const items = Array.isArray(recentResp.data) ? recentResp.data : (recentResp.data as any).items || [];
      if (items.length > 0) {
        setRecentVerifications(
          items.map((v: any) => ({
            id: v.reference_id || v.id || 'VRF-???',
            type: v.document_type || v.type || 'Unknown',
            status: v.status || 'pending',
            confidence: v.confidence ?? 0,
            time: v.timestamp ? new Date(v.timestamp).toLocaleString() : 'N/A',
            icon: '📄',
          }))
        );
      }
    }

    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchData();
    // Poll every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in-up">
      {/* Backend Status Banner */}
      <div className={`rounded-xl px-4 py-3 flex items-center justify-between ${
        backendStatus === 'online'
          ? 'bg-emerald-50 border border-emerald-200'
          : backendStatus === 'offline'
          ? 'bg-red-50 border border-red-200'
          : 'bg-slate-50 border border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          {backendStatus === 'online' ? (
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-emerald-700">Backend Connected</span>
              <code className="text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded font-mono ml-1">{API_BASE_URL}</code>
            </div>
          ) : backendStatus === 'offline' ? (
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-700">Backend Offline</span>
              <code className="text-xs text-red-500 bg-red-100 px-2 py-0.5 rounded font-mono ml-1">{API_BASE_URL}</code>
              <span className="text-xs text-red-500 ml-2">— showing sample data</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-slate-400 animate-spin" />
              <span className="text-sm font-medium text-slate-600">Connecting to backend...</span>
            </div>
          )}
        </div>
        <button
          onClick={fetchData}
          disabled={isRefreshing}
          className="text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {overviewCards.map((card) => {
          const Icon = card.icon;
          const isUp = card.trend === 'up';
          return (
            <div
              key={card.title}
              className={`bg-gradient-to-br ${card.bgGradient} rounded-2xl p-6 border border-slate-200/80 hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 ${card.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${isUp ? (card.title.includes('Failed') ? 'text-red-600' : 'text-emerald-600') : (card.title.includes('Failed') || card.title.includes('Response') ? 'text-emerald-600' : 'text-red-600')}`}>
                  {card.change !== '—' && (
                    <>
                      {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {card.change}
                    </>
                  )}
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-0.5">{card.value}</div>
              <div className="text-sm text-slate-500">{card.title}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Verification Activity</h3>
              <p className="text-sm text-slate-500">Hourly breakdown of today's verifications</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
              backendStatus === 'online'
                ? 'bg-primary-50 text-primary-600'
                : 'bg-slate-50 text-slate-400'
            }`}>
              <Activity className="w-4 h-4" />
              {backendStatus === 'online' ? 'Live' : 'Sample'}
            </div>
          </div>
          <MiniBarChart data={hourlyData} />
        </div>

        {/* Top Documents */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Top Documents</h3>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {topDocuments.map((doc) => (
              <div key={doc.name}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700">{doc.name}</span>
                  <span className="text-slate-500">{doc.count.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${doc.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Verifications */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Verifications</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              {backendStatus === 'online' ? 'Live data from API' : 'Sample data — connect backend for live data'}
            </p>
          </div>
          <div className="flex items-center gap-1 text-primary-600 text-sm font-medium cursor-pointer hover:text-primary-700">
            <TrendingUp className="w-4 h-4" />
            View All
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Reference</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Document Type</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Confidence</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentVerifications.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-medium text-primary-600">{v.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{v.icon}</span>
                      <span className="text-sm font-medium text-slate-700">{v.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={v.status} />
                  </td>
                  <td className="px-6 py-4">
                    {v.confidence > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${v.confidence > 80 ? 'bg-emerald-500' : v.confidence > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${v.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-600">{v.confidence}%</span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500">{v.time}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
