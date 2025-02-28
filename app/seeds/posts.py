from app.models import db, Post, environment, SCHEMA
from sqlalchemy import text

# Communities:
# Tech and Science
# Learning and Education
# Animals and Pets
# Love and Family

def seed_posts():
    # ---------------------Demo_User------------------------
    demo_post_1 = Post(
        user_id=1,
        community_id=1, # Community - Tech and Science
        content="Exploring the wonders of the universe from the confines of my rocket. 🚀 As I orbit around distant galaxies, I'm working on a fascinating quantum computing project that could revolutionize our understanding of space-time. The idea that qubits can simulate cosmic phenomena is mind-blowing. Today, I conducted an experiment that could potentially map out unseen regions of the universe. The vastness of space fuels my curiosity and drives me to push the boundaries of what we know. 🌌✨"
    )
    demo_post_2 = Post(
        user_id=1,
        community_id=2, # Community - Learning and Education
        content="Back on Earth after an incredible journey through the cosmos. Adjusting to the return to normalcy, working on a Raspberry Pi project for my class feels a bit underwhelming compared to orbiting galaxies. 🚀 However, there's something comforting about being back home and diving into tech projects. Today, I set up LEDs and tactile buttons on my Pi—simple, yet rewarding. Sometimes, the small steps matter just as much as the giant leaps. 🖥️✨"
    )
    # ---------------------Marnie_Mcfly------------------------
    marnie_post_1 = Post(
        user_id=2,
        community_id=4, # Community - Love and Family
        content="My grandfather just finished building his latest invention—an actual time-travel machine. 🚀⏳ As incredible as it sounds, I'm extremely nervous about the idea of jumping through time. The thought of navigating different eras and the potential consequences makes my head spin. But I don't want to disappoint him; he seems so excited about our adventures together. I know how much it means to him, and it means the world to me too. Torn between fear and love, I can't find the words to tell him. 💔"
    )
    marnie_post_2 = Post(
        user_id=2,
        community_id=1, # Community - Tech and Science
        content="My grandfather and I accidentally traveled to the future instead of the past! 🚀 The technologies here are mind-blowing—flying cars, AI companions, and more. Instead of heading back right away, we decided to explore and enjoy this futuristic society. I'm glad I came; this experience is incredible. Can't wait to bring back some of this new tech to help change the world for the better! 🌟"
    )
    # ---------------------Bobbie_Joe------------------------
    bobbie_post_1 = Post(
        user_id=3,
        community_id=3, # Community - Animals and Pets
        content="Exciting news—my chickens just hatched a new batch of chicks! 🐣 Soon, I'll be producing more eggs than ever. But I've also got a new dog to protect them from predators, and I'm a bit worried he might go after the chickens himself. Any tips on how to train him to guard without harming the flock? 🐔🐶"
    )
    bobbie_post_2 = Post(
        user_id=3,
        community_id=3, # Community - Animals and Pets
        content="Big news—my chickens have hatched even more chicks, and now there are too many to fit in my coops! 🐣 They're all healthy and produce lots of eggs. If anyone's interested in buying some, check out my Craigslist listing: chicken-link. Let's give these lovely chickens a new home! 🐔💛"
    )
    # ---------------------Curious_Owl------------------------
    curious_post_1 = Post(
        user_id=4,
        community_id=4, # Community - Love and Family
        content="I just invited my granddaughter's boyfriend to live on our property. I don't know him very well, and I'm a bit nervous, but he didn't have anywhere to go, and I couldn't let him be without a home. I trust my granddaughter's judgment and can tell he has a good heart. Hoping for the best as we get to know each other! 💛"
    )
    curious_post_2 = Post(
        user_id=4,
        community_id=2, # Community - Learning and Education
        content="I love raising cactuses and have a new batch in my front yard. 🌵 At first, they were dying on me because I hadn't worked with this species before, but I did some research online and figured out what was wrong. The internet is incredible—back in my day, I'd have had to find a book instead of just doing a Google search. Technology makes life so much easier! 💻"
    )
    # --------------------Brave_Lion-------------------------
    brave_post_1 = Post(
        user_id=5,
        community_id=1, # Community - Tech and Science
        content="I'm losing my mind trying to defeat Malenia, Blade of Miquella in Elden Ring. 😤 I've died so many times, I can't even keep count anymore. Anyone have any tips or strategies to take her down? I've tried everything I can think of, but she's relentless. Any advice would be greatly appreciated! 💀🗡️"
    )
    brave_post_2 = Post(
        user_id=5,
        community_id=3, # Community - Animals and Pets
        content="Just spotted an actual dragon in real life! 🐉 It burned down a village near my city, and I'm going to try to slay it myself. 😤 I'm eager to see if my gaming skills will carry over into real life. This is my chance to be a real hero and protect my community. Wish me luck! 🗡️🔥"
    )

    db.session.add(demo_post_1)
    db.session.add(demo_post_2)
    db.session.add(marnie_post_1)
    db.session.add(marnie_post_2)
    db.session.add(bobbie_post_1)
    db.session.add(bobbie_post_2)
    db.session.add(curious_post_1)
    db.session.add(curious_post_2)
    db.session.add(brave_post_1)
    db.session.add(brave_post_2)
    db.session.commit()

def undo_posts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.posts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM posts"))
    db.session.commit()
