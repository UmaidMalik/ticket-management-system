from flask import Blueprint, current_app, g, jsonify, request
from . import users_bp
from db import get_db
from utils.auth_utils import require_admin

@users_bp.route('/users', methods=['GET'])
def get_users():
    """
    Get all users.
    ---
    tags:
      - Users
    security:
      - Bearer: []
    responses:
      200:
        description: List of users
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
              name:
                type: string
              email:
                type: string
              role:
                type: string
                enum: [admin, editor, viewer]
      401:
        description: Missing, invalid, or expired token
    """
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
    """
    Update a user's role.
    ---
    tags:
      - Users
    security:
      - Bearer: []
    parameters:
      - in: path
        name: user_id
        required: true
        type: integer
        description: ID of the user to update
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - role
          properties:
            role:
              type: string
              enum: [admin, editor, viewer]
              example: editor
    responses:
      200:
        description: User role updated successfully
      400:
        description: Invalid role or attempted self-demotion
      401:
        description: Missing, invalid, or expired token
      403:
        description: Admin access required
      404:
        description: User not found
    """
    current_user, error_response = require_admin()

    if error_response:
        return error_response

    data = request.get_json(silent=True) or {}
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