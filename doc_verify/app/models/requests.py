from pydantic import BaseModel, Field, validator
from typing import Optional
import re

# ── 1. Aadhaar ──────────────────────────────────────────────
class AadhaarVerifyRequest(BaseModel):
    aadhaar_number: str = Field(..., example="234567890123", description="12-digit Aadhaar number")
    name: Optional[str] = Field(None, example="Rahul Kumar")
    dob: Optional[str] = Field(None, example="1990-01-15", description="Date of birth YYYY-MM-DD")
    gender: Optional[str] = Field(None, example="M", description="M/F/T")
    consent: bool = Field(..., description="User consent for data fetch")

# ── 2. PAN ───────────────────────────────────────────────────
class PANVerifyRequest(BaseModel):
    pan_number: str = Field(..., example="ABCDE1234F")
    name: Optional[str] = Field(None, example="Rahul Kumar")
    dob: Optional[str] = Field(None, example="1990-01-15")
    consent: bool = True

# ── 3. Passport ──────────────────────────────────────────────
class PassportVerifyRequest(BaseModel):
    passport_number: str = Field(..., example="A1234567")
    name: str = Field(..., example="Rahul Kumar")
    dob: str = Field(..., example="1990-01-15")
    doi: str = Field(..., example="2015-03-10", description="Date of issue")
    doe: str = Field(..., example="2025-03-09", description="Date of expiry")
    consent: bool = True

# ── 4. Driving License ───────────────────────────────────────
class DrivingLicenseVerifyRequest(BaseModel):
    dl_number: str = Field(..., example="KL0120100012345")
    dob: str = Field(..., example="1990-01-15")
    consent: bool = True

# ── 5. Voter ID ──────────────────────────────────────────────
class VoterIDVerifyRequest(BaseModel):
    epic_number: str = Field(..., example="ABC1234567")
    name: Optional[str] = Field(None)
    dob: Optional[str] = Field(None, example="1990-01-15")
    state: Optional[str] = Field(None, example="Kerala")
    consent: bool = True

# ── 6. Ration Card ───────────────────────────────────────────
class RationCardVerifyRequest(BaseModel):
    ration_card_number: str = Field(..., example="KL123456789")
    state: str = Field(..., example="Kerala")
    name: Optional[str] = Field(None)
    consent: bool = True

# ── 7. Birth Certificate ─────────────────────────────────────
class BirthCertificateVerifyRequest(BaseModel):
    certificate_number: str = Field(..., example="BC/2000/KL/001234")
    name: str = Field(..., example="Rahul Kumar")
    dob: str = Field(..., example="2000-06-15")
    district: str = Field(..., example="Ernakulam")
    state: str = Field("Kerala", example="Kerala")
    consent: bool = True

# ── 8. Death Certificate ─────────────────────────────────────
class DeathCertificateVerifyRequest(BaseModel):
    certificate_number: str = Field(..., example="DC/2020/KL/005678")
    deceased_name: str = Field(..., example="Suresh Kumar")
    dod: str = Field(..., example="2020-03-10", description="Date of death")
    district: str = Field(..., example="Thrissur")
    state: str = Field("Kerala")
    consent: bool = True

# ── 9. Caste Certificate ─────────────────────────────────────
class CasteCertificateVerifyRequest(BaseModel):
    certificate_number: str = Field(..., example="CC/KL/2021/001")
    name: str = Field(..., example="Rahul Kumar")
    caste: Optional[str] = Field(None, example="OBC")
    issuing_authority: Optional[str] = Field(None, example="Tahsildar, Ernakulam")
    state: str = Field("Kerala")
    consent: bool = True

# ── 10. Income Certificate ───────────────────────────────────
class IncomeCertificateVerifyRequest(BaseModel):
    certificate_number: str = Field(..., example="IC/KL/2022/0045")
    name: str = Field(..., example="Rahul Kumar")
    annual_income: Optional[float] = Field(None, example=250000.0)
    issuing_authority: Optional[str] = Field(None)
    state: str = Field("Kerala")
    consent: bool = True

# ── 11. Domicile Certificate ─────────────────────────────────
class DomicileCertificateVerifyRequest(BaseModel):
    certificate_number: str = Field(..., example="DOM/KL/2021/0099")
    name: str = Field(..., example="Rahul Kumar")
    state: str = Field("Kerala")
    district: Optional[str] = Field(None)
    consent: bool = True

# ── 12. Non-Creamy Layer Certificate ────────────────────────
class NCLCertificateVerifyRequest(BaseModel):
    certificate_number: str = Field(..., example="NCL/KL/2022/0034")
    name: str = Field(..., example="Rahul Kumar")
    caste: Optional[str] = Field(None, example="OBC")
    state: str = Field("Kerala")
    consent: bool = True

# ── 13. EWS Certificate ──────────────────────────────────────
class EWSCertificateVerifyRequest(BaseModel):
    certificate_number: str = Field(..., example="EWS/KL/2022/0011")
    name: str = Field(..., example="Rahul Kumar")
    state: str = Field("Kerala")
    consent: bool = True

