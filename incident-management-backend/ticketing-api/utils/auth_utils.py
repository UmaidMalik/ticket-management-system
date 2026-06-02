from flask import Blueprint, current_app, g, jsonify, request
import jwt
import mysql.connector
from db import get_db

def get_current_user_from_token():
    auth_header = request.headers.get("Authorization", "")

    if not auth_header.startswith("Bearer "):
        return None, (jsonify({"error": "Missing or invalid authorization header"}), 401)

    token = auth_header.replace("Bearer ", "", 1)

    try:
        payload = jwt.decode(
            token,
            current_app.config["JWT_SECRET"],
            algorithms=["HS256"],
        )
    except jwt.ExpiredSignatureError:
        return None, (jsonify({"error": "Token has expired"}), 401)
    except jwt.InvalidTokenError:
        return None, (jsonify({"error": "Invalid token"}), 401)

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT id, name, email, role
        FROM users
        WHERE id = %s
        """,
        (payload["user_id"],),
    )

    user = cursor.fetchone()

    if not user:
        return None, (jsonify({"error": "User not found"}), 404)

    return user, None

def require_admin():
    user, error_response = get_current_user_from_token()

    if error_response:
        return None, error_response

    if user["role"] != "admin":
        return None, (jsonify({"error": "Admin access required"}), 403)

    return user, None

def require_roles(*allowed_roles):
    user, error_response = get_current_user_from_token()

    if error_response:
        return None, error_response

    if user["role"] not in allowed_roles:
        return None, (jsonify({"error": "Insufficient permissions"}), 403)

    return user, None