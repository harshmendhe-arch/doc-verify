export interface DocumentType {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  endpoint: string;
  fields: DocumentField[];
  color: string;
}

export interface DocumentField {
  name: string;
  label: string;
  type: 'text' | 'file' | 'date' | 'select' | 'number';
  required: boolean;
  placeholder?: string;
  options?: string[];
  accept?: string;
  helpText?: string;
}

export interface VerificationResult {
  success: boolean;
  document_type: string;
  status: 'verified' | 'failed' | 'pending' | 'partial';
  confidence: number;
  details: Record<string, string>;
  timestamp: string;
  reference_id: string;
}

export interface ApiKey {
  key: string;
  name: string;
  created: string;
  lastUsed: string;
  status: 'active' | 'revoked';
}

export interface StatsData {
  totalVerifications: number;
  successRate: number;
  avgResponseTime: string;
  documentsSupported: number;
}
