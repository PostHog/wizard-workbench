from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Inventory API")


class Item(BaseModel):
    sku: str
    name: str
    quantity: int


ITEMS: dict[str, Item] = {
    "CER-001": Item(sku="CER-001", name="Speckled mug", quantity=40),
    "CER-002": Item(sku="CER-002", name="Serving bowl", quantity=12),
}


@app.get("/items")
def list_items() -> list[Item]:
    return list(ITEMS.values())


@app.get("/items/{sku}")
def get_item(sku: str) -> Item:
    item = ITEMS.get(sku)
    if item is None:
        raise HTTPException(status_code=404, detail="Unknown SKU")
    return item


@app.post("/items/{sku}/adjust")
def adjust_stock(sku: str, delta: int) -> Item:
    item = ITEMS.get(sku)
    if item is None:
        raise HTTPException(status_code=404, detail="Unknown SKU")
    item.quantity = max(0, item.quantity + delta)
    return item
