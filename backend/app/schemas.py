from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

# Keeping these lists in one place makes dropdown values easy to update later.
JOB_TYPES = ["Internship", "Full-Time", "Internship + PPO"]
APPLICATION_STATUSES = ["Applied", "Online Assessment", "Interview", "Offer", "Rejected"]


class ApplicationBase(BaseModel):
    company_name: str = Field(min_length=1, max_length=120)
    role: str = Field(min_length=1, max_length=120)
    job_type: str = Field(min_length=1, max_length=50)
    application_status: str = Field(min_length=1, max_length=50)
    application_date: date
    interview_date: date | None = None
    location: str | None = Field(default=None, max_length=120)
    package_lpa: float | None = Field(default=None, ge=0)
    notes: str | None = None

    @field_validator("job_type")
    @classmethod
    def validate_job_type(cls, value: str) -> str:
        if value not in JOB_TYPES:
            raise ValueError(f"job_type must be one of: {', '.join(JOB_TYPES)}")
        return value

    @field_validator("application_status")
    @classmethod
    def validate_application_status(cls, value: str) -> str:
        if value not in APPLICATION_STATUSES:
            raise ValueError(f"application_status must be one of: {', '.join(APPLICATION_STATUSES)}")
        return value


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(ApplicationBase):
    pass


class ApplicationResponse(ApplicationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AnalyticsResponse(BaseModel):
    total_applications: int
    total_online_assessments: int
    total_interviews: int
    total_offers: int
    total_rejections: int
    interview_rate: float
    offer_rate: float
    applications_by_status: dict[str, int]
