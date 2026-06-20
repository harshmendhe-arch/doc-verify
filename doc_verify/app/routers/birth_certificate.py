from fastapi import APIRouter, Depends
from app.models.requests import BirthCertificateVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
import uuid

router = APIRouter(prefix="/v1/verify", tags=["Birth Certificate"])

@router.post("/birth-certificate", response_model=BaseVerifyResponse, summary="Verify Birth Certificate")
async def verify_birth_certificate(request: BirthCertificateVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify Birth Certificate.

    **Source:** Civil Registration System / eDistrict Kerala
    """
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="Birth Certificate verified successfully (mock response)",
        document_type="Birth Certificate",
        txn_id=str(uuid.uuid4()),
        data={"certificate_number": getattr(request, "certificate_number", None), "verified": True}
    )
