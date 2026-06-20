import re

def validate_aadhaar(aadhaar_number: str) -> bool:
    """12-digit Aadhaar, not starting with 0 or 1"""
    return bool(re.match(r'^[2-9][0-9]{11}$', aadhaar_number))

def validate_pan(pan: str) -> bool:
    """PAN: AAAAA9999A format"""
    return bool(re.match(r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$', pan.upper()))

def validate_passport(passport_no: str) -> bool:
    """Indian passport: 1 letter + 7 digits"""
    return bool(re.match(r'^[A-Z][0-9]{7}$', passport_no.upper()))

def validate_driving_license(dl_no: str) -> bool:
    """DL: State code (2 alpha) + RTO (2 digits) + year (4) + seq (7)"""
    return bool(re.match(r'^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$', dl_no.upper()))

def validate_voter_id(epic: str) -> bool:
    """EPIC: 3 alpha + 7 digits"""
    return bool(re.match(r'^[A-Z]{3}[0-9]{7}$', epic.upper()))

def validate_ration_card(rc_no: str) -> bool:
    """6–14 alphanumeric"""
    return bool(re.match(r'^[A-Z0-9]{6,14}$', rc_no.upper()))

def validate_certificate_number(cert_no: str) -> bool:
    """Generic cert: 4–20 alphanumeric"""
    return bool(re.match(r'^[A-Z0-9\-\/]{4,20}$', cert_no.upper()))

def validate_vehicle_reg(reg: str) -> bool:
    """Vehicle reg: KA01AB1234 style"""
    return bool(re.match(r'^[A-Z]{2}[0-9]{2}[A-Z]{1,3}[0-9]{4}$', reg.upper().replace(' ', '')))
