from app.models import db, CommunityMember, environment, SCHEMA
from sqlalchemy import text

def seed_community_members():
    community_members_data = [
    {'user_id': 1, 'community_id': 1},
    {'user_id': 1, 'community_id': 2},
    {'user_id': 1, 'community_id': 3},  # User 1 belongs to 3 communities
    {'user_id': 2, 'community_id': 1},
    {'user_id': 2, 'community_id': 3},
    {'user_id': 2, 'community_id': 4},  # User 2 belongs to 3 communities
    {'user_id': 3, 'community_id': 2},
    {'user_id': 3, 'community_id': 3},
    {'user_id': 3, 'community_id': 4},  # User 3 belongs to 3 communities
    {'user_id': 4, 'community_id': 1},
    {'user_id': 4, 'community_id': 2},
    {'user_id': 4, 'community_id': 3},
    {'user_id': 4, 'community_id': 4},  # User 4 belongs to all 4 communities
    {'user_id': 5, 'community_id': 1},
    {'user_id': 5, 'community_id': 2},
    {'user_id': 5, 'community_id': 4}
    ]

    for data in community_members_data:
        community_member = CommunityMember(**data)
        db.session.add(community_member)

    db.session.commit()

def undo_community_members():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.community_members RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM community_members"))

    db.session.commit()
