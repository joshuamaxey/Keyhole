from app.models import db, PostLike, environment, SCHEMA
from sqlalchemy import text

def seed_post_likes():
    post_likes_data = [
    {'user_id': 1, 'post_id': 1},
    {'user_id': 1, 'post_id': 2},
    {'user_id': 1, 'post_id': 3},
    {'user_id': 1, 'post_id': 4},
    {'user_id': 1, 'post_id': 5},
    {'user_id': 1, 'post_id': 6},
    {'user_id': 1, 'post_id': 7},
    {'user_id': 1, 'post_id': 8},
    {'user_id': 1, 'post_id': 9},
    {'user_id': 1, 'post_id': 10},

    {'user_id': 2, 'post_id': 1},
    {'user_id': 2, 'post_id': 2},
    {'user_id': 2, 'post_id': 3},
    {'user_id': 2, 'post_id': 4},
    {'user_id': 2, 'post_id': 5},
    {'user_id': 2, 'post_id': 6},
    {'user_id': 2, 'post_id': 7},

    {'user_id': 3, 'post_id': 1},
    {'user_id': 3, 'post_id': 2},
    {'user_id': 3, 'post_id': 3},
    {'user_id': 3, 'post_id': 4},
    {'user_id': 3, 'post_id': 5},
    {'user_id': 3, 'post_id': 6},
    {'user_id': 3, 'post_id': 7},
    {'user_id': 3, 'post_id': 8},
    {'user_id': 3, 'post_id': 9},
    {'user_id': 3, 'post_id': 10},

    {'user_id': 4, 'post_id': 1},
    {'user_id': 4, 'post_id': 2},
    {'user_id': 4, 'post_id': 3},
    {'user_id': 4, 'post_id': 4},
    {'user_id': 4, 'post_id': 5},
    {'user_id': 4, 'post_id': 6},
    {'user_id': 4, 'post_id': 7},
    {'user_id': 4, 'post_id': 8},

    {'user_id': 5, 'post_id': 1},
    {'user_id': 5, 'post_id': 2},
    {'user_id': 5, 'post_id': 3},
    {'user_id': 5, 'post_id': 4},
    {'user_id': 5, 'post_id': 5},
    {'user_id': 5, 'post_id': 6},
    {'user_id': 5, 'post_id': 7},
    {'user_id': 5, 'post_id': 8},
    {'user_id': 5, 'post_id': 9},
    ]

    for data in post_likes_data:
        post_like = PostLike(**data)
        db.session.add(post_like)

    db.session.commit()

def undo_post_likes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.post_likes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM post_likes"))

    db.session.commit()
