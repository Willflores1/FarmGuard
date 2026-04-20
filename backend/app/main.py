from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.routes.soil import router as soil_router
from backend.app.routes.crop import router as crop_router
from backend.app.routes.cow import router as cow_router
from backend.app.routes.logs import router as logs_router

app = FastAPI(title="FarmGuard Unified API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(soil_router)
app.include_router(crop_router)
app.include_router(cow_router)
app.include_router(logs_router)


@app.get("/health")
def health():
    return {"ok": True}