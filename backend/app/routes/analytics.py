from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Application
from ..schemas import APPLICATION_STATUSES, AnalyticsResponse

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("", response_model=AnalyticsResponse)
def get_analytics(db: Session = Depends(get_db)):
    """Count applications by status, then derive simple percentage metrics."""
    rows = db.execute(
        select(Application.application_status, func.count(Application.id)).group_by(Application.application_status)
    ).all()
    counts = {application_status: total for application_status, total in rows}
    applications_by_status = {status: counts.get(status, 0) for status in APPLICATION_STATUSES}

    total = sum(applications_by_status.values())
    interviews = applications_by_status["Interview"]
    offers = applications_by_status["Offer"]

    return AnalyticsResponse(
        total_applications=total,
        total_online_assessments=applications_by_status["Online Assessment"],
        total_interviews=interviews,
        total_offers=offers,
        total_rejections=applications_by_status["Rejected"],
        interview_rate=round((interviews / total) * 100, 1) if total else 0,
        offer_rate=round((offers / total) * 100, 1) if total else 0,
        applications_by_status=applications_by_status,
    )
