from datetime import datetime, timedelta, timezone

import jwt
import mysql.connector
from flask import Blueprint, current_app, g, jsonify, request
from . import auth_bp
from werkzeug.security import check_password_hash, generate_password_hash
from db import get_db
from utils.auth_utils import get_current_user_from_token

def create_token(user):
    payload = {
        "user_id": user["id"],
        "email": user["email"],
        "role": user["role"],
        "exp": datetime.now(timezone.utc) + timedelta(hours=8),
    }

    return jwt.encode(
        payload,
        current_app.config["JWT_SECRET"],
        algorithm="HS256",
    )

def user_response(user):
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
    }

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    role = "viewer" # new users are always viewer initially

    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required"}), 400

    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    password_hash = generate_password_hash(password)

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            INSERT INTO users (name, email, password_hash, role)
            VALUES (%s, %s, %s, %s)
            """,
            (name, email, password_hash, role),
        )
        db.commit()

        user_id = cursor.lastrowid

        user = {
            "id": user_id,
            "name": name,
            "email": email,
            "role": role,
        }

        token = create_token(user)

        return jsonify({
            "token": token,
            "user": user_response(user),
        }), 201

    except mysql.connector.IntegrityError:
        return jsonify({"error": "Email already exists"}), 409

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT id, name, email, password_hash, role
        FROM users
        WHERE email = %s
        """,
        (email,),
    )

    user = cursor.fetchone()

    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_token(user)

    return jsonify({
        "token": token,
        "user": user_response(user),
    }), 200

@auth_bp.route("/me", methods=["GET"])
def me():
    user, error_response = get_current_user_from_token()

    if error_response:
        return error_response

    return jsonify({"user": user_response(user)}), 200

@auth_bp.route("/me", methods=["PATCH"])
def update_me():
    user, error_response = get_current_user_from_token()

    if error_response:
        return error_response

    data = request.get_json() or {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()

    if not name or not email:
        return jsonify({"error": "Name and email are required"}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            UPDATE users
            SET name = %s, email = %s
            WHERE id = %s
            """,
            (name, email, user["id"]),
        )
        db.commit()
    except mysql.connector.IntegrityError:
        return jsonify({"error": "Email already exists"}), 409

    updated_user = {
        "id": user["id"],
        "name": name,
        "email": email,
        "role": user["role"],
    }

    token = create_token(updated_user)

    return jsonify({
        "token": token,
        "user": user_response(updated_user),
    }), 200

@auth_bp.route("/me/password", methods=["PATCH"])
def change_password():
    user, error_response = get_current_user_from_token()

    if error_response:
        return error_response

    data = request.get_json() or {}

    current_password = data.get("current_password", "")
    new_password = data.get("new_password", "")

    if not current_password or not new_password:
        return jsonify({"error": "Current password and new password are required"}), 400

    if len(new_password) < 8:
        return jsonify({"error": "New password must be at least 8 characters"}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT password_hash
        FROM users
        WHERE id = %s
        """,
        (user["id"],),
    )

    row = cursor.fetchone()

    if not row or not check_password_hash(row["password_hash"], current_password):
        return jsonify({"error": "Current password is incorrect"}), 401

    new_password_hash = generate_password_hash(new_password)

    cursor.execute(
        """
        UPDATE users
        SET password_hash = %s
        WHERE id = %s
        """,
        (new_password_hash, user["id"]),
    )
    db.commit()

    return jsonify({"message": "Password updated successfully"}), 200

@auth_bp.route("/me", methods=["DELETE"])
def delete_me():
    user, error_response = get_current_user_from_token()

    if error_response:
        return error_response

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT COUNT(*) AS ticket_count
        FROM tickets
        WHERE incident_reporter_id = %s OR assigned_to_id = %s
        """,
        (user["id"], user["id"]),
    )

    result = cursor.fetchone()

    if result["ticket_count"] > 0:
        return jsonify({
            "error": "Account cannot be deleted because it is linked to existing tickets"
        }), 409

    cursor.execute(
        """
        DELETE FROM users
        WHERE id = %s
        """,
        (user["id"],),
    )
    db.commit()

    return jsonify({"message": "Account deleted successfully"}), 200