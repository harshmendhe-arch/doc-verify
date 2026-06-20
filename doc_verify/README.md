# Document Verification API

FastAPI backend to verify 24 Indian government documents. Structured after [API Setu / eDistrict Kerala](https://directory.apisetu.gov.in/api-collection/edistrictkerala).

## Supported Documents

| # | Document | Endpoint |
|---|----------|----------|
| 1 | Aadhaar Card | `POST /v1/verify/aadhaar` |
| 2 | PAN Card | `POST /v1/verify/pan` |
| 3 | Passport | `POST /v1/verify/passport` |
| 4 | Driving License | `POST /v1/verify/driving-license` |
| 5 | Voter ID Card | `POST /v1/verify/voter-id` |
| 6 | Ration Card | `POST /v1/verify/ration-card` |
| 7 | Birth Certificate | `POST /v1/verify/birth-certificate` |
| 8 | Death Certificate | `POST /v1/verify/death-certificate` |
| 9 | Caste Certificate | `POST /v1/verify/caste-certificate` |
| 10 | Income Certificate | `POST /v1/verify/income-certificate` |
| 11 | Domicile Certificate | `POST /v1/verify/domicile-certificate` |
| 12 | Non Creamy Layer Certificate | `POST /v1/verify/ncl-certificate` |
| 13 | EWS Certificate | `POST /v1/verify/ews-certificate` |
| 14 | Disability Certificate | `POST /v1/verify/disability-certificate` |
| 15 | Marriage Certificate | `POST /v1/verify/marriage-certificate` |
| 16 | Property Registration Document | `POST /v1/verify/property-registration` |
| 17 | Land Record Document | `POST /v1/verify/land-record` |
| 18 | Vehicle Registration Certificate | `POST /v1/verify/vehicle-registration` |
| 19 | Police Clearance Certificate | `POST /v1/verify/police-clearance` |
| 20 | Migration Certificate | `POST /v1/verify/migration-certificate` |
| 21 | Transfer Certificate | `POST /v1/verify/transfer-certificate` |
| 22 | Degree Certificate | `POST /v1/verify/degree-certificate` |
| 23 | Marksheet | `POST /v1/verify/marksheet` |
| 24 | Bonafide Certificate | `POST /v1/verify/bonafide-certificate` |
| 25 | Character Certificate | `POST /v1/verify/character-certificate` |

## Quick Start

```bash
# 1. Clone / extract zip
cd doc_verify

# 2. Create env
cp .env.example .env
# Edit .env with your API Setu credentials

# 3. Install deps
pip install -r requirements.txt

# 4. Run
python run.py
# OR
uvicorn app.main:app --reload --port 8001
```

## Docker

```bash
docker-compose up --build
```

## Auth

All endpoints require `X-Api-Key` header:

```http
X-Api-Key: your-secret-api-key-here
```

## Example Request

```bash
curl -X POST http://localhost:8001/v1/verify/aadhaar \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: test-api-key-change-in-prod" \
  -d '{
    "aadhaar_number": "234567890123",
    "name": "Rahul Kumar",
    "dob": "1990-01-15",
    "gender": "M",
    "consent": true
  }'
```

## Response Schema

```json
{
  "status": "SUCCESS | FAILURE | INVALID | NOT_FOUND",
  "message": "...",
  "document_type": "Aadhaar Card",
  "txn_id": "uuid",
  "data": { ... }
}
```

## Swagger UI

`http://localhost:8001/docs`

## Production Integration

Each router has a `# TODO` comment pointing to the real API Setu / eDistrict Kerala endpoint. Register at:
- https://www.apisetu.gov.in/
- https://directory.apisetu.gov.in/api-collection/edistrictkerala

Replace mock `return` with actual `httpx.AsyncClient` calls using credentials from `.env`.

## Project Structure

```
doc_verify/
├── app/
│   ├── main.py               # FastAPI app, router registration
│   ├── core/
│   │   ├── config.py         # Settings (pydantic-settings)
│   │   ├── auth.py           # API key dependency
│   │   └── response.py       # Shared response models
│   ├── models/
│   │   └── requests.py       # All 24 Pydantic request models
│   ├── validators/
│   │   └── document_validators.py  # Format validators
│   └── routers/              # One file per document type
│       ├── aadhaar.py
│       ├── pan.py
│       └── ...
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── run.py
└── .env.example
```
