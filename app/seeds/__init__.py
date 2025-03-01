from flask.cli import AppGroup
from .users import seed_users, undo_users
from .posts import seed_posts, undo_posts
from .communities import seed_communities, undo_communities
from .comments import seed_comments, undo_comments
from .community_members import seed_community_members, undo_community_members
from .follows import seed_follows, undo_follows
from .post_likes import seed_post_likes, undo_post_likes
from .comment_likes import seed_comment_likes, undo_comment_likes

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_posts()
        undo_communities()
        undo_comments()
        undo_community_members()
        undo_follows()
        undo_post_likes()
        undo_comment_likes()
    seed_users()
    seed_posts()
    seed_communities()
    seed_comments()
    seed_community_members()
    seed_follows()
    seed_post_likes()
    seed_comment_likes()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_posts()
    undo_communities()
    undo_comments()
    undo_community_members()
    undo_follows()
    undo_post_likes()
    undo_comment_likes()
    # Add other undo functions here
