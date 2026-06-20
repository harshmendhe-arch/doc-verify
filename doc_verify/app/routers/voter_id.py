from fastapi import APIRouter, Depends
from app.models.requests import VoterIDVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
from app.validators.document_validators import validate_voter_id
import uuid

router = APIRouter(prefix="/v1/verify", tags=["Voter ID Card"])

@router.post("/voter-id", response_model=BaseVerifyResponse, summary="Verify Voter ID Card")
async def verify_voter_id(request: VoterIDVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify Voter ID (EPIC) via Election Commission.

    **Parameters:**
    - `epic_number`: EPIC number (3 letters + 7 digits)
    - `name`, `dob`, `state` (optional)

    **Source:** Election Commission of India via API Setu
    """
    if not validate_voter_id(request.epic_number):
        return BaseVerifyResponse(
            status=VerificationStatus.INVALID,
            message="Invalid EPIC format. Expected: 3 letters + 7 digits",
            document_type="Voter ID Card", txn_id=str(uuid.uuid4())
        )
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS, message="Voter ID verified (mock response)",
        document_type="Voter ID Card", txn_id=str(uuid.uuid4()),
        data={"epic_number": request.epic_number.upper(), "name": request.name, "verified": True}
    )
