from fastapi import APIRouter, Depends
from app.models.requests import PropertyRegistrationVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
import uuid

router = APIRouter(prefix="/v1/verify", tags=["Property Registration Document"])

@router.post("/property-registration", response_model=BaseVerifyResponse, summary="Verify Property Registration Document")
async def verify_property_registration(request: PropertyRegistrationVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify Property Registration Document.

    **Source:** State Registration Dept / eSampada Kerala
    """
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="Property Registration Document verified successfully (mock response)",
        document_type="Property Registration Document",
        txn_id=str(uuid.uuid4()),
        data={"doc_number": getattr(request, "doc_number", None), "verified": True}
    )
