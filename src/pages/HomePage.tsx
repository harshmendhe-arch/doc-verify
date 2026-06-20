import { Link } from 'react-router-dom';
import {
  Shield,
  FileCheck,
  Zap,
  Lock,
  ArrowRight,
  CheckCircle2,
  Globe,
  Clock,
  Server,
  Code2,
  Users,
  TrendingUp,
} from 'lucide-react';
import { API_BASE_URL } from '../api/client';

const stats = [
  { label: 'Documents Supported', value: '25+', icon: FileCheck, color: 'text-primary-600' },
  { label: 'API Uptime', value: '99.9%', icon: Server, color: 'text-emerald-600' },
  { label: 'Avg Response Time', value: '<2s', icon: Clock, color: 'text-amber-600' },
  { label: 'Active Users', value: '10K+', icon: Users, color: 'text-purple-600' },
];

const features = [
  {
    icon: Shield,
    title: 'Multi-Document Verification',
    description: 'Verify 25+ types of Indian government and educational documents through a single unified API.',
    color: 'bg-primary-100 text-primary-600',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get verification results in under 2 seconds with our optimized processing pipeline.',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: Lock,
    title: 'Bank-Grade Security',
    description: 'AES-256 encryption, API key authentication, and complete audit trails for every verification.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Code2,
    title: 'Developer Friendly',
    description: 'RESTful API with comprehensive documentation, SDKs, and webhook support.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Globe,
    title: 'Scalable Infrastructure',
    description: 'Cloud-native architecture that scales automatically to handle millions of verifications.',
    color: 'bg-rose-100 text-rose-600',
  },
  {
    icon: TrendingUp,
    title: 'Real-time Analytics',
    description: 'Track verification metrics, success rates, and usage patterns through interactive dashboards.',
    color: 'bg-cyan-100 text-cyan-600',
  },
];

const documentCategories = [
  { name: 'Identity Documents', items: ['Aadhaar Card', 'PAN Card', 'Passport', 'Voter ID', 'Driving License'], icon: '🪪' },
  { name: 'Certificates', items: ['Birth Certificate', 'Death Certificate', 'Marriage Certificate'], icon: '📜' },
  { name: 'Education', items: ['Degree Certificate', 'Marksheet', 'Transfer Certificate', 'Migration Certificate'], icon: '🎓' },
  { name: 'Government', items: ['Caste Certificate', 'Income Certificate', 'EWS Certificate', 'Domicile Certificate'], icon: '🏛️' },
  { name: 'Property', items: ['Vehicle Registration', 'Property Registration', 'Land Record'], icon: '🏠' },
];

export default function HomePage() {
  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white p-8 sm:p-12 lg:p-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-primary-500/20 border border-primary-400/30 text-primary-300 text-xs font-semibold px-3 py-1 rounded-full">
              🚀 API v1.0 Now Live
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
            Document Verification
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mb-6 leading-relaxed">
            Verify 25+ types of Indian documents instantly with our powerful REST API.
            From Aadhaar to Land Records — one API to verify them all.
          </p>
          <div className="flex items-center gap-2 mb-8 bg-white/5 border border-white/10 rounded-lg px-4 py-2 w-fit">
            <Server className="w-4 h-4 text-primary-300" />
            <span className="text-sm text-slate-400">Backend:</span>
            <code className="text-sm font-mono text-primary-300">{API_BASE_URL}</code>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/verify"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-primary-600/30 hover:shadow-primary-500/40 hover:-translate-y-0.5"
            >
              Start Verifying <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/api-docs"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 border border-white/10"
            >
              <Code2 className="w-5 h-5" /> API Documentation
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-100/50 transition-all duration-300"
            >
              <Icon className={`w-8 h-8 ${stat.color} mb-3`} />
              <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
            </div>
          );
        })}
      </section>

      {/* Features */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Why Choose DocVerify?</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Enterprise-grade document verification infrastructure built for developers and businesses
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-primary-200 hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Supported Documents */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Supported Documents</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Comprehensive coverage of all major Indian government and institutional documents
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentCategories.map((cat) => (
            <div
              key={cat.name}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{cat.name}</h3>
              <ul className="space-y-2">
                {cat.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
            Start verifying documents in minutes. No complex setup required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/verify"
              className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3.5 rounded-xl font-bold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              Try Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/api-docs"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 border border-white/20"
            >
              View API Docs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
