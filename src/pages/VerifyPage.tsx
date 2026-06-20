import { useState, useRef, useCallback } from 'react';
import {
  Search,
  Upload,
  CheckCircle2,
  XCircle,
  ArrowRight,
  FileCheck,
  AlertTriangle,
  Loader2,
  RotateCcw,
  Download,
  Copy,
  Shield,
  X,
} from 'lucide-react';
import { documentTypes, categories } from '../data/documents';
import { DocumentType, VerificationResult } from '../types';
import { verifyDocument, API_BASE_URL } from '../api/client';

// Helper to flatten nested API response objects for display
function flattenObject(obj: any, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}_${key}` : key;
    if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      Object.assign(result, flattenObject(obj[key], fullKey));
    } else {
      result[fullKey] = String(obj[key]);
    }
  }
  return result;
}

export default function VerifyPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDoc, setSelectedDoc] = useState<DocumentType | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateRequiredFields = useCallback((doc: DocumentType, data: Record<string, string>): Record<string, string> => {
    const errors: Record<string, string> = {};
    for (const field of doc.fields) {
      if (field.required && field.type !== 'file') {
        const value = data[field.name];
        if (!value || value.trim() === '') {
          errors[field.name] = `${field.label} is required`;
        }
      }
    }
    return errors;
  }, []);

  const filteredDocs = documentTypes.filter((doc) => {
    const matchesCategory =
      selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleVerify = async () => {
    if (!selectedDoc) return;

    const errors = validateRequiredFields(selectedDoc, formData);
    setValidationErrors(errors);
    setApiError(null);
    if (Object.keys(errors).length > 0) return;

    setIsVerifying(true);
    setResult(null);

    try {
      const response = await verifyDocument(
        selectedDoc.endpoint,
        formData,
        selectedFile || undefined
      );

      if (response.success && response.data) {
        const data = response.data as any;

        // Backend returns VerificationStatus enum: "SUCCESS" | "FAILED" | "INVALID" | "PENDING"
        // Frontend UI expects:                      "verified"  | "failed"
        const rawStatus = (data.status as string)?.toUpperCase();
        const uiStatus: 'verified' | 'failed' =
          rawStatus === 'SUCCESS' ? 'verified' : 'failed';

        const mapped: VerificationResult = {
          success: uiStatus === 'verified',
          document_type: data.document_type || selectedDoc.name,
          status: uiStatus,
          confidence: data.confidence ?? data.confidence_score ?? 95,
          details: data.details || data.data || flattenObject(data),
          timestamp: data.timestamp || new Date().toISOString(),
          reference_id:
            data.reference_id ||
            data.txn_id ||
            data.ref_id ||
            `VRF-${Date.now()}`,
        };
        setResult(mapped);
      } else {
        setApiError(
          response.error?.message ||
          'Verification failed. Please check your inputs and try again.'
        );
      }
    } catch (err: any) {
      setApiError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    setSelectedDoc(null);
    setFormData({});
    setSelectedFile(null);
    setResult(null);
    setApiError(null);
    setValidationErrors({});
  };

  const handleCopyResult = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData({ ...formData, [fieldName]: file.name });
    }
  };

  // ─── Step 1: Select Document ───────────────────────────────────────────────
  if (!selectedDoc) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            Verify a Document
          </h2>
          <p className="text-slate-500">
            Select the type of document you want to verify
            <span className="text-xs text-slate-400 ml-2">
              Backend:{' '}
              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-primary-600 font-mono">
                {API_BASE_URL}
              </code>
            </span>
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedCategory === cat
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Document Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <button
              key={doc.id}
              onClick={() => {
                setSelectedDoc(doc);
                setFormData({});
                setValidationErrors({});
              }}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-100/50 transition-all duration-300 text-left group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{doc.icon}</span>
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                  {doc.category}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">
                {doc.name}
              </h3>
              <p className="text-sm text-slate-500 line-clamp-2">
                {doc.description}
              </p>
              <div className="mt-3 text-xs text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded inline-block">
                POST {doc.endpoint}
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-primary-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Verify Now <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>

        {filteredDocs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-1">
              No documents found
            </h3>
            <p className="text-sm text-slate-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    );
  }

  // ─── Step 2: Fill Form & View Results ─────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={handleReset}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          All Documents
        </button>
        <ArrowRight className="w-4 h-4 text-slate-400" />
        <span className="text-slate-700 font-medium">{selectedDoc.name}</span>
      </div>

      {/* Document Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 bg-gradient-to-br ${selectedDoc.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}
          >
            {selectedDoc.icon}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">
              {selectedDoc.name} Verification
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {selectedDoc.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                POST
              </span>
              <code className="text-xs font-mono text-slate-500">
                {API_BASE_URL}
                {selectedDoc.endpoint}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* API Error Banner */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-fade-in-up">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-red-800">Validation Error</h4>
            <p className="text-sm text-red-600 mt-0.5 whitespace-pre-wrap">{apiError}</p>
            {(apiError.includes('Field required') || apiError.includes('Missing required')) && (
              <p className="text-xs text-red-400 mt-1">
                Please fill in all required fields and try again.
              </p>
            )}
          </div>
          <button
            onClick={() => setApiError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Form (shown when no result yet) ── */}
      {!result && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Enter Document Details
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {selectedDoc.fields.map((field) => (
              <div
                key={field.name}
                className={field.type === 'file' ? 'sm:col-span-2' : ''}
              >
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-0.5">*</span>
                  )}
                </label>

                {field.type === 'file' ? (
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${selectedFile
                        ? 'border-emerald-300 bg-emerald-50'
                        : 'border-slate-200 hover:border-primary-300'
                      }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {selectedFile ? (
                      <>
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-emerald-700">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-emerald-500 mt-1">
                          {(selectedFile.size / 1024).toFixed(1)} KB — Click to
                          change
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-slate-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          PNG, JPG, PDF up to 10MB
                        </p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={field.accept}
                      className="hidden"
                      onChange={(e) => {
                        handleFileSelect(e, field.name);
                        setValidationErrors((prev) => {
                          const next = { ...prev };
                          delete next[field.name];
                          return next;
                        });
                      }}
                    />
                  </div>
                ) : field.type === 'select' ? (
                  <select
                    className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${validationErrors[field.name] ? 'border-red-400' : 'border-slate-200'
                      }`}
                    onChange={(e) => {
                      setFormData({ ...formData, [field.name]: e.target.value });
                      setValidationErrors((prev) => {
                        const next = { ...prev };
                        delete next[field.name];
                        return next;
                      });
                    }}
                    value={formData[field.name] || ''}
                  >
                    <option value="">Select...</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${validationErrors[field.name] ? 'border-red-400' : 'border-slate-200'
                      }`}
                    onChange={(e) => {
                      setFormData({ ...formData, [field.name]: e.target.value });
                      setValidationErrors((prev) => {
                        const next = { ...prev };
                        delete next[field.name];
                        return next;
                      });
                    }}
                    onBlur={(e) => {
                      if (formData[field.name] !== e.target.value) {
                        setFormData({ ...formData, [field.name]: e.target.value });
                      }
                    }}
                    value={formData[field.name] || ''}
                  />
                )}

                {validationErrors[field.name] && (
                  <p className="text-xs text-red-500 mt-1">
                    {validationErrors[field.name]}
                  </p>
                )}
                {!validationErrors[field.name] && field.helpText && (
                  <p className="text-xs text-slate-400 mt-1">
                    {field.helpText}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-100">
            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md shadow-primary-200 disabled:shadow-none"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <FileCheck className="w-5 h-5" />
                  Verify Document
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      )}

      {/* ── Result ── */}
      {result && (
        <div
          className={`rounded-2xl border-2 overflow-hidden animate-fade-in-up ${result.status === 'verified'
              ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white'
              : 'border-red-200 bg-gradient-to-br from-red-50 to-white'
            }`}
        >
          {/* Result Header */}
          <div
            className={`p-6 ${result.status === 'verified' ? 'bg-emerald-500' : 'bg-red-500'
              } text-white`}
          >
            <div className="flex items-center gap-3">
              {result.status === 'verified' ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <XCircle className="w-8 h-8" />
              )}
              <div>
                <h3 className="text-xl font-bold">
                  {result.status === 'verified'
                    ? 'Document Verified Successfully'
                    : 'Verification Failed'}
                </h3>
                <p className="text-sm opacity-90 mt-0.5">
                  Reference: {result.reference_id} •{' '}
                  {new Date(result.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Result Body */}
          <div className="p-6 space-y-6">
            {/* Confidence */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Confidence Score
                </span>
                <span
                  className={`text-lg font-bold ${result.confidence > 80
                      ? 'text-emerald-600'
                      : result.confidence > 50
                        ? 'text-amber-600'
                        : 'text-red-600'
                    }`}
                >
                  {result.confidence}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${result.confidence > 80
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                      : result.confidence > 50
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                        : 'bg-gradient-to-r from-red-500 to-red-400'
                    }`}
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>

            {/* Details */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                Verification Details
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {Object.entries(result.details).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-white rounded-xl p-4 border border-slate-100"
                  >
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      {String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Raw JSON Toggle */}
            <details className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
              <summary className="px-4 py-3 text-sm font-medium text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors">
                View Raw API Response
              </summary>
              <pre className="px-4 py-3 text-xs font-mono bg-slate-900 text-slate-300 overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>

            {/* Result Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={handleCopyResult}
                className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy JSON
              </button>
              <button className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                <Download className="w-4 h-4" />
                Download Report
              </button>
              {result.status === 'failed' && (
                <button
                  onClick={handleVerify}
                  className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-amber-200 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Retry Verification
                </button>
              )}
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors ml-auto"
              >
                <RotateCcw className="w-4 h-4" />
                Verify Another Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}