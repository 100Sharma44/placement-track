from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routes import analytics, applications

Base.metadata.create_all(bind=engine)

app = FastAPI(title="PlacementTrack API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    # Vite may be opened as either localhost or 127.0.0.1 during local development.
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(applications.router)
app.include_router(analytics.router)


@app.get("/")
def health_check():
    return {"message": "PlacementTrack API is running"}