# ── 14. Disability Certificate ───────────────────────────────
class DisabilityCertificateVerifyRequest(BaseModel):
    certificate_number: str = Field(..., example="DIS/KL/2021/0078")
    name: str = Field(..., example="Rahul Kumar")
    disability_type: Optional[str] = Field(None, example="Locomotor")
    percentage: Optional[float] = Field(None, example=45.0)
    state: str = Field("Kerala")
    consent: bool = True

# ── 15. Marriage Certificate ─────────────────────────────────
class MarriageCertificateVerifyRequest(BaseModel):
    certificate_number: str = Field(..., example="MC/KL/2019/0023")
    husband_name: str = Field(..., example="Rahul Kumar")
    wife_name: str = Field(..., example="Priya Sharma")
    dom: str = Field(..., example="2019-02-14", description="Date of marriage")
    state: str = Field("Kerala")
    consent: bool = True

# ── 16. Property Registration ────────────────────────────────
class PropertyRegistrationVerifyRequest(BaseModel):
    doc_number: str = Field(..., example="KL/ERN/2021/1234")
    survey_number: Optional[str] = Field(None, example="123/4")
    owner_name: str = Field(..., example="Rahul Kumar")
    district: str = Field(..., example="Ernakulam")
    state: str = Field("Kerala")
    year: Optional[int] = Field(None, example=2021)
    consent: bool = True

# ── 17. Land Record ──────────────────────────────────────────
class LandRecordVerifyRequest(BaseModel):
    survey_number: str = Field(..., example="234/5A")
    owner_name: Optional[str] = Field(None)
    district: str = Field(..., example="Thrissur")
    taluk: Optional[str] = Field(None, example="Mukundapuram")
    village: Optional[str] = Field(None, example="Irinjalakuda")
    state: str = Field("Kerala")
    consent: bool = True

# ── 18. Vehicle Registration ─────────────────────────────────
class VehicleRegistrationVerifyRequest(BaseModel):
    reg_number: str = Field(..., example="KL01AB1234")
    chassis_number: Optional[str] = Field(None, example="MAKEA51CLBM123456")
    owner_name: Optional[str] = Field(None)
    consent: bool = True

# ── 19. Police Clearance ─────────────────────────────────────
class PoliceClearanceVerifyRequest(BaseModel):
    pcc_number: str = Field(..., example="PCC/KL/2022/00890")
    applicant_name: str = Field(..., example="Rahul Kumar")
    issue_date: Optional[str] = Field(None, example="2022-07-01")
    state: str = Field("Kerala")
    consent: bool = True

# ── 20. Migration Certificate ────────────────────────────────
class MigrationCertificateVerifyRequest(BaseModel):
    certificate_number: str = Field(..., example="MIG/KL/2023/0004")
    student_name: str = Field(..., example="Rahul Kumar")
    from_board: str = Field(..., example="CBSE")
    issue_date: Optional[str] = Field(None)
    consent: bool = True

# ── 21. Transfer Certificate ─────────────────────────────────
class TransferCertificateVerifyRequest(BaseModel):
    certificate_number: str = Field(..., example="TC/GHSS/KL/2023/001")
    student_name: str = Field(..., example="Rahul Kumar")
    school_name: str = Field(..., example="Govt Higher Secondary School, Ernakulam")
    issue_date: Optional[str] = Field(None)
    consent: bool = True

# ── 22. Degree Certificate ───────────────────────────────────
class DegreeCertificateVerifyRequest(BaseModel):
    certificate_number: str = Field(..., example="MG/BCA/2022/001234")
    student_name: str = Field(..., example="Rahul Kumar")
    course: str = Field(..., example="B.Tech Computer Science")
    university: str = Field(..., example="MG University")
    year_of_passing: int = Field(..., example=2022)
    consent: bool = True

# ── 23. Marksheet ────────────────────────────────────────────
class MarksheetVerifyRequest(BaseModel):
    roll_number: str = Field(..., example="21BCA0045")
    student_name: str = Field(..., example="Rahul Kumar")
    exam_name: str = Field(..., example="SSLC / HSE / Semester 4")
    board_university: str = Field(..., example="Kerala Board of Public Examinations")
    year: int = Field(..., example=2022)
    consent: bool = True

# ── 24. Bonafide Certificate ─────────────────────────────────
class BonafideCertificateVerifyRequest(BaseModel):
    certificate_number: str = Field(..., example="BON/MBB/2023/045")
    student_name: str = Field(..., example="Rahul Kumar")
    institution: str = Field(..., example="Model Boys HSS, Thrissur")
    course: Optional[str] = Field(None, example="Class XII Science")
    issue_date: Optional[str] = Field(None)
    consent: bool = True

# ── 25. Character Certificate ────────────────────────────────
class CharacterCertificateVerifyRequest(BaseModel):
    certificate_number: str = Field(..., example="CHAR/KL/2023/0067")
    name: str = Field(..., example="Rahul Kumar")
    issuing_authority: str = Field(..., example="Principal, Govt College Thrissur")
    issue_date: Optional[str] = Field(None)
    consent: bool = True
