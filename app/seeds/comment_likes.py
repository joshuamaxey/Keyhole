from app.models import db, CommentLike, environment, SCHEMA
from sqlalchemy import text

def seed_comment_likes():
    comment_likes_data = [
        {'user_id': 1, 'comment_id': 1},
        {'user_id': 1, 'comment_id': 2},
        {'user_id': 1, 'comment_id': 3},
        {'user_id': 1, 'comment_id': 4},
        {'user_id': 1, 'comment_id': 5},
        {'user_id': 1, 'comment_id': 6},
        {'user_id': 1, 'comment_id': 7},
        {'user_id': 1, 'comment_id': 8},
        {'user_id': 1, 'comment_id': 9},
        {'user_id': 1, 'comment_id': 10},
        {'user_id': 1, 'comment_id': 11},
        {'user_id': 1, 'comment_id': 12},
        {'user_id': 1, 'comment_id': 13},
        {'user_id': 1, 'comment_id': 14},
        {'user_id': 1, 'comment_id': 15},

        {'user_id': 2, 'comment_id': 1},
        {'user_id': 2, 'comment_id': 2},
        {'user_id': 2, 'comment_id': 3},
        {'user_id': 2, 'comment_id': 4},
        {'user_id': 2, 'comment_id': 5},
        {'user_id': 2, 'comment_id': 6},
        {'user_id': 2, 'comment_id': 7},
        {'user_id': 2, 'comment_id': 10},
        {'user_id': 2, 'comment_id': 11},
        {'user_id': 2, 'comment_id': 12},
        {'user_id': 2, 'comment_id': 13},
        {'user_id': 2, 'comment_id': 14},
        {'user_id': 2, 'comment_id': 15},


        {'user_id': 3, 'comment_id': 1},
        {'user_id': 3, 'comment_id': 2},
        {'user_id': 3, 'comment_id': 3},
        {'user_id': 3, 'comment_id': 4},
        {'user_id': 3, 'comment_id': 5},
        {'user_id': 3, 'comment_id': 6},
        {'user_id': 3, 'comment_id': 7},
        {'user_id': 3, 'comment_id': 8},
        {'user_id': 3, 'comment_id': 9},
        {'user_id': 3, 'comment_id': 10},

        {'user_id': 4, 'comment_id': 1},
        {'user_id': 4, 'comment_id': 2},
        {'user_id': 4, 'comment_id': 3},
        {'user_id': 4, 'comment_id': 4},
        {'user_id': 4, 'comment_id': 5},
        {'user_id': 4, 'comment_id': 6},
        {'user_id': 4, 'comment_id': 7},
        {'user_id': 4, 'comment_id': 8},
        {'user_id': 4, 'comment_id': 10},
        {'user_id': 4, 'comment_id': 11},
        {'user_id': 4, 'comment_id': 12},
        {'user_id': 4, 'comment_id': 13},
        {'user_id': 4, 'comment_id': 14},
        {'user_id': 4, 'comment_id': 15},

        {'user_id': 5, 'comment_id': 1},
        {'user_id': 5, 'comment_id': 2},
        {'user_id': 5, 'comment_id': 3},
        {'user_id': 5, 'comment_id': 4},
        {'user_id': 5, 'comment_id': 5},
        {'user_id': 5, 'comment_id': 6},
        {'user_id': 5, 'comment_id': 7},
        {'user_id': 5, 'comment_id': 8},
        {'user_id': 5, 'comment_id': 9},
    ]

    for data in comment_likes_data:
        comment_like = CommentLike(**data)
        db.session.add(comment_like)

    db.session.commit()

def undo_comment_likes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comment_likes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comment_likes"))

    db.session.commit()
