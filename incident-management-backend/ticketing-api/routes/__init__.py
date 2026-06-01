from flask import Blueprint

users_bp = Blueprint('users', __name__)
tickets_bp = Blueprint('tickets', __name__)
auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

from . import users
from . import tickets
