from fastapi import APIRouter, Depends
from app.models.requests import DomicileCertificateVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
import uuid

router = APIRouter(prefix="/v1/verify", tags=["Domicile Certificate"])

@router.post("/domicile-certificate", response_model=BaseVerifyResponse, summary="Verify Domicile Certificate")
async def verify_domicile_certificate(request: DomicileCertificateVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify Domicile Certificate.

    **Source:** eDistrict Kerala / State portal
    """
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="Domicile Certificate verified successfully (mock response)",
        document_type="Domicile Certificate",
        txn_id=str(uuid.uuid4()),
        data={"certificate_number": getattr(request, "certificate_number", None), "verified": True}
    )
