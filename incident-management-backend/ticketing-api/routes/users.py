from flask import jsonify, g
from . import users_bp
from db import get_db

@users_bp.route('/users', methods=['GET'])
def get_users():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute('SELECT id, name FROM users')
    users = cursor.fetchall()
    cursor.close()
    return jsonify(users)
