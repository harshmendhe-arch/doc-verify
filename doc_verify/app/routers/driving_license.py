from fastapi import APIRouter, Depends
from app.models.requests import DrivingLicenseVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
import uuid

router = APIRouter(prefix="/v1/verify", tags=["Driving License"])

@router.post("/driving-license", response_model=BaseVerifyResponse, summary="Verify Driving License")
async def verify_dl(request: DrivingLicenseVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify Driving License via Parivahan / SARATHI.

    **Parameters:**
    - `dl_number`: DL number (e.g., KL0120100012345)
    - `dob`: Date of birth for cross-check

    **Source:** MoRTH Parivahan via API Setu
    """
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="Driving License verified successfully (mock response)",
        document_type="Driving License", txn_id=str(uuid.uuid4()),
        data={"dl_number": request.dl_number.upper(), "dob": request.dob, "verified": True}
    )
