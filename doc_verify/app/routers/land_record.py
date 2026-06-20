from fastapi import APIRouter, Depends
from app.models.requests import LandRecordVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
import uuid

router = APIRouter(prefix="/v1/verify", tags=["Land Record Document"])

@router.post("/land-record", response_model=BaseVerifyResponse, summary="Verify Land Record Document")
async def verify_land_record(request: LandRecordVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify Land Record Document.

    **Source:** Revenue Dept / E-Rekha Kerala
    """
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="Land Record Document verified successfully (mock response)",
        document_type="Land Record Document",
        txn_id=str(uuid.uuid4()),
        data={"survey_number": getattr(request, "survey_number", None), "verified": True}
    )
