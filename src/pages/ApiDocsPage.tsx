import { useState } from 'react';
import {
  Copy,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Terminal,
  BookOpen,
  Shield,
  Zap,
  Globe,
  Key,
  AlertTriangle,
} from 'lucide-react';
import { documentTypes } from '../data/documents';
import { API_BASE_URL } from '../api/client';

function CodeBlock({ code, language = 'json' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-slate-900 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
        <span className="text-xs text-slate-400 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
        >
          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="text-slate-300 font-mono text-xs sm:text-sm">{code}</code>
      </pre>
    </div>
  );
}

function EndpointCard({ doc }: { doc: typeof documentTypes[0] }) {
  const [isOpen, setIsOpen] = useState(false);

  const requestBody = doc.fields
    .filter((f) => f.type !== 'file')
    .reduce((acc, f) => {
      acc[f.name] = f.placeholder || f.label;
      return acc;
    }, {} as Record<string, string>);

  const curlExample = `curl -X POST "${API_BASE_URL}${doc.endpoint}" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(requestBody, null, 2)}'`;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden hover:border-primary-200 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50/50 transition-colors"
      >
        <span className="text-xl">{doc.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">POST</span>
            <code className="text-sm font-mono text-slate-700 truncate">{doc.endpoint}</code>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{doc.name} verification</p>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
      </button>

      {isOpen && (
        <div className="border-t border-slate-200 p-4 space-y-4 bg-slate-50/30 animate-fade-in-up">
          {/* Parameters */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-2">Request Parameters</h4>
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Field</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Type</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Required</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {doc.fields.map((field) => (
                    <tr key={field.name}>
                      <td className="px-4 py-2 font-mono text-xs text-primary-600">{field.name}</td>
                      <td className="px-4 py-2 text-xs text-slate-500">{field.type === 'file' ? 'file' : 'string'}</td>
                      <td className="px-4 py-2">
                        {field.required ? (
                          <span className="text-xs font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded">Yes</span>
                        ) : (
                          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">No</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-xs text-slate-500 hidden sm:table-cell">{field.helpText || field.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* cURL */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-2">cURL Example</h4>
            <CodeBlock code={curlExample} language="bash" />
          </div>

          {/* Response */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-2">Success Response (200)</h4>
            <CodeBlock
              code={JSON.stringify(
                {
                  success: true,
                  status: 'verified',
                  confidence: 96.5,
                  document_type: doc.name,
                  reference_id: 'VRF-XXXXXX',
                  details: {
                    document_id: doc.fields[0]?.placeholder || 'XXXXXXXXXX',
                    holder_name: 'John Doe',
                    verification_method: 'OCR + Database Cross-reference',
                    document_status: 'Valid & Active',
                  },
                  timestamp: '2024-01-15T10:30:00Z',
                },
                null,
                2
              )}
              language="json"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApiDocsPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'auth', label: 'Authentication', icon: Key },
    { id: 'endpoints', label: 'Endpoints', icon: Globe },
    { id: 'errors', label: 'Error Handling', icon: AlertTriangle },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-56 shrink-0">
          <div className="lg:sticky lg:top-24 space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Documentation</h3>
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeSection === section.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* Overview */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">API Documentation</h2>
                <p className="text-slate-500 leading-relaxed">
                  The DocVerify API provides RESTful endpoints for verifying 25+ types of Indian documents.
                  All requests require authentication via API key.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Start</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm font-bold shrink-0">1</div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">Get your API Key</h4>
                      <p className="text-sm text-slate-500">Generate an API key from the Settings page</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm font-bold shrink-0">2</div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">Choose an endpoint</h4>
                      <p className="text-sm text-slate-500">Select the document verification endpoint you need</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm font-bold shrink-0">3</div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">Make a request</h4>
                      <p className="text-sm text-slate-500">Send a POST request with document details</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Base URL</h3>
                <CodeBlock code={`${API_BASE_URL}/api/v1`} language="text" />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <Shield className="w-8 h-8 text-primary-600 mb-3" />
                  <h4 className="font-bold text-slate-800 mb-1">Secure</h4>
                  <p className="text-sm text-slate-500">AES-256 encryption for all data in transit</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <Zap className="w-8 h-8 text-amber-500 mb-3" />
                  <h4 className="font-bold text-slate-800 mb-1">Fast</h4>
                  <p className="text-sm text-slate-500">Average response time under 2 seconds</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <Terminal className="w-8 h-8 text-emerald-600 mb-3" />
                  <h4 className="font-bold text-slate-800 mb-1">RESTful</h4>
                  <p className="text-sm text-slate-500">Clean, predictable API design</p>
                </div>
              </div>
            </div>
          )}

          {/* Authentication */}
          {activeSection === 'auth' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Authentication</h2>
                <p className="text-slate-500 leading-relaxed">
                  All API requests require a valid API key passed in the Authorization header.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Bearer Token Authentication</h3>
                <p className="text-sm text-slate-500">
                  Include your API key in the Authorization header of every request:
                </p>
                <CodeBlock
                  code={`Authorization: Bearer YOUR_API_KEY`}
                  language="http"
                />
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Example Request</h3>
                <CodeBlock
                  code={`curl -X POST "${API_BASE_URL}/api/v1/verify/aadhaar" \\
  -H "Authorization: Bearer dv_live_abc123xyz789" \\
  -H "Content-Type: application/json" \\
  -d '{
    "aadhaar_number": "1234 5678 9012",
    "full_name": "John Doe"
  }'`}
                  language="bash"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-800">Security Notice</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Never expose your API key in client-side code or public repositories. Always make API calls from your server.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Endpoints */}
          {activeSection === 'endpoints' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">API Endpoints</h2>
                <p className="text-slate-500 leading-relaxed">
                  All verification endpoints accept POST requests. Click on an endpoint to see its details.
                </p>
              </div>

              <div className="space-y-3">
                {documentTypes.map((doc) => (
                  <EndpointCard key={doc.id} doc={doc} />
                ))}
              </div>
            </div>
          )}

          {/* Error Handling */}
          {activeSection === 'errors' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Handling</h2>
                <p className="text-slate-500 leading-relaxed">
                  The API uses conventional HTTP response codes to indicate success or failure.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Code</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { code: '200', status: 'OK', desc: 'Verification completed successfully', color: 'text-emerald-600 bg-emerald-50' },
                      { code: '400', status: 'Bad Request', desc: 'Invalid or missing parameters', color: 'text-amber-600 bg-amber-50' },
                      { code: '401', status: 'Unauthorized', desc: 'Invalid or missing API key', color: 'text-red-600 bg-red-50' },
                      { code: '403', status: 'Forbidden', desc: 'API key lacks required permissions', color: 'text-red-600 bg-red-50' },
                      { code: '404', status: 'Not Found', desc: 'Document or endpoint not found', color: 'text-amber-600 bg-amber-50' },
                      { code: '422', status: 'Unprocessable', desc: 'Document could not be verified', color: 'text-amber-600 bg-amber-50' },
                      { code: '429', status: 'Rate Limited', desc: 'Too many requests, slow down', color: 'text-amber-600 bg-amber-50' },
                      { code: '500', status: 'Server Error', desc: 'Internal server error', color: 'text-red-600 bg-red-50' },
                    ].map((err) => (
                      <tr key={err.code} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3">
                          <span className={`font-mono font-bold text-xs px-2 py-1 rounded ${err.color}`}>{err.code}</span>
                        </td>
                        <td className="px-6 py-3 font-medium text-slate-700">{err.status}</td>
                        <td className="px-6 py-3 text-slate-500 hidden sm:table-cell">{err.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Error Response Format</h3>
                <CodeBlock
                  code={JSON.stringify(
                    {
                      success: false,
                      error: {
                        code: 'INVALID_DOCUMENT',
                        message: 'The provided document number is invalid',
                        details: 'Aadhaar number must be exactly 12 digits',
                      },
                      timestamp: '2024-01-15T10:30:00Z',
                    },
                    null,
                    2
                  )}
                  language="json"
                />
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Rate Limits</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-slate-900">100</div>
                    <div className="text-sm text-slate-500">Requests/minute</div>
                    <div className="text-xs text-slate-400 mt-1">Free tier</div>
                  </div>
                  <div className="bg-primary-50 rounded-xl p-4 text-center border border-primary-200">
                    <div className="text-2xl font-bold text-primary-700">1,000</div>
                    <div className="text-sm text-primary-600">Requests/minute</div>
                    <div className="text-xs text-primary-400 mt-1">Pro tier</div>
                  </div>
                  <div className="bg-slate-900 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">Unlimited</div>
                    <div className="text-sm text-slate-300">Requests/minute</div>
                    <div className="text-xs text-slate-400 mt-1">Enterprise</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
