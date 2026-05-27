import os
from flask import Flask, g, jsonify, Response, request
from flask_cors import CORS
from db import get_db, close_db
from routes import users_bp, tickets_bp
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
import time

app = Flask(__name__)
CORS(app)

REQUEST_COUNT = Counter(
    "flask_http_requests_total",
    "Total HTTP requests",
    ["method", "endpoint", "status"]
)

REQUEST_LATENCY = Histogram(
    "flask_http_request_duration_seconds",
    "HTTP request latency in seconds",
    ["method", "endpoint"]
)

app.config["MYSQL_HOST"] = os.getenv("MYSQL_HOST", "localhost")
app.config["MYSQL_USER"] = os.getenv("MYSQL_USER", "ticket_user")
app.config["MYSQL_PASSWORD"] = os.getenv("MYSQL_PASSWORD", "ticket_password")
app.config["MYSQL_DB"] = os.getenv("MYSQL_DB", "ticketing_system")
app.config["MYSQL_PORT"] = int(os.getenv("MYSQL_PORT", "3306"))

@app.before_request
def before_request():
    g.config = app.config
    g.start_time = time.time()

@app.teardown_appcontext
def teardown_db(exception=None):
    close_db(exception)

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

@app.after_request
def after_request(response):
    endpoint = request.path
    method = request.method
    status = response.status_code

    REQUEST_COUNT.labels(
        method=method,
        endpoint=endpoint,
        status=status
    ).inc()

    if hasattr(g, "start_time"):
        REQUEST_LATENCY.labels(
            method=method,
            endpoint=endpoint
        ).observe(time.time() - g.start_time)

    return response

app.register_blueprint(users_bp)
app.register_blueprint(tickets_bp)

@app.route("/metrics")
def metrics():
    return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST)

@app.route("/test-error")
def test_error():
    raise Exception("Intentional test error for Grafana alert demo")

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True, port=5000)
