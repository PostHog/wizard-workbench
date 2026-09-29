from app import app


def test_index():
    response = app.test_client().get("/")
    assert response.status_code == 200
    assert response.get_json() == {"status": "ok"}


def test_order():
    response = app.test_client().get("/orders/7")
    assert response.get_json()["status"] == "shipped"
