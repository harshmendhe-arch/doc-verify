from fastapi import APIRouter, Depends
from app.models.requests import IncomeCertificateVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
import uuid

router = APIRouter(prefix="/v1/verify", tags=["Income Certificate"])

@router.post("/income-certificate", response_model=BaseVerifyResponse, summary="Verify Income Certificate")
async def verify_income_certificate(request: IncomeCertificateVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify Income Certificate.

    **Source:** eDistrict Kerala / State portal
    """
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="Income Certificate verified successfully (mock response)",
        document_type="Income Certificate",
        txn_id=str(uuid.uuid4()),
        data={"certificate_number": getattr(request, "certificate_number", None), "verified": True}
    )
