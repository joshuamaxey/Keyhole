from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class CommunityMember(db.Model):
    __tablename__ = 'community_members'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    community_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('communities.id'), ondelete='CASCADE'), nullable=False)
    joined_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    user = db.relationship('User', back_populates='community_members')
    community = db.relationship('Community', back_populates='community_members')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'community_id': self.community_id,
        }
