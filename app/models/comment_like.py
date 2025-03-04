from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class CommentLike(db.Model):
    __tablename__ = 'comment_likes'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    comment_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('comments.id'), ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = db.relationship('User', back_populates='comment_likes')
    comment = db.relationship('Comment', back_populates='comment_likes')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'comment_id': self.comment_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }
