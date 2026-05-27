import mysql.connector
from flask import g

def get_db():
    if 'db' not in g:
        g.db = mysql.connector.connect(
            host=g.config['MYSQL_HOST'],
            port=g.config.get('MYSQL_PORT', 3306),
            user=g.config['MYSQL_USER'],
            password=g.config['MYSQL_PASSWORD'],
            database=g.config['MYSQL_DB']
        )
    return g.db

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()
