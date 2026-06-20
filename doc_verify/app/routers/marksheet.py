from fastapi import APIRouter, Depends
from app.models.requests import MarksheetVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
import uuid

router = APIRouter(prefix="/v1/verify", tags=["Marksheet"])

@router.post("/marksheet", response_model=BaseVerifyResponse, summary="Verify Marksheet")
async def verify_marksheet(request: MarksheetVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify Marksheet.

    **Source:** Board / University via DigiLocker
    """
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="Marksheet verified successfully (mock response)",
        document_type="Marksheet",
        txn_id=str(uuid.uuid4()),
        data={"roll_number": getattr(request, "roll_number", None), "verified": True}
    )
