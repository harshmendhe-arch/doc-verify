from fastapi import APIRouter, Depends
from app.models.requests import MigrationCertificateVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
import uuid

router = APIRouter(prefix="/v1/verify", tags=["Migration Certificate"])

@router.post("/migration-certificate", response_model=BaseVerifyResponse, summary="Verify Migration Certificate")
async def verify_migration_certificate(request: MigrationCertificateVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify Migration Certificate.

    **Source:** CBSE / State Board
    """
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="Migration Certificate verified successfully (mock response)",
        document_type="Migration Certificate",
        txn_id=str(uuid.uuid4()),
        data={"certificate_number": getattr(request, "certificate_number", None), "verified": True}
    )
