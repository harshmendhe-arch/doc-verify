from fastapi import APIRouter, Depends
from app.models.requests import DeathCertificateVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
import uuid

router = APIRouter(prefix="/v1/verify", tags=["Death Certificate"])

@router.post("/death-certificate", response_model=BaseVerifyResponse, summary="Verify Death Certificate")
async def verify_death_certificate(request: DeathCertificateVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify Death Certificate.

    **Source:** Civil Registration System / eDistrict Kerala
    """
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="Death Certificate verified successfully (mock response)",
        document_type="Death Certificate",
        txn_id=str(uuid.uuid4()),
        data={"certificate_number": getattr(request, "certificate_number", None), "verified": True}
    )
