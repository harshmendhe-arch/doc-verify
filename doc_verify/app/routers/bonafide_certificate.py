from fastapi import APIRouter, Depends
from app.models.requests import BonafideCertificateVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
import uuid

router = APIRouter(prefix="/v1/verify", tags=["Bonafide Certificate"])

@router.post("/bonafide-certificate", response_model=BaseVerifyResponse, summary="Verify Bonafide Certificate")
async def verify_bonafide_certificate(request: BonafideCertificateVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify Bonafide Certificate.

    **Source:** Institution / eDistrict Kerala
    """
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="Bonafide Certificate verified successfully (mock response)",
        document_type="Bonafide Certificate",
        txn_id=str(uuid.uuid4()),
        data={"certificate_number": getattr(request, "certificate_number", None), "verified": True}
    )
