from fastapi import APIRouter, Depends
from app.models.requests import EWSCertificateVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
import uuid

router = APIRouter(prefix="/v1/verify", tags=["EWS Certificate"])

@router.post("/ews-certificate", response_model=BaseVerifyResponse, summary="Verify EWS Certificate")
async def verify_ews_certificate(request: EWSCertificateVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify EWS Certificate.

    **Source:** eDistrict Kerala / State portal
    """
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="EWS Certificate verified successfully (mock response)",
        document_type="EWS Certificate",
        txn_id=str(uuid.uuid4()),
        data={"certificate_number": getattr(request, "certificate_number", None), "verified": True}
    )
