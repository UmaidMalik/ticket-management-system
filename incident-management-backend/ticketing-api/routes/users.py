from flask import Blueprint, current_app, g, jsonify, request
from . import users_bp
from db import get_db
from utils.auth_utils import require_admin

@users_bp.route('/users', methods=['GET'])
def get_users():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT id, name, email, role
        FROM users
        ORDER BY id
        """
    )
    users = cursor.fetchall()
    cursor.close()
    return jsonify(users)

@users_bp.route("/users/<int:user_id>/role", methods=["PATCH"])
def update_user_role(user_id):
    current_user, error_response = require_admin()

    if error_response:
        return error_response

    data = request.get_json() or {}
    role = data.get("role", "").strip().lower()

    allowed_roles = {"admin", "editor", "viewer"}

    if role not in allowed_roles:
        return jsonify({"error": "Invalid role"}), 400

    # prevent admin from demoting themselves
    if current_user["id"] == user_id and role != "admin":
        return jsonify({"error": "You cannot remove your own admin role"}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        UPDATE users
        SET role = %s
        WHERE id = %s
        """,
        (role, user_id),
    )

    db.commit()

    if cursor.rowcount == 0:
        return jsonify({"error": "User not found"}), 404

    cursor.execute(
        """
        SELECT id, name, email, role
        FROM users
        WHERE id = %s
        """,
        (user_id,),
    )

    updated_user = cursor.fetchone()

    return jsonify({"user": updated_user}), 200