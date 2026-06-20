from fastapi import APIRouter, Depends
from app.models.requests import TransferCertificateVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
import uuid

router = APIRouter(prefix="/v1/verify", tags=["Transfer Certificate"])

@router.post("/transfer-certificate", response_model=BaseVerifyResponse, summary="Verify Transfer Certificate")
async def verify_transfer_certificate(request: TransferCertificateVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify Transfer Certificate.

    **Source:** School / eDistrict Kerala
    """
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="Transfer Certificate verified successfully (mock response)",
        document_type="Transfer Certificate",
        txn_id=str(uuid.uuid4()),
        data={"certificate_number": getattr(request, "certificate_number", None), "verified": True}
    )
