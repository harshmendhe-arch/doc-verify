from fastapi import APIRouter, Depends
from app.models.requests import VehicleRegistrationVerifyRequest
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.auth import verify_api_key
import uuid

router = APIRouter(prefix="/v1/verify", tags=["Vehicle Registration Certificate"])

@router.post("/vehicle-registration", response_model=BaseVerifyResponse, summary="Verify Vehicle Registration Certificate")
async def verify_vehicle_registration(request: VehicleRegistrationVerifyRequest, api_key: str = Depends(verify_api_key)):
    """
    Verify Vehicle Registration Certificate.

    **Source:** MoRTH Parivahan / VAHAN
    """
    return BaseVerifyResponse(
        status=VerificationStatus.SUCCESS,
        message="Vehicle Registration Certificate verified successfully (mock response)",
        document_type="Vehicle Registration Certificate",
        txn_id=str(uuid.uuid4()),
        data={"reg_number": getattr(request, "reg_number", None), "verified": True}
    )
