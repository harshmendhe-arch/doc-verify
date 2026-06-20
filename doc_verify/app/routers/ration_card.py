from fastapi import APIRouter, Depends
from app.models.requests import RationCardVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
import uuid

router = APIRouter(prefix="/v1/verify", tags=["Ration Card"])

@router.post("/ration-card", response_model=BaseVerifyResponse, summary="Verify Ration Card")
async def verify_ration_card(request: RationCardVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify Ration Card.

    **Source:** State FCS / NIC via API Setu
    """
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="Ration Card verified successfully (mock response)",
        document_type="Ration Card",
        txn_id=str(uuid.uuid4()),
        data={"ration_card_number": getattr(request, "ration_card_number", None), "verified": True}
    )
