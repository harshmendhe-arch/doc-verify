from fastapi import APIRouter, Depends
from app.models.requests import DisabilityCertificateVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
import uuid

router = APIRouter(prefix="/v1/verify", tags=["Disability Certificate"])

@router.post("/disability-certificate", response_model=BaseVerifyResponse, summary="Verify Disability Certificate")
async def verify_disability_certificate(request: DisabilityCertificateVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify Disability Certificate.

    **Source:** SADM / eDistrict Kerala
    """
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="Disability Certificate verified successfully (mock response)",
        document_type="Disability Certificate",
        txn_id=str(uuid.uuid4()),
        data={"certificate_number": getattr(request, "certificate_number", None), "verified": True}
    )
