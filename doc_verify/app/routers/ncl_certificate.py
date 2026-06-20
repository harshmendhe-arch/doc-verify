from fastapi import APIRouter, Depends
from app.models.requests import NCLCertificateVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
import uuid

router = APIRouter(prefix="/v1/verify", tags=["Non Creamy Layer Certificate"])

@router.post("/ncl-certificate", response_model=BaseVerifyResponse, summary="Verify Non Creamy Layer Certificate")
async def verify_ncl_certificate(request: NCLCertificateVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify Non Creamy Layer Certificate.

    **Source:** eDistrict Kerala / State portal
    """
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="Non Creamy Layer Certificate verified successfully (mock response)",
        document_type="Non Creamy Layer Certificate",
        txn_id=str(uuid.uuid4()),
        data={"certificate_number": getattr(request, "certificate_number", None), "verified": True}
    )
