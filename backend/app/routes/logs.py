from typing import Optional
from fastapi import APIRouter

from backend.app.services.firestore_service import fetch_logs

router = APIRouter()


@router.get("/logs")
def get_logs(limit: int = 25, feature: Optional[str] = None):
    logs = fetch_logs(limit=limit, feature=feature)
    return {"logs": logs}