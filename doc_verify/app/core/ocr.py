import re
import io
import difflib
from typing import Dict, Any, List, Tuple, Optional

def extract_text_from_bytes(file_bytes: bytes, filename: str) -> str:
    ext = filename.lower().rsplit('.', 1)[-1] if '.' in filename else ''

    if ext in ('pdf',):
        try:
            import fitz
            doc = fitz.open(stream=file_bytes, filetype='pdf')
            text_parts = []
            for page in doc:
                text_parts.append(page.get_text())
            doc.close()
            full_text = '\n'.join(text_parts).strip()
            if full_text:
                return full_text
            doc = fitz.open(stream=file_bytes, filetype='pdf')
            import pytesseract
            from PIL import Image
            text_parts = []
            for page in doc:
                pix = page.get_pixmap(dpi=200)
                img = Image.frombytes('RGB', [pix.width, pix.height], pix.samples)
                text_parts.append(pytesseract.image_to_string(img))
            doc.close()
            return '\n'.join(text_parts).strip()
        except ImportError:
            return _ocr_image(file_bytes)

    return _ocr_image(file_bytes)

def _ocr_image(image_bytes: bytes) -> str:
    import pytesseract
    from PIL import Image
    img = Image.open(io.BytesIO(image_bytes))
    return pytesseract.image_to_string(img).strip()

def fuzzy_contains(ocr_text: str, value: str, threshold: float = 0.8) -> Tuple[bool, float]:
    if not value or not ocr_text:
        return False, 0.0
    value_clean = re.sub(r'[^a-zA-Z0-9\s]', '', value).strip().lower()
    ocr_clean = re.sub(r'[^a-zA-Z0-9\s]', '', ocr_text).strip().lower()
    if not value_clean:
        return False, 0.0
    if len(value_clean) <= 4:
        return value_clean in ocr_clean, 1.0 if value_clean in ocr_clean else 0.0
    ocr_lines = [l.strip() for l in ocr_clean.split('\n') if l.strip()]
    best_ratio = 0.0
    for line in ocr_lines:
        ratio = difflib.SequenceMatcher(None, value_clean, line).ratio()
        if ratio > best_ratio:
            best_ratio = ratio
    for window_start in range(len(ocr_clean) - len(value_clean) + 1):
        window = ocr_clean[window_start:window_start + len(value_clean)]
        ratio = difflib.SequenceMatcher(None, value_clean, window).ratio()
        if ratio > best_ratio:
            best_ratio = ratio
    return best_ratio >= threshold, best_ratio

def normalize_number(text: str) -> str:
    return re.sub(r'[\s\-]', '', text)

def compare_fields(ocr_text: str, user_fields: Dict[str, str]) -> Dict[str, Any]:
    discrepancies = []
    matched_count = 0
    total_checked = 0
    results: Dict[str, Dict[str, Any]] = {}

    skip_fields = {'consent', 'document_image', '_action'}

    for key, value in user_fields.items():
        if key in skip_fields or not value or str(value).strip() == '':
            continue
        value_str = str(value).strip()
        total_checked += 1
        is_found, confidence = fuzzy_contains(ocr_text, value_str)
        normalized_val = normalize_number(value_str)
        normalized_found = False
        if normalized_val != value_str:
            normalized_found, norm_conf = fuzzy_contains(ocr_text, normalized_val)
            if normalized_found and norm_conf > confidence:
                is_found = True
                confidence = norm_conf
        if is_found and confidence >= 0.8:
            matched_count += 1
            results[key] = {'matched': True, 'confidence': round(confidence * 100, 1), 'ocr_value': None}
        elif confidence >= 0.5:
            discrepancies.append({
                'field': key,
                'user_value': value_str,
                'confidence': round(confidence * 100, 1),
                'issue': 'partial_match',
            })
            results[key] = {'matched': False, 'confidence': round(confidence * 100, 1), 'issue': 'partial_match'}
        else:
            discrepancies.append({
                'field': key,
                'user_value': value_str,
                'confidence': round(confidence * 100, 1),
                'issue': 'not_found',
            })
            results[key] = {'matched': False, 'confidence': round(confidence * 100, 1), 'issue': 'not_found'}

    match_percentage = (matched_count / total_checked * 100) if total_checked > 0 else 100.0
    passed = len(discrepancies) == 0

    return {
        'passed': passed,
        'match_percentage': round(match_percentage, 1),
        'fields_checked': total_checked,
        'fields_matched': matched_count,
        'discrepancies': discrepancies,
        'field_results': results,
        'ocr_text_snippet': ocr_text[:500] if ocr_text else '',
    }
