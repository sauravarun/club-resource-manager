import logging
import time

from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("resourcehub")


class TimerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        start = time.perf_counter()

        try:
            response = await call_next(request)
        except Exception:
            logger.exception("Unhandled error on %s %s", request.method, request.url.path)
            response = JSONResponse(
                status_code=500,
                content={"detail": "Something went wrong on the server"},
            )

        ms = (time.perf_counter() - start) * 1000
        response.headers["X-Process-Time"] = f"{ms:.1f}ms"
        logger.info("%s %s -> %s (%.1f ms)", request.method, request.url.path, response.status_code, ms)
        return response