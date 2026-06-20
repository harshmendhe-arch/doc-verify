import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Shield,
  FileText,
  BookOpen,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronRight,
  Zap,
  Home,
  WifiOff,
  RefreshCw,
} from 'lucide-react';
import { checkHealth, API_BASE_URL } from '../api/client';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/verify', label: 'Verify Document', icon: Shield },
  { path: '/documents', label: 'Documents', icon: FileText },
  { path: '/api-docs', label: 'API Docs', icon: BookOpen },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const location = useLocation();

  // Poll backend health
  useEffect(() => {
    const check = async () => {
      const result = await checkHealth();
      setBackendStatus(result.success ? 'online' : 'offline');
    };
    check();
    const interval = setInterval(check, 15000); // every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700/50">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">DocVerify</h1>
              <p className="text-xs text-slate-400 -mt-0.5">Verification Portal</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-5 right-4 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section — Live backend status */}
        <div className="p-4 border-t border-slate-700/50">
          <div className={`rounded-xl p-4 border ${
            backendStatus === 'online'
              ? 'bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border-emerald-500/20'
              : backendStatus === 'offline'
              ? 'bg-gradient-to-br from-red-600/20 to-red-800/20 border-red-500/20'
              : 'bg-gradient-to-br from-primary-600/20 to-primary-800/20 border-primary-500/20'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {backendStatus === 'online' ? (
                <Zap className="w-4 h-4 text-emerald-400" />
              ) : backendStatus === 'offline' ? (
                <WifiOff className="w-4 h-4 text-red-400" />
              ) : (
                <RefreshCw className="w-4 h-4 text-primary-400 animate-spin" />
              )}
              <span className={`text-sm font-semibold ${
                backendStatus === 'online' ? 'text-emerald-300' :
                backendStatus === 'offline' ? 'text-red-300' : 'text-primary-300'
              }`}>
                Backend API
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-2 font-mono truncate">{API_BASE_URL}</p>
            <div className="flex items-center gap-2">
              {backendStatus === 'online' ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400">Connected</span>
                </>
              ) : backendStatus === 'offline' ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-xs text-red-400">Disconnected</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs text-amber-400">Checking...</span>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden lg:block">
            <h2 className="text-lg font-semibold text-slate-800">
              {navItems.find((item) => item.path === location.pathname)?.label || 'DocVerify'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Live backend indicator in top bar */}
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              backendStatus === 'online'
                ? 'bg-emerald-50 text-emerald-700'
                : backendStatus === 'offline'
                ? 'bg-red-50 text-red-700'
                : 'bg-slate-50 text-slate-500'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                backendStatus === 'online'
                  ? 'bg-emerald-500 animate-pulse'
                  : backendStatus === 'offline'
                  ? 'bg-red-500'
                  : 'bg-slate-400 animate-pulse'
              }`} />
              {backendStatus === 'online' ? 'API Online' : backendStatus === 'offline' ? 'API Offline' : 'Checking...'}
            </div>
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
