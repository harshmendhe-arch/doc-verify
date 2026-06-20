from pydantic import BaseModel
from typing import Optional, Any, Dict
from enum import Enum

class VerificationStatus(str, Enum):
    SUCCESS = "SUCCESS"
    FAILURE = "FAILURE"
    INVALID = "INVALID"
    NOT_FOUND = "NOT_FOUND"

class BaseVerifyResponse(BaseModel):
    status: VerificationStatus
    message: str
    document_type: str
    data: Optional[Dict[str, Any]] = None
    txn_id: Optional[str] = None

class ErrorResponse(BaseModel):
    status: str = "ERROR"
    message: str
    detail: Optional[str] = None
