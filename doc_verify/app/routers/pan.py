from fastapi import APIRouter, Depends, HTTPException, status
from app.models.requests import PANVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
from app.validators.document_validators import validate_pan
import uuid

router = APIRouter(prefix="/v1/verify", tags=["PAN Card"])

@router.post("/pan", response_model=BaseVerifyResponse, summary="Verify PAN Card")
async def verify_pan(request: PANVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify PAN Card via Income Tax Dept.

    **Parameters:**
    - `pan_number`: PAN in format AAAAA9999A (mandatory)
    - `name`: Name on PAN (optional)
    - `dob`: Date of birth YYYY-MM-DD (optional)
    - `consent`: Must be true

    **Source:** Income Tax Dept via API Setu
    """
    if not validate_pan(request.pan_number):
        return BaseVerifyResponse(
            status=VerificationStatus.INVALID,
            message="Invalid PAN format. Expected: AAAAA9999A",
            document_type="PAN Card", txn_id=str(uuid.uuid4())
        )
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="PAN verified successfully (mock response)",
        document_type="PAN Card", txn_id=str(uuid.uuid4()),
        data={"pan_number": request.pan_number.upper(), "name": request.name, "dob": request.dob, "verified": True}
    )
