import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.routers import health, items, reports

logger = logging.getLogger("app")

app = FastAPI(title="Inventory API", version="0.1.0")

app.include_router(health.router)
app.include_router(items.router)
app.include_router(reports.router)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error("Unhandled error on %s %s", request.method, request.url.path, exc_info=exc)
    return JSONResponse(
        status_code=500,
        content={"error": "internal_error", "detail": "Something went wrong"},
    )
