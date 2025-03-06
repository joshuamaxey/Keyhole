from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime, timezone

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    bio = db.Column(db.String(250), nullable=False)
    hashed_password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Posts by the user
    posts = db.relationship('Post', back_populates='user', cascade='all, delete-orphan')

    # Communities the user created
    created_communities = db.relationship(
        'Community',
        back_populates='creator',
        overlaps='communities'
    )

    # Community memberships of the user
    community_members = db.relationship(
        'CommunityMember',
        back_populates='user',
        cascade="all, delete-orphan"
    )

    # Comments by the user
    comments = db.relationship('Comment', back_populates='user', cascade='all, delete-orphan')

    # Following and followers
    following = db.relationship('Follow', foreign_keys='Follow.follower_id', back_populates='follower', cascade='all, delete-orphan')
    followers = db.relationship('Follow', foreign_keys='Follow.followed_id', back_populates='followed', cascade='all, delete-orphan')

    # Post and comment likes
    post_likes = db.relationship('PostLike', back_populates='user', cascade='all, delete-orphan')
    comment_likes = db.relationship('CommentLike', back_populates='user', cascade='all, delete-orphan')

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'bio': self.bio
        }
