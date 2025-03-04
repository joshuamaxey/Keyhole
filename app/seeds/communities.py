from app.models import db, Community, environment, SCHEMA
from sqlalchemy import text

def seed_communities():
    tech_science = Community(
        name = "Tech and Science",
        description = "A vibrant community for tech and science enthusiasts, founded by Demo_User, a pioneer in cosmic exploration and quantum computing. Join us to discuss groundbreaking technologies, innovative scientific discoveries, and the fascinating intersection of both fields. Whether you're a seasoned expert or a curious learner, this community is the perfect place to share knowledge, exchange ideas, and stay up-to-date with the latest advancements in tech and science.",
        creator_id = 1
    )
    learning_education = Community(
        name = "Learning and Education",
        description = "A dynamic community for learners and educators, founded by Marnie_Mcfly, an intrepid time traveler who believes that education happens everywhere—from classrooms to cosmic adventures. 🎓🌌 Whether you're exploring new academic theories or gaining practical knowledge through real-world experiences, this community is the perfect place to share insights, discover innovative teaching methods, and support each other's lifelong learning journeys. Join us to celebrate the joy of learning, both inside and outside traditional settings. 🚀📝",
        creator_id = 2
    )
    animals_pets = Community(
        name = "Animals and Pets",
        description = "A welcoming community for pet owners and animal lovers, founded by Bobbie_Joe, a dedicated chicken farmer with a deep passion for animals. 🐔❤️ Join us to share stories, tips, and experiences about raising pets, from playful puppies to curious chicks. Whether you're a seasoned pet owner or just starting your journey, this community is the perfect place to connect with fellow animal enthusiasts, learn about pet care, and celebrate the joy that animals bring into our lives. 🐾🐶🐱",
        creator_id = 3
    )
    love_family = Community(
        name = "Love and Family",
        description = "A heartwarming community for those who cherish love and family, founded by Curious_Owl, a devoted grandmother who lives with her daughters and grandchildren at Wildflower. 🏡❤️ This community celebrates the bonds that keep families together, whether through shared traditions, everyday moments, or life’s big adventures. Join us to share stories, tips, and experiences about nurturing family relationships, supporting each other, and creating lasting memories. Let’s embrace the warmth and joy that family brings into our lives. 🌸👨‍👩‍👧‍👦",
        creator_id = 4
    )

    db.session.add(tech_science)
    db.session.add(learning_education)
    db.session.add(animals_pets)
    db.session.add(love_family)
    db.session.commit()

def undo_communities():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.communities RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM communities"))
    db.session.commit()
