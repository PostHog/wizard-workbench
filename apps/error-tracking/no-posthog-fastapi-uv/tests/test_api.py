from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app, raise_server_exceptions=False)


def test_healthz() -> None:
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_get_item() -> None:
    response = client.get("/items/SKU-1001")
    assert response.status_code == 200
    assert response.json()["name"] == "Steel bracket"


def test_missing_item_returns_404() -> None:
    response = client.get("/items/SKU-9999")
    assert response.status_code == 404


def test_stock_levels() -> None:
    response = client.get("/reports/stock-levels")
    assert response.status_code == 200
    assert response.json() == {"WAW-1": 420, "KRK-2": 35}
