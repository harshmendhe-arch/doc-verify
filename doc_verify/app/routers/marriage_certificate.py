from fastapi import APIRouter, Depends
from app.models.requests import MarriageCertificateVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
import uuid

router = APIRouter(prefix="/v1/verify", tags=["Marriage Certificate"])

@router.post("/marriage-certificate", response_model=BaseVerifyResponse, summary="Verify Marriage Certificate")
async def verify_marriage_certificate(request: MarriageCertificateVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify Marriage Certificate.

    **Source:** Civil Registration System / eDistrict Kerala
    """
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="Marriage Certificate verified successfully (mock response)",
        document_type="Marriage Certificate",
        txn_id=str(uuid.uuid4()),
        data={"certificate_number": getattr(request, "certificate_number", None), "verified": True}
    )
