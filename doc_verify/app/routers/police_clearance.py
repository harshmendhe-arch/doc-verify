from fastapi import APIRouter, Depends
from app.models.requests import PoliceClearanceVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
import uuid

router = APIRouter(prefix="/v1/verify", tags=["Police Clearance Certificate"])

@router.post("/police-clearance", response_model=BaseVerifyResponse, summary="Verify Police Clearance Certificate")
async def verify_police_clearance(request: PoliceClearanceVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify Police Clearance Certificate.

    **Source:** State Police / eDistrict Kerala
    """
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="Police Clearance Certificate verified successfully (mock response)",
        document_type="Police Clearance Certificate",
        txn_id=str(uuid.uuid4()),
        data={"pcc_number": getattr(request, "pcc_number", None), "verified": True}
    )
