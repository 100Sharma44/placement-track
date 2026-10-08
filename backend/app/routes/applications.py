from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Application
from ..schemas import ApplicationCreate, ApplicationResponse, ApplicationUpdate

router = APIRouter(prefix="/applications", tags=["Applications"])


@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(application: ApplicationCreate, db: Session = Depends(get_db)):
    new_application = Application(**application.model_dump())
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    return new_application


@router.get("", response_model=list[ApplicationResponse])
def get_applications(
    status: str | None = None,
    company: str | None = None,
    job_type: str | None = None,
    db: Session = Depends(get_db),
):
    query = select(Application)
    if status:
        query = query.where(Application.application_status == status)
    if company:
        query = query.where(Application.company_name.ilike(f"%{company}%"))
    if job_type:
        query = query.where(Application.job_type == job_type)

    query = query.order_by(Application.application_date.desc(), Application.id.desc())
    return db.scalars(query).all()


@router.get("/{application_id}", response_model=ApplicationResponse)
def get_application(application_id: int, db: Session = Depends(get_db)):
    application = db.get(Application, application_id)
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    return application


@router.put("/{application_id}", response_model=ApplicationResponse)
def update_application(
    application_id: int, application_data: ApplicationUpdate, db: Session = Depends(get_db)
):
    application = db.get(Application, application_id)
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    for field_name, value in application_data.model_dump().items():
        setattr(application, field_name, value)
    db.commit()
    db.refresh(application)
    return application


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(application_id: int, db: Session = Depends(get_db)):
    application = db.get(Application, application_id)
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    db.delete(application)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
