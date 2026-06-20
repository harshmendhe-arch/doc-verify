from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import (
    aadhaar, pan, passport, driving_license, voter_id,
    ration_card, birth_certificate, death_certificate,
    caste_certificate, income_certificate, domicile_certificate,
    ncl_certificate, ews_certificate, disability_certificate,
    marriage_certificate, property_registration, land_record,
    vehicle_registration, police_clearance, migration_certificate,
    transfer_certificate, degree_certificate, marksheet,
    bonafide_certificate, character_certificate
)

app = FastAPI(
    title="Document Verification API",
    description="Verify Indian government documents via API Setu / eDistrict Kerala style endpoints",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

routers = [
    aadhaar.router, pan.router, passport.router, driving_license.router,
    voter_id.router, ration_card.router, birth_certificate.router,
    death_certificate.router, caste_certificate.router,
    income_certificate.router, domicile_certificate.router,
    ncl_certificate.router, ews_certificate.router,
    disability_certificate.router, marriage_certificate.router,
    property_registration.router, land_record.router,
    vehicle_registration.router, police_clearance.router,
    migration_certificate.router, transfer_certificate.router,
    degree_certificate.router, marksheet.router,
    bonafide_certificate.router, character_certificate.router
]

for router in routers:
    app.include_router(router)

@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "service": "Document Verification API", "version": "1.0.0"}

@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
