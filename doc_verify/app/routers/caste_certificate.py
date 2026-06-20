from fastapi import APIRouter, Depends
from app.models.requests import CasteCertificateVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
import uuid

router = APIRouter(prefix="/v1/verify", tags=["Caste Certificate"])

@router.post("/caste-certificate", response_model=BaseVerifyResponse, summary="Verify Caste Certificate")
async def verify_caste_certificate(request: CasteCertificateVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify Caste Certificate.

    **Source:** eDistrict Kerala / State portal
    """
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="Caste Certificate verified successfully (mock response)",
        document_type="Caste Certificate",
        txn_id=str(uuid.uuid4()),
        data={"certificate_number": getattr(request, "certificate_number", None), "verified": True}
    )
