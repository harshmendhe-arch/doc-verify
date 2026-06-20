import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Document Verification API"
    API_KEY: str = os.getenv("API_KEY", "test-api-key-change-in-prod")
    APISETU_BASE_URL: str = os.getenv("APISETU_BASE_URL", "https://apisetu.gov.in")
    APISETU_CLIENT_ID: str = os.getenv("APISETU_CLIENT_ID", "")
    APISETU_CLIENT_SECRET: str = os.getenv("APISETU_CLIENT_SECRET", "")
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

    class Config:
        # Load backend's own .env; ignore VITE_* and any other frontend vars
        env_file = ".env"
        extra = "ignore"

settings = Settings()
