from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Comment, CommentLike, db
from datetime import datetime, timezone

comment_routes = Blueprint('comments', __name__)

#^ ---------------------------LIKE ROUTE-------------------------------------

@comment_routes.route('/<int:comment_id>/comment_likes', methods=['GET'])
def get_comment_likes(comment_id):
    """
    Retrieves the number of likes for a specific comment.
    """
    comment = Comment.query.get_or_404(comment_id)

    # Get the count of likes for the comment
    comment_likes_count = CommentLike.query.filter_by(comment_id=comment_id).count()

    return jsonify({"comment_likes": comment_likes_count}), 200


@comment_routes.route('/<int:comment_id>/like', methods=['POST'])
@login_required
def like_comment(comment_id):
    """
    Allows an authenticated user to like a comment.
    """
    comment = Comment.query.get_or_404(comment_id)

    # Check if user has already liked the comment
    existing_like = CommentLike.query.filter_by(user_id=current_user.id, comment_id=comment_id).first()
    if existing_like:
        return jsonify({"message": "You have already liked this comment"}), 400

    # Add like to comment
    like = CommentLike(user_id=current_user.id, comment_id=comment_id)
    db.session.add(like)
    db.session.commit()

    # Get updated comment likes count
    comment_likes_count = CommentLike.query.filter_by(comment_id=comment_id).count()

    return jsonify({"message": "Comment liked successfully", "comment_likes": comment_likes_count}), 200


@comment_routes.route('/<int:comment_id>/like', methods=['DELETE'])
@login_required
def unlike_comment(comment_id):
    """
    Allows an authenticated user to remove their like from a comment.
    """
    comment = Comment.query.get_or_404(comment_id)

    # Check if user has liked the comment
    existing_like = CommentLike.query.filter_by(user_id=current_user.id, comment_id=comment_id).first()
    if not existing_like:
        return jsonify({"message": "You have not liked this comment"}), 400

    # Remove like from comment
    db.session.delete(existing_like)
    db.session.commit()

    # Get updated comment likes count
    comment_likes_count = CommentLike.query.filter_by(comment_id=comment_id).count()

    return jsonify({"message": "Comment unliked successfully", "comment_likes": comment_likes_count}), 200

#^ --------------------------------------------------------------------------


@comment_routes.route('/<int:comment_id>', methods=['PUT'])
@login_required
def update_comment(comment_id):
    """
    Allows an authenticated user to update one of their comments.
    """
    comment = Comment.query.get_or_404(comment_id)

    if comment.user_id != current_user.id:
        return jsonify({"message": "Forbidden"}), 403

    data = request.get_json()
    comment.content = data.get('content', comment.content)
    comment.updated_at = datetime.now(timezone.utc)

    db.session.commit()

    return jsonify(comment.to_dict()), 200


@comment_routes.route('/<int:comment_id>', methods=['DELETE'])
@login_required
def delete_comment(comment_id):
    """
    Allows an authenticated user to delete one of their comments.
    """
    comment = Comment.query.get_or_404(comment_id)

    if comment.user_id != current_user.id:
        return jsonify({"message": "Forbidden"}), 403

    db.session.delete(comment)
    db.session.commit()

    return jsonify({"message": "Comment successfully deleted."}), 200
