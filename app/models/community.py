from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class Community(db.Model):
    __tablename__ = 'communities'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(1000), nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationship with the creator (User who created the community)
    creator = db.relationship(
        'User',
        back_populates='created_communities',
        overlaps='user'
    )

    # Relationship with posts in the community
    posts = db.relationship('Post', back_populates='community')

    # Relationship with community members
    community_members = db.relationship('CommunityMember', back_populates='community', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'creator_id': self.creator_id,
        }
