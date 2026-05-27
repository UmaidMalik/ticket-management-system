from app import app


def test_not_found_returns_404():
    client = app.test_client()

    response = client.get("/does-not-exist")

    assert response.status_code == 404
    assert response.get_json() == {"error": "Not found"}

from app import app


def test_metrics_endpoint_returns_prometheus_data():
    client = app.test_client()

    response = client.get("/metrics")

    assert response.status_code == 200
    assert b"flask_http_requests_total" in response.data or b"python_info" in response.data