from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Follow, db
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
def get_user_by_id(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify(user.to_dict()), 200


#& -----------------------------Follow Routes-------------------------------------

@user_routes.route('/<int:user_id>/following', methods=['GET'])
def get_following(user_id):
    """
    Retrieves a list of users that a given user is following.
    """
    user = User.query.get_or_404(user_id)

    following = User.query.join(Follow, Follow.followed_id == User.id).filter(Follow.follower_id == user.id).all()
    following_list = [{"id": followed_user.id, "username": followed_user.username} for followed_user in following]

    return jsonify({"user_id": user.id, "following": following_list}), 200


@user_routes.route('/<int:user_id>/followers', methods=['GET'])
def get_followers(user_id):
    """
    Retrieves a list of users who are following a given user.
    """
    user = User.query.get_or_404(user_id)

    followers = User.query.join(Follow, Follow.follower_id == User.id).filter(Follow.followed_id == user.id).all()
    followers_list = [{"id": follower.id, "username": follower.username} for follower in followers]

    return jsonify({"user_id": user.id, "followers": followers_list}), 200


@user_routes.route('/<int:user_id>/follow', methods=['POST'])
@login_required
def follow_user(user_id):
    """
    Allows an authenticated user to follow another user.
    """
    if user_id == current_user.id:
        return jsonify({"message": "You cannot follow yourself"}), 400

    user_to_follow = User.query.get_or_404(user_id)

    # Check if the current user is already following the user
    existing_follow = Follow.query.filter_by(follower_id=current_user.id, followed_id=user_id).first()
    if existing_follow:
        return jsonify({"message": "You are already following this user"}), 400

    # Create a new follow relationship
    follow = Follow(follower_id=current_user.id, followed_id=user_id)
    db.session.add(follow)
    db.session.commit()

    return jsonify({"message": "Successfully followed user", "following": {"id": user_to_follow.id, "username": user_to_follow.username}}), 200


#& -------------------------------------------------------------------------------


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


#& -----------------------------Follow Route--------------------------------------

@user_routes.route('/<int:user_id>/unfollow', methods=['DELETE'])
@login_required
def unfollow_user(user_id):
    """
    Allows an authenticated user to unfollow another user.
    """
    user_to_unfollow = User.query.get_or_404(user_id)

    # Check if the current user is following the user
    existing_follow = Follow.query.filter_by(follower_id=current_user.id, followed_id=user_id).first()
    if not existing_follow:
        return jsonify({"message": "You are not following this user"}), 400

    # Remove follow relationship
    db.session.delete(existing_follow)
    db.session.commit()

    return jsonify({"message": "Successfully unfollowed user"}), 200


#& -------------------------------------------------------------------------------


@user_routes.route('/exists')
def username_exists():
    """
    Check if a username exists
    """
    username = request.args.get('username')
    exists = User.query.filter_by(username=username).first() is not None
    return jsonify({"exists": exists})
