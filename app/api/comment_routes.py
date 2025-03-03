from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Post, Comment, db
from datetime import datetime, timezone

comment_routes = Blueprint('comments', __name__)

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
