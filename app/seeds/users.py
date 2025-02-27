from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo_User',
        bio="Hi, I'm Demo. I was created with this project, and the purpose of my existence is to help the developer build and test this application. That's really all that there is to me.",
        password='password'
    )
    marnie = User(
        username='Marnie_Mcfly',
        bio="Hey! I'm Marnie McFly. I once turned a DeLorean into a time machine by accident. Now, I travel through tech eras, fixing bugs and ensuring everything runs smoothly. Join me on this coding adventure through time!",
        password='password'
    )
    bobbie = User(
        username='Bobbie_Joe',
        bio="Hi, I'm Bobbie Joe. I live on a chicken farm called Wildflower. When I'm not tending to the chickens, I'm coding amidst the wildflowers. Balancing rural life and tech, I ensure everything runs smoothly, from coops to code.",
        password='password'
    )
    curious = User(
        username='Curious_Owl',
        bio="Hi, I'm Curious Owl, the neighborhood grandma. I love watching my neighbors from my kitchen window while cooking. With a keen eye and a curious mind, I balance cooking and coding, ensuring everything runs smoothly in our cozy corner.",
        password="password"
    )
    brave = User(
        username='Brave_Lion',
        bio="Hey, I'm Brave Lion. In the gaming realm, I'm a renowned dragon-slayer, celebrated for my courage and digital feats. With a heart of a lion, I conquer virtual worlds, ensuring every quest is a victory. Join me on epic adventures!",
        password="password"
    )


    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.add(curious)
    db.session.add(brave)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
