from app.models import db, Comment, User, Post
from sqlalchemy.sql import text

def seed_comments():
    comments_data = [
        # 3 comments on posts 1, 2, and 3
        {'post_id': 1, 'user_id': 1, 'content': "Exciting news! 🌟 My experiment mapping unseen regions of the universe was a success. The data reveals fascinating insights into previously unknown cosmic structures. I'm eager to share these groundbreaking findings once I return to Earth. The potential implications for our understanding of space-time are beyond thrilling. Can't wait to delve deeper! 🚀🌌✨"},
        {'post_id': 1, 'user_id': 2, 'content': "Wow, I had no idea there were others exploring the cosmos like me and my grandfather! 🚀 It's thrilling to know we're not alone in this adventure. We'd love to join you on your next cosmic journey and share our time-traveling tales. The universe is vast, and together, we can uncover its mysteries. Can't wait for our paths to cross! 🌌✨"},
        {'post_id': 1, 'user_id': 3, 'content': "This cosmic adventuring sounds amazing, but it's a bit out-of-this-world for me. I'm perfectly content staying on Earth with my chickens at Wildflower. Balancing rural life and coding amidst the wildflowers suits me just fine. 🌼🐔 Keep reaching for the stars, and I'll keep things running smoothly down here! 🚜✨"},
        {'post_id': 2, 'user_id': 1, 'content': ''},
        {'post_id': 2, 'user_id': 3, 'content': ''},
        {'post_id': 2, 'user_id': 4, 'content': ''},
        {'post_id': 3, 'user_id': 2, 'content': ''},
        {'post_id': 3, 'user_id': 4, 'content': ''},
        {'post_id': 3, 'user_id': 5, 'content': ''},

        # 2 comments on posts 4 and 5
        {'post_id': 4, 'user_id': 1, 'content': ''},
        {'post_id': 4, 'user_id': 5, 'content': ''},
        {'post_id': 5, 'user_id': 2, 'content': ''},
        {'post_id': 5, 'user_id': 3, 'content': ''},

        # 1 comment on posts 8 and 9
        {'post_id': 8, 'user_id': 4, 'content': ''},
        {'post_id': 9, 'user_id': 5, 'content': ''},

        # No comments on posts 6, 7, or 10
    ]

    # Adding comments to the database
    for comment_data in comments_data:
        comment = Comment(**comment_data)
        db.session.add(comment)

    db.session.commit()

def undo_comments():
    db.session.execute(text("TRUNCATE comments RESTART IDENTITY CASCADE;"))
    db.session.commit()
