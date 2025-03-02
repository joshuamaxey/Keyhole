from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, db
# from app.forms import update_bio_form
from app.forms.update_bio_form import UpdateBioForm

user_routes = Blueprint('users', __name__)

@user_routes.route('')
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}

@user_routes.route('/<int:id>')
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()

@user_routes.route('/profile', methods=['PUT'])
@login_required
def update_profile():
    """
    Updates the bio of the current user.
    """
    form = UpdateBioForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        current_user.bio = form.data['bio']
        db.session.commit()
        return jsonify({"user": current_user.to_dict()}), 200
    return jsonify({"message": "Bad Request", "errors": form.errors}), 400
