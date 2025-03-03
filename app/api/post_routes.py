from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Post, db
from app.forms.create_post_form import CreatePostForm

post_routes = Blueprint('posts', __name__)

@post_routes.route('', methods=['GET'])
def get_all_posts():
    """
    Retrieves a list of all posts
    """
    posts = Post.query.all()
    return jsonify({'posts': [post.to_dict() for post in posts]}), 200


@post_routes.route('', methods=['POST'])
@login_required
def create_post():
    """
    Creates a new post, with or without a community ID
    """
    form = CreatePostForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        community_id = form.data.get('community_id')  # Optional field
        post = Post(
            content=form.data['content'],
            user_id=current_user.id,
            community_id=community_id  # Include community_id if provided
        )
        db.session.add(post)
        db.session.commit()
        return jsonify(post.to_dict()), 201
    return jsonify({"message": "Bad Request", "errors": form.errors}), 400

@post_routes.route('/<int:id>', methods=['GET'])
def get_post_by_id(id):
    """
    Retrieves a specific post by ID
    """
    post = Post.query.get(id)
    if not post:
        return jsonify({"message": "Post not found"}), 404
    return jsonify(post.to_dict()), 200

