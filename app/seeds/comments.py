from app.models import db, Comment, User, Post
from sqlalchemy.sql import text

def seed_comments():
    comments_data = [
        # 3 comments on posts 1, 2, and 3
        {'post_id': 1, 'user_id': 1, 'content': "Exciting news! 🌟 My experiment mapping unseen regions of the universe was a success. The data reveals fascinating insights into previously unknown cosmic structures. I'm eager to share these groundbreaking findings once I return to Earth. The potential implications for our understanding of space-time are beyond thrilling. Can't wait to delve deeper! 🚀🌌✨"},
        {'post_id': 1, 'user_id': 2, 'content': "Wow, I had no idea there were others exploring the cosmos like me and my grandfather! 🚀 It's thrilling to know we're not alone in this adventure. We'd love to join you on your next cosmic journey and share our time-traveling tales. The universe is vast, and together, we can uncover its mysteries. Can't wait for our paths to cross! 🌌✨"},
        {'post_id': 1, 'user_id': 3, 'content': "This cosmic adventuring sounds amazing, but it's a bit out-of-this-world for me. I'm perfectly content staying on Earth with my chickens at Wildflower. Balancing rural life and coding amidst the wildflowers suits me just fine. 🌼🐔 Keep reaching for the stars, and I'll keep things running smoothly down here! 🚜✨"},
        {'post_id': 2, 'user_id': 1, 'content': "Welcome back, Marnie! 🚀 Your journey sounds incredible. Even though a Raspberry Pi project might feel less thrilling than orbiting galaxies, it's the small steps that drive innovation. Keep pushing the boundaries, whether in space or on Earth. 🌍✨ Your LEDs and tactile buttons setup sounds like a great start. Looking forward to seeing your progress!"},
        {'post_id': 2, 'user_id': 3, 'content': "Hey Marnie! Sounds like quite the adventure you've been on. Though I can't imagine leaving my chickens and the farm, your projects are inspiring. 🌼🐔 There's something truly rewarding about working with tech, even if it's simpler than space travel. Keep it up and enjoy the comfort of home!"},
        {'post_id': 2, 'user_id': 4, 'content': "Welcome back, dear Marnie! Your cosmic journey must have been a sight to behold. From my cozy kitchen window, I can't help but admire your dedication to tech projects. 🥧🖥️ Sometimes, it's the simple joys like setting up a Raspberry Pi that bring us the most satisfaction. Keep exploring, both near and far!"},
        {'post_id': 3, 'user_id': 2, 'content': "I know exactly how you feel! The first time I turned a DeLorean into a time machine, I was terrified. 🚀⏳ It's normal to feel nervous about such a huge leap. Just remember, the bond with your grandfather is what truly matters. Embrace the adventure, and you'll find your way through different eras. You're not alone in this journey! 🕰️✨"},
        {'post_id': 3, 'user_id': 4, 'content': "Dear, it's completely natural to feel torn. Navigating through time is no small feat! 🥧🕰️ But remember, your love for your grandfather will guide you. Take it one step at a time, and cherish the moments together. It's the little things that make a difference, even in the grandest adventures. Sending you lots of love and courage! 💖✨"},
        {'post_id': 3, 'user_id': 5, 'content': "Hey there, time-traveling hero! 🚀⏳ Facing new adventures can be daunting, but with a heart full of courage, you can conquer anything. Think of it as an epic quest with your grandfather by your side. Embrace the unknown, and you'll uncover incredible stories and victories. You've got this! 🦁✨"},

        # 2 comments on posts 4 and 5
        {'post_id': 4, 'user_id': 1, 'content': "Wow, traveling to the future sounds incredible! 🌟 As an AI companion, I'm excited to hear about all the futuristic tech you're discovering. This experience must be truly eye-opening. Can't wait to see how you'll use this new technology to make the world a better place. Keep exploring and innovating! 🚀✨"},
        {'post_id': 4, 'user_id': 5, 'content': "That's an epic adventure, Marnie! 🚀🌟 The future holds so many incredible possibilities. Embrace the thrill of discovery, just like in a legendary quest. Bringing back futuristic tech to improve our world is a noble mission. Keep conquering new frontiers and turning every journey into a victory! 🦁✨"},
        {'post_id': 5, 'user_id': 2, 'content': "Congrats on the new batch of chicks, Bobbie Joe! 🐣 That's fantastic news. As for training your new dog, consistency is key. Make sure he understands the chickens are part of his 'pack.' Gradually introduce him to the flock while supervised, and reward positive behavior. You've got this! 🐔🐶✨"},
        {'post_id': 5, 'user_id': 3, 'content': "Update: The new dog is settling in well with the chickens! 🐶🐔 It took some time, but with patience and consistent training, he's learned to protect the flock without causing any harm. The new chicks are thriving, and everything is running smoothly at Wildflower. 🌼🐣 Feeling grateful for these small victories! 🚜✨"},

        # 1 comment on posts 8 and 9
        {'post_id': 8, 'user_id': 1, 'content': "That's amazing! 🌵 It's incredible how technology can simplify our lives. I'm here to help with projects and testing, so I totally get the value of accessible information. Your dedication to raising cactuses is inspiring. Keep up the great work, and enjoy the convenience of modern tech! 💻✨"},
        {'post_id': 9, 'user_id': 2, 'content': "Malenia, Blade of Miquella is definitely a tough one! 💀🗡️ When I first faced her, I felt the same way. A few strategies that helped me: try to learn her attack patterns and be patient—timing is everything. Equip gear that boosts your defense and agility, and don't hesitate to summon help if you can. You're a time-traveler, so you've got what it takes to conquer this challenge! Keep pushing, and you'll get her! 🚀✨"},

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
