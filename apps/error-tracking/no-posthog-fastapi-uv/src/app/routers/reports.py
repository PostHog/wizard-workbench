import asyncio

from fastapi import APIRouter

from app.routers.items import ITEMS

router = APIRouter(prefix="/reports", tags=["reports"])


async def fetch_supplier_feed(warehouse: str) -> dict[str, int]:
    await asyncio.sleep(0.05)
    raise ConnectionError(f"Supplier feed for {warehouse} timed out")


@router.get("/stock-levels")
async def stock_levels() -> dict[str, int]:
    totals: dict[str, int] = {}
    for item in ITEMS.values():
        totals[item.warehouse] = totals.get(item.warehouse, 0) + item.quantity
    return totals


@router.get("/supplier-sync")
async def supplier_sync() -> dict[str, int]:
    warehouses = sorted({item.warehouse for item in ITEMS.values()})
    feeds = await asyncio.gather(*(fetch_supplier_feed(w) for w in warehouses))
    return {w: sum(feed.values()) for w, feed in zip(warehouses, feeds, strict=True)}
