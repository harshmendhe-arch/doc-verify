from fastapi import APIRouter, Depends, HTTPException, status
from app.models.requests import AadhaarVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
from app.validators.document_validators import validate_aadhaar
import uuid

router = APIRouter(prefix="/v1/verify", tags=["Aadhaar Card"])

@router.post("/aadhaar", response_model=BaseVerifyResponse, summary="Verify Aadhaar Card")
async def verify_aadhaar(
    request: AadhaarVerifyRequest,
    api_key: str = Depends(verify_api_key)
):
    """
    Verify Aadhaar Card details.

    **Parameters:**
    - `aadhaar_number`: 12-digit Aadhaar number (mandatory)
    - `name`: Name as on Aadhaar (optional, for cross-validation)
    - `dob`: Date of birth YYYY-MM-DD (optional)
    - `gender`: M/F/T (optional)
    - `consent`: User consent required (mandatory, must be true)

    **Source:** UIDAI via API Setu
    """
    if not request.consent:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User consent is required")

    if not validate_aadhaar(request.aadhaar_number):
        return BaseVerifyResponse(
            status=VerificationStatus.INVALID,
            message="Invalid Aadhaar number format. Must be 12 digits, not starting with 0 or 1.",
            document_type="Aadhaar Card",
            txn_id=str(uuid.uuid4())
        )

    # TODO: Replace with actual UIDAI / API Setu call
    # POST https://apisetu.gov.in/uidai/v3/otp  then  POST /verifyAadhaar
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="Aadhaar verified successfully (mock response)",
        document_type="Aadhaar Card",
        txn_id=str(uuid.uuid4()),
        data={
            "aadhaar_number": f"XXXX-XXXX-{request.aadhaar_number[-4:]}",
            "name": request.name,
            "dob": request.dob,
            "gender": request.gender,
            "verified": True
        }
    )
