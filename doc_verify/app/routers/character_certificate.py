from fastapi import APIRouter, Depends
from app.models.requests import CharacterCertificateVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
import uuid

router = APIRouter(prefix="/v1/verify", tags=["Character Certificate"])

@router.post("/character-certificate", response_model=BaseVerifyResponse, summary="Verify Character Certificate")
async def verify_character_certificate(request: CharacterCertificateVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify Character Certificate.

    **Source:** Institution / eDistrict Kerala
    """
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="Character Certificate verified successfully (mock response)",
        document_type="Character Certificate",
        txn_id=str(uuid.uuid4()),
        data={"certificate_number": getattr(request, "certificate_number", None), "verified": True}
    )
