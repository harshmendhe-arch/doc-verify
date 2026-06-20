from fastapi import APIRouter, Depends
from app.models.requests import PassportVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
from app.validators.document_validators import validate_passport
import uuid

router = APIRouter(prefix="/v1/verify", tags=["Passport"])

@router.post("/passport", response_model=BaseVerifyResponse, summary="Verify Passport")
async def verify_passport(request: PassportVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify Indian Passport.

    **Parameters:**
    - `passport_number`: 1 letter + 7 digits (e.g., A1234567)
    - `name`, `dob`, `doi` (date of issue), `doe` (date of expiry)

    **Source:** Ministry of External Affairs / Passport Seva
    """
    if not validate_passport(request.passport_number):
        return BaseVerifyResponse(
            status=VerificationStatus.INVALID,
            message="Invalid passport number. Format: 1 letter + 7 digits",
            document_type="Passport", txn_id=str(uuid.uuid4())
        )
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="Passport verified successfully (mock response)",
        document_type="Passport", txn_id=str(uuid.uuid4()),
        data={"passport_number": request.passport_number.upper(), "name": request.name,
              "dob": request.dob, "doi": request.doi, "doe": request.doe, "verified": True}
    )
