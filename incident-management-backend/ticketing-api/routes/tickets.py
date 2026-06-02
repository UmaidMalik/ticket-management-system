from flask import jsonify, request, g
from . import tickets_bp
from db import get_db
from datetime import datetime
from utils.auth_utils import get_current_user_from_token, require_roles

@tickets_bp.route('/tickets', methods=['GET'])
def get_tickets():
    current_user, error_response = get_current_user_from_token()
    if error_response:
        return error_response
    db = get_db()
    cursor = db.cursor(dictionary=True)

    status = request.args.get('status')
    priority = request.args.get('priority')

    query = '''
        SELECT t.*,
               ur.name as reporter_name,
               ua.name as assignee_name
        FROM tickets t
        LEFT JOIN users ur ON t.incident_reporter_id = ur.id
        LEFT JOIN users ua ON t.assigned_to_id = ua.id
        WHERE 1=1
    '''
    params = []

    if status:
        query += ' AND t.status = %s'
        params.append(status)
    if priority:
        query += ' AND t.priority = %s'
        params.append(priority)

    cursor.execute(query, params)
    tickets = cursor.fetchall()
    cursor.close()
    return jsonify(tickets)

@tickets_bp.route('/tickets/<int:ticket_id>', methods=['GET'])
def get_ticket(ticket_id):
    current_user, error_response = get_current_user_from_token()
    if error_response:
        return error_response    
    db = get_db()
    cursor = db.cursor(dictionary=True)

    query = '''
        SELECT t.*,
               ur.name as reporter_name,
               ua.name as assignee_name
        FROM tickets t
        LEFT JOIN users ur ON t.incident_reporter_id = ur.id
        LEFT JOIN users ua ON t.assigned_to_id = ua.id
        WHERE t.id = %s
    '''
    cursor.execute(query, (ticket_id,))
    ticket = cursor.fetchone()
    cursor.close()

    if not ticket:
        return jsonify({'error': 'Ticket not found'}), 404
    return jsonify(ticket)

@tickets_bp.route('/tickets', methods=['POST'])
def create_ticket():
    current_user, error_response = require_roles("admin", "editor")
    if error_response:
        return error_response
    data = request.json
    if not data or not all(k in data for k in ['title', 'description', 'category', 'impact', 'priority', 'incident_reporter_id']):
        return jsonify({'error': 'Missing required fields'}), 400

    db = get_db()
    cursor = db.cursor()

    query = '''
        INSERT INTO tickets (title, description, category, impact, priority, status, incident_reporter_id, assigned_to_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    '''
    cursor.execute(query, (
        data['title'],
        data['description'],
        data['category'],
        data['impact'],
        data['priority'],
        data.get('status', 'Open'),
        data['incident_reporter_id'],
        data.get('assigned_to_id')
    ))
    db.commit()
    ticket_id = cursor.lastrowid
    cursor.close()

    return jsonify({'id': ticket_id, 'message': 'Ticket created'}), 201

@tickets_bp.route('/tickets/<int:ticket_id>', methods=['PUT', 'PATCH'])
def update_ticket(ticket_id):
    current_user, error_response = require_roles("admin", "editor")
    if error_response:
        return error_response    
    data = request.json
    db = get_db()
    cursor = db.cursor()

    resolved_at = None
    if data.get('status') in ['Resolved', 'Closed']:
        resolved_at = datetime.utcnow()

    query = '''
        UPDATE tickets
        SET title = %s,
            description = %s,
            category = %s,
            impact = %s,
            priority = %s,
            status = %s,
            incident_reporter_id = %s,
            assigned_to_id = %s,
            resolved_at = %s
        WHERE id = %s
    '''
    cursor.execute(query, (
        data['title'],
        data['description'],
        data['category'],
        data['impact'],
        data['priority'],
        data['status'],
        data['incident_reporter_id'],
        data.get('assigned_to_id'),
        resolved_at,
        ticket_id
    ))
    db.commit()
    cursor.close()

    return jsonify({'message': 'Ticket updated'})

@tickets_bp.route('/tickets/<int:ticket_id>/assign', methods=['PATCH'])
def assign_ticket(ticket_id):
    current_user, error_response = require_roles("admin", "editor")
    if error_response:
        return error_response 
    data = request.json
    db = get_db()
    cursor = db.cursor()

    query = 'UPDATE tickets SET assigned_to_id = %s WHERE id = %s'
    cursor.execute(query, (data.get('assigned_to_id'), ticket_id))
    db.commit()
    cursor.close()

    return jsonify({'message': 'Ticket assigned'})

@tickets_bp.route('/tickets/<int:ticket_id>', methods=['DELETE'])
def delete_ticket(ticket_id):
    current_user, error_response = require_roles("admin")
    if error_response:
        return error_response 
    db = get_db()
    cursor = db.cursor()

    query = 'DELETE FROM tickets WHERE id = %s'
    cursor.execute(query, (ticket_id,))
    db.commit()
    cursor.close()

    return jsonify({'message': 'Ticket deleted'})
