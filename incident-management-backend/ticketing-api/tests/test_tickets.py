from app import app


def test_get_tickets_returns_json():
    client = app.test_client()

    response = client.get("/tickets")

    assert response.status_code == 200
    assert response.content_type.startswith("application/json")
    assert isinstance(response.get_json(), list)