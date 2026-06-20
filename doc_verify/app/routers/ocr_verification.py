import uuid
import logging
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form, status
from app.core.auth import verify_api_key
from app.core.response import BaseVerifyResponse, VerificationStatus
from app.core.ocr import extract_text_from_bytes, compare_fields

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/v1/verify", tags=["OCR Verification"])

MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'pdf', 'tiff', 'tif'}

@router.post("/with-ocr", response_model=BaseVerifyResponse, summary="Verify document with OCR cross-check")
async def verify_with_ocr(
    file: UploadFile = File(...),
    doc_type: str = Form(...),
    api_key: str = Depends(verify_api_key),
    consent: bool = Form(True),
    aadhaar_number: str = Form(""),
    name: str = Form(""),
    dob: str = Form(""),
    gender: str = Form(""),
    pan_number: str = Form(""),
    passport_number: str = Form(""),
    epic_number: str = Form(""),
    dl_number: str = Form(""),
    certificate_number: str = Form(""),
    student_name: str = Form(""),
    course: str = Form(""),
    university: str = Form(""),
    year_of_passing: str = Form(""),
    roll_number: str = Form(""),
    exam_name: str = Form(""),
    board_university: str = Form(""),
    year: str = Form(""),
    school_name: str = Form(""),
    institution: str = Form(""),
    issuing_authority: str = Form(""),
    applicant_name: str = Form(""),
    deceased_name: str = Form(""),
    husband_name: str = Form(""),
    wife_name: str = Form(""),
    dom: str = Form(""),
    dod: str = Form(""),
    district: str = Form(""),
    state: str = Form(""),
    caste: str = Form(""),
    disability_type: str = Form(""),
    percentage: str = Form(""),
    annual_income: str = Form(""),
    pcc_number: str = Form(""),
    ration_card_number: str = Form(""),
    reg_number: str = Form(""),
    owner_name: str = Form(""),
    chassis_number: str = Form(""),
    doc_number: str = Form(""),
    survey_number: str = Form(""),
    taluk: str = Form(""),
    village: str = Form(""),
    from_board: str = Form(""),
    doi: str = Form(""),
    doe: str = Form(""),
    issue_date: str = Form(""),
    doi_issue_date: str = Form(""),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    ext = file.filename.lower().rsplit('.', 1)[-1] if '.' in file.filename else ''
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
        )

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail=f"File too large. Max {MAX_FILE_SIZE // (1024*1024)}MB")

    user_fields: Dict[str, str] = {}
    all_form_fields = {
        'aadhaar_number': aadhaar_number, 'name': name, 'dob': dob, 'gender': gender,
        'pan_number': pan_number, 'passport_number': passport_number,
        'epic_number': epic_number, 'dl_number': dl_number,
        'certificate_number': certificate_number, 'student_name': student_name,
        'course': course, 'university': university, 'year_of_passing': year_of_passing,
        'roll_number': roll_number, 'exam_name': exam_name,
        'board_university': board_university, 'year': year,
        'school_name': school_name, 'institution': institution,
        'issuing_authority': issuing_authority, 'applicant_name': applicant_name,
        'deceased_name': deceased_name, 'husband_name': husband_name,
        'wife_name': wife_name, 'dom': dom, 'dod': dod,
        'district': district, 'state': state, 'caste': caste,
        'disability_type': disability_type, 'percentage': percentage,
        'annual_income': annual_income, 'pcc_number': pcc_number,
        'ration_card_number': ration_card_number, 'reg_number': reg_number,
        'owner_name': owner_name, 'chassis_number': chassis_number,
        'doc_number': doc_number, 'survey_number': survey_number,
        'taluk': taluk, 'village': village, 'from_board': from_board,
        'doi': doi, 'doe': doe, 'issue_date': issue_date,
        'doi_issue_date': doi_issue_date,
    }
    for k, v in all_form_fields.items():
        if v and v.strip():
            user_fields[k] = v.strip()

    try:
        ocr_text = extract_text_from_bytes(contents, file.filename)
    except ImportError as e:
        return BaseVerifyResponse(
            status=VerificationStatus.FAILURE,
            message=f"OCR service unavailable: missing dependency ({e.name if hasattr(e, 'name') else str(e)}). Install pytesseract, Pillow, and PyMuPDF.",
            document_type=doc_type,
            txn_id=str(uuid.uuid4()),
            data={'note': 'OCR dependencies not installed on server'}
        )
    except Exception as e:
        logger.exception("OCR processing failed")
        return BaseVerifyResponse(
            status=VerificationStatus.FAILURE,
            message=f"OCR processing failed: {str(e)}",
            document_type=doc_type,
            txn_id=str(uuid.uuid4()),
            data={'ocr_error': str(e)}
        )

    if not ocr_text:
        return BaseVerifyResponse(
            status=VerificationStatus.FAILURE,
            message="No text could be extracted from the document. The image may be too blurry, low quality, or the document format is unsupported.",
            document_type=doc_type,
            txn_id=str(uuid.uuid4()),
            data={'extracted_text': ''}
        )

    comparison = compare_fields(ocr_text, user_fields)

    if comparison['passed']:
        return BaseVerifyResponse(
            status=VerificationStatus.SUCCESS,
            message=f"Document verified. All {comparison['fields_checked']} field(s) match the uploaded document.",
            document_type=doc_type,
            txn_id=str(uuid.uuid4()),
            data={
                'verified': True,
                'ocr_confidence': comparison['match_percentage'],
                'fields_matched': comparison['fields_matched'],
                'fields_checked': comparison['fields_checked'],
                'field_results': comparison['field_results'],
                'extracted_text_preview': comparison['ocr_text_snippet'][:300],
            }
        )
    else:
        discrepancy_details = []
        for d in comparison['discrepancies']:
            if d['issue'] == 'not_found':
                discrepancy_details.append(
                    f"'{d['field']}' value '{d['user_value']}' was not found in the uploaded document"
                )
            else:
                discrepancy_details.append(
                    f"'{d['field']}' value '{d['user_value']}' only partially matches the document (confidence: {d['confidence']}%)"
                )

        message = (
            f"Document data mismatch: {len(comparison['discrepancies'])} field(s) don't match the uploaded document. "
            + '; '.join(discrepancy_details)
        )

        return BaseVerifyResponse(
            status=VerificationStatus.FAILURE,
            message=message,
            document_type=doc_type,
            txn_id=str(uuid.uuid4()),
            data={
                'verified': False,
                'ocr_confidence': comparison['match_percentage'],
                'fields_matched': comparison['fields_matched'],
                'fields_checked': comparison['fields_checked'],
                'discrepancies': comparison['discrepancies'],
                'field_results': comparison['field_results'],
                'extracted_text_preview': comparison['ocr_text_snippet'][:300],
            }
        )
