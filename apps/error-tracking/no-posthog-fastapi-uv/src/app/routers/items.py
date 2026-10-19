from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/items", tags=["items"])


class Item(BaseModel):
    sku: str
    name: str
    quantity: int
    warehouse: str


ITEMS: dict[str, Item] = {
    "SKU-1001": Item(sku="SKU-1001", name="Steel bracket", quantity=420, warehouse="WAW-1"),
    "SKU-1002": Item(sku="SKU-1002", name="Hex bolt M8", quantity=0, warehouse="WAW-1"),
    "SKU-1003": Item(sku="SKU-1003", name="Cable tray", quantity=35, warehouse="KRK-2"),
}

REORDER_LEAD_DAYS = {"WAW-1": 3}


@router.get("")
def list_items() -> list[Item]:
    return list(ITEMS.values())


@router.get("/{sku}")
def get_item(sku: str) -> Item:
    item = ITEMS.get(sku)
    if item is None:
        raise HTTPException(status_code=404, detail=f"Item {sku} not found")
    return item


@router.get("/{sku}/reorder")
def reorder_estimate(sku: str) -> dict[str, int | str]:
    item = get_item(sku)
    lead_days = REORDER_LEAD_DAYS[item.warehouse]
    return {"sku": item.sku, "lead_days": lead_days}
