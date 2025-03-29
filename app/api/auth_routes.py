import os
from flask import Blueprint, request, make_response, jsonify
from app.models import User, db
from app.forms import LoginForm, SignUpForm
from flask_login import current_user, login_user, logout_user, login_required
from flask_wtf.csrf import generate_csrf


auth_routes = Blueprint('auth', __name__)

@auth_routes.route('/csrf/restore', methods=["GET"])
def restore_csrf():
    csrf_token = generate_csrf()  # Generate a new CSRF Token
    response = make_response(jsonify({"XSRF-TOKEN": csrf_token}))
    response.set_cookie(
        "XSRF-TOKEN",
        csrf_token,
        samesite="Strict" if os.environ.get("FLASK_ENV") == "production" else None,
        secure=True if os.environ.get("FLASK_ENV") == "production" else False,  # Use `Secure` in production
        httponly=False  # Ensure the frontend can access this cookie
    )
    return response



@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': {'message': 'Unauthorized'}}, 401


@auth_routes.route('/csrf_token', methods=['GET'])
def get_csrf_token():
    """
    Returns a CSRF token
    """
    return {'csrf_token': request.cookies['csrf_token']}


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        user = User.query.filter(User.username == form.data['username']).first()
        login_user(user)
        user_info = user.to_dict()
        print(f"User Info: {user_info}")  # Debug statement
        return user_info
    print(f"Form Errors: {form.errors}")  # Debug statement
    return form.errors, 401



@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        # Create a new user if form validation passes
        user = User(
            username=form.data['username'],
            password=form.data['password'],  # Only the password is stored
            bio=form.data['bio']
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return user.to_dict()

    # If validation fails, return the form errors as JSON
    return jsonify(form.errors), 401



@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': {'message': 'Unauthorized'}}, 401


@auth_routes.route('/current_user', methods=['GET'])
@login_required
def current_user_info():
    """
    Returns the current logged-in user's information
    """
    return current_user.to_dict()
