from fastapi import APIRouter, Depends
from app.models.requests import DegreeCertificateVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
import uuid

router = APIRouter(prefix="/v1/verify", tags=["Degree Certificate"])

@router.post("/degree-certificate", response_model=BaseVerifyResponse, summary="Verify Degree Certificate")
async def verify_degree_certificate(request: DegreeCertificateVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify Degree Certificate.

    **Source:** University / NAD via DigiLocker
    """
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="Degree Certificate verified successfully (mock response)",
        document_type="Degree Certificate",
        txn_id=str(uuid.uuid4()),
        data={"certificate_number": getattr(request, "certificate_number", None), "verified": True}
    )
