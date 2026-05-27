from flask import Blueprint

users_bp = Blueprint('users', __name__)
tickets_bp = Blueprint('tickets', __name__)

from . import users
from . import tickets
