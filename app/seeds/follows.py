from app.models import db, Follow, environment, SCHEMA
from sqlalchemy import text

def seed_follows():
    follows_data = [
    {'follower_id': 1, 'followed_id': 2},
    {'follower_id': 1, 'followed_id': 3},
    {'follower_id': 1, 'followed_id': 4},

    {'follower_id': 2, 'followed_id': 1},
    {'follower_id': 2, 'followed_id': 3},
    {'follower_id': 2, 'followed_id': 5},

    {'follower_id': 3, 'followed_id': 1},
    {'follower_id': 3, 'followed_id': 2},
    {'follower_id': 3, 'followed_id': 4},
    {'follower_id': 3, 'followed_id': 5},

    {'follower_id': 4, 'followed_id': 1},
    {'follower_id': 4, 'followed_id': 3},
    {'follower_id': 4, 'followed_id': 5},

    {'follower_id': 5, 'followed_id': 1},
    {'follower_id': 5, 'followed_id': 2},
    {'follower_id': 5, 'followed_id': 4},
    ]

    for data in follows_data:
        follow = Follow(**data)
        db.session.add(follow)

    db.session.commit()

def undo_follows():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.follows RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM follows"))

    db.session.commit()
