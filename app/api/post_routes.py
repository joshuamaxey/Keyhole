from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Post, Comment, db
from app.forms.create_post_form import CreatePostForm
from datetime import datetime, timezone

post_routes = Blueprint('posts', __name__)

@post_routes.route('', methods=['GET'])
def get_all_posts():
    """
    Retrieves a list of all posts
    """
    posts = Post.query.all()
    return jsonify({'posts': [post.to_dict() for post in posts]}), 200


@post_routes.route('/<int:id>', methods=['GET'])
def get_post_by_id(id):
    """
    Retrieves a specific post by ID
    """
    post = Post.query.get(id)
    if not post:
        return jsonify({"message": "Post not found"}), 404
    return jsonify(post.to_dict()), 200


@post_routes.route('/community/<int:community_id>', methods=['GET'])
def get_posts_by_community_id(community_id):
    """
    Retrieves posts for a specific community.
    """
    posts = Post.query.filter_by(community_id=community_id).all()
    return jsonify({"posts": [post.to_dict() for post in posts]}), 200


#! ---------------------------COMMENT ROUTE----------------------------------

@post_routes.route('/<int:post_id>/comments', methods=['GET'])
def get_comments_for_post(post_id):
    """
    Retrieves all comments associated with a specific post.
    """
    comments = Comment.query.filter_by(post_id=post_id).all()
    return jsonify({"comments": [comment.to_dict() for comment in comments]}), 200

#! --------------------------------------------------------------------------


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


#! ---------------------------COMMENT ROUTE----------------------------------

@post_routes.route('/<int:post_id>/comments', methods=['POST'])
@login_required
def create_comment(post_id):
    """
    Allows an authenticated user to create a comment on a specific post.
    """
    data = request.get_json()

    comment = Comment(
        user_id=current_user.id,
        post_id=post_id,
        content=data['content'],
    )

    db.session.add(comment)
    db.session.commit()

    return jsonify(comment.to_dict()), 201

#! --------------------------------------------------------------------------


@post_routes.route('/<int:post_id>', methods=['PUT'])
@login_required
def update_post(post_id):
    """
    Updates an existing post.
    """
    post = Post.query.get_or_404(post_id)

    if post.user_id != current_user.id:
        return jsonify({"message": "Forbidden"}), 403

    data = request.get_json()
    post.content = data.get('content', post.content)
    post.updated_at = datetime.now(timezone.utc)

    db.session.commit()

    return jsonify(post.to_dict()), 200


@post_routes.route('/<int:post_id>', methods=['DELETE'])
@login_required
def delete_post(post_id):
    """
    Deletes a post.
    """
    post = Post.query.get_or_404(post_id)

    if post.user_id != current_user.id:
        return jsonify({"message": "Forbidden"}), 403

    db.session.delete(post)
    db.session.commit()

    return '', 204
