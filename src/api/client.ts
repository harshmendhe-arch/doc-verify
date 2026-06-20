// ============================================================
// API Client — connects the frontend to the FastAPI backend
//
// In development:  Vite proxies /v1/* → http://localhost:8001
//                  so VITE_API_BASE_URL can be left unset.
// In production:   Set VITE_API_BASE_URL=https://your-api.com
//                  in your deployment environment.
//
// Environment variables in Vite MUST be prefixed with VITE_
// and accessed via import.meta.env (not process.env).
// ============================================================

// ✅ Vite exposes env vars via import.meta.env (not process.env)
//    VITE_API_BASE_URL is optional — falls back to localhost:8001
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  'http://localhost:8001';

// -----------------------------------------------------------
// API key helpers — stored in localStorage, set on Settings page
// -----------------------------------------------------------

/** Read the API key: localStorage → VITE_API_KEY env var → empty string */
export function getApiKey(): string {
  return (
    localStorage.getItem('docverify_api_key') ||
    (import.meta.env.VITE_API_KEY as string | undefined) ||
    ''
  );
}

/** Persist the API key to localStorage */
export function setApiKey(key: string): void {
  localStorage.setItem('docverify_api_key', key);
}

// -----------------------------------------------------------
// Shared response shape
// -----------------------------------------------------------
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}

// -----------------------------------------------------------
// Internal type used only inside `request` for raw JSON parsing.
// The backend may return { detail: string } or { detail: object }
// on error, so we capture that loosely here.
// -----------------------------------------------------------
interface RawErrorBody {
  detail?: string | Record<string, unknown> | unknown;
  [key: string]: unknown;
}

// -----------------------------------------------------------
// Core fetch wrapper — auth, error handling & 30 s timeout
// -----------------------------------------------------------
async function request<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const apiKey = getApiKey();

  // Build headers, preserving any caller-supplied ones
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  // Only set Content-Type to JSON when the body is NOT FormData.
  // FormData sets its own multipart boundary automatically.
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // ✅ Backend expects X-API-Key header
  //    (FastAPI dependency: `api_key: str = Header(alias='x-api-key')`)
  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }

  try {
    // Abort the request if it takes longer than 30 seconds
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    // ── Parse the response body ──────────────────────────────
    const contentType = response.headers.get('content-type') ?? '';
    let rawBody: RawErrorBody | undefined;
    let typedData: T | undefined;

    if (contentType.includes('application/json')) {
      // Parse once into a generic object so we can inspect `detail`
      // on error responses without TypeScript complaining.
      rawBody = (await response.json()) as RawErrorBody;

      if (response.ok) {
        // On success the body IS the expected shape T
        typedData = rawBody as unknown as T;
      }
    }

    // ── Handle HTTP error responses ──────────────────────────
    if (!response.ok) {
      // FastAPI validation / application errors arrive as:
      //   { "detail": "string" }  or  { "detail": [ { loc, msg, type } ] }
      let message: string;

      if (rawBody?.detail !== undefined) {
        message =
          typeof rawBody.detail === 'string'
            ? rawBody.detail
            : JSON.stringify(rawBody.detail);
      } else {
        message = response.statusText || `HTTP error ${response.status}`;
      }

      return {
        success: false,
        error: {
          code: `HTTP_${response.status}`,
          message,
          details: rawBody !== undefined ? JSON.stringify(rawBody) : undefined,
        },
      };
    }

    return { success: true, data: typedData };
  } catch (err: unknown) {
    // ── Timeout ──────────────────────────────────────────────
    if (err instanceof DOMException && err.name === 'AbortError') {
      return {
        success: false,
        error: {
          code: 'TIMEOUT',
          message: 'Request timed out after 30 seconds. Please try again.',
        },
      };
    }

    // ── Network / other errors ───────────────────────────────
    const message =
      err instanceof Error
        ? err.message
        : `Unable to connect to the backend at ${API_BASE_URL}. Make sure it is running.`;

    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message,
      },
    };
  }
}

// -----------------------------------------------------------
// Public API methods
// -----------------------------------------------------------

/** Health check — GET /health */
export async function checkHealth(): Promise<ApiResponse> {
  return request('/health');
}

/**
 * Verify a document.
 *
 * @param endpoint  e.g. '/v1/verify/aadhaar'
 * @param formData  key/value pairs collected from the UI form
 * @param file      optional document image/PDF (currently unused by the
 *                  mock backend, which accepts JSON only; kept for when
 *                  the real endpoint supports multipart uploads)
 */
export async function verifyDocument(
  endpoint: string,
  formData: Record<string, string>,
  file?: File
): Promise<ApiResponse> {
  // The backend uses strict Pydantic JSON models — always send JSON.
  // The `file` parameter is accepted here so the call-site signature
  // stays stable when multipart support is added later.
  void file; // explicitly mark as intentionally unused for now

  // Build a clean payload: always include consent, skip the file-field
  // placeholder value (`document_image`) and any blank strings.
  const payload: Record<string, unknown> = { consent: true };

  for (const [key, value] of Object.entries(formData)) {
    if (value !== '' && key !== 'document_image') {
      payload[key] = value;
    }
  }

  return request(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** Dashboard statistics — GET /v1/stats */
export async function getDashboardStats(): Promise<ApiResponse> {
  return request('/v1/stats');
}

/** Recent verifications — GET /v1/verifications/recent */
export async function getRecentVerifications(): Promise<ApiResponse> {
  return request('/v1/verifications/recent');
}