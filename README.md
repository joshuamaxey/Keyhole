# Keyhole

[Keyhole](https://keyhole-gzof.onrender.com/) is a blogging and social networking application that allows users to create and share content within communities. The backend of our application is built with Python3 and Flask, using a PostgreSQL database. The frontend is built with React, and we use Redux for creating and managing a normalized global state. Below is an overview of the structure and layout of Keyhole's frontend pages and components. This excerpt from our documentation will guide you through the different sections, highlighting key functionalities. To view the full documentation for the Keyhole application, click [here](https://github.com/joshuamaxey/Keyhole/wiki).

## Homepage

* Main Feed
* Communities
* Profile

<img width="1246" alt="image" src="https://github.com/user-attachments/assets/db464602-71f4-4365-bd49-5a1306f5ba96" />

### Keyhole Homepage Functionality

**Overview:**
Keyhole is designed to be a truly 'single-page' application, ensuring a seamless and user-friendly experience. The Homepage includes three primary components: the Feed, Communities, and Profile. These components work together to provide users with easy access to posts, communities, and their own profile information.

### Components:

#### 1. Feed:
- **Purpose**: Displays posts from Keyhole users and allows user to post.
- **Default Behavior**: Allows users to post. Posts from communities the user belongs to are shown at the top of the feed, followed by other posts.
- **Interactions**:
  - **Create Post Card**: Users can post content to Keyhole and to a chosen community.
  - **LIKE and COMMENT Buttons**: Users can like or comment on any post in the feed.
  - **Post Card**: Clicking on a Post Card changes the feed to display that Post Detail Page.
  - **Community 'VIEW' Button**: Clicking this filters the feed to show posts belonging to that community only.

#### 2. Communities:
- **Purpose**: Shows a list of Keyhole communities.
- **Default Behavior**: Communities the user belongs to are shown at the top of the list for easier access.
- **Interactions**:
  - **VIEW Button**: Shifts the feed to show the community's detail page.
  - **JOIN Button**: Users can join or leave a community. Joining a community means that posts in that community will show in a user's feed.

#### 3. Profile:
- **Purpose**: Displays the current user's information.
- **Content**:
  - **Icon and Name**: Shows the user's profile icon and name.
  - **Bio Preview**: A brief preview of the user's bio.
  - **Statistics**: Displays follower and following counts.
  - **Edit Button**: Allows the user to edit their bio.

### Navigation:
- **Nav Bar**:
  - **Community Name**: If a community view has been selected, that community's name is shown on the Nav
  - **Keyhole Logo**: Displays "Keyhole" over the general feed if no community view has been selected.
  - **Dropdown Menu**:
    - **Not Logged In**: Options to log in or sign up.
    - **Logged In**: Options to log out or create a community.

### Summary:
The Keyhole homepage is designed to provide a consistent and intuitive user experience, allowing users to easily navigate between posts, communities, and profile details without leaving the main page. The single-page application approach enhances performance and ensures seamless interactions.


## Post Detail

> Clicking on a Post Card will shift the feed to display the Post Detail page. The Post Detail page provides a full view of the content of the post, including the number of likes and comments. Comments related to the post will be displayed beneath the post. If the post belongs to the current user, EDIT and DELETE buttons will also be present, allowing the user to modify or remove their post.

* Post Detail
* Communities
* Profile

<img width="1246" alt="image" src="https://github.com/user-attachments/assets/cb332272-648c-4e7b-be03-343bcac461b4" />

## Community Detail

> Clicking the 'VIEW' button on one of the community cards will navigate to that community's detail page. While on a community detail page, the feed will only show posts from that community. Clicking the 'x' button on the left side of the nav will exit the community's detail page and return to the regular feed.

* Community Detail
* Communities
* Profile

<img width="1246" alt="image" src="https://github.com/user-attachments/assets/6d8421f0-43d9-40de-8d8a-082cdf3033ab" />

## Profile Detail

> When a user clicks on their own Profile Card or the Profile Icon of another user, the feed will shift to display the Profile Detail page. This view shows the user's full bio, profile icon, name, and statistics (followers and following count). If the profile belongs to the current user, an EDIT button will be available to allow them to modify their bio. Below the Profile Detail card, a list of the selected user's posts will be displayed. If the user is viewing their own Profile Detail page, they will see an EDIT button on the Profile Detail car. If they're viewing another user's Profile Detail page, they will see a FOLLOW / UNFOLLOW button instead.

* Profile Detail
* Communities
* Profile

### Current User

<img width="1246" alt="image" src="https://github.com/user-attachments/assets/7ed1e962-b45f-49a1-8c6b-8042a8b371d3" />

### Another User

<img width="1246" alt="image" src="https://github.com/user-attachments/assets/fd52dd4a-27a1-42ce-9f6e-a435b046e8a7" />

## Modals

> Most of the create, edit, and delete functionalities within the Keyhole application are handled using modals. These functionalities include signing up and logging in, creating a comment or community, editing a post, comment, community, or the user's bio, and deleting a post, comment, or community. Creating posts is managed by the Create Post card on the main feed, so there is no modal for post creation. Logging out is handled with a single click of the LOG OUT button, so there is no modal involved.

### Login and Signup

> Note that the only parameters required for signup and login are username and password. Username is generated automatically, so password is the only parameter that the user is actually required to enter.

<img width="1246" alt="image" src="https://github.com/user-attachments/assets/37f67587-d155-43a8-805d-66ffbd163c0b" />

### Create a Comment or Community

<img width="1246" alt="image" src="https://github.com/user-attachments/assets/1ad4fb73-0c4e-4ab2-8cc2-c39a7630ffd4" />

### Edit Post, Comment, Community, or Profile (bio)

<img width="1246" alt="image" src="https://github.com/user-attachments/assets/e4aa0265-3252-4b5e-ac27-28e29f18927a" />

### Delete Post, Comment, or Community

<img width="1246" alt="image" src="https://github.com/user-attachments/assets/83333c36-5c5d-4c25-b495-cb7ef3e8853d" />

## Color Scheme

Dark Theme Color Palette

1. Deep Charcoal (Primary Background)
    - Hex: #121212
    - Description: A solid black-gray tone that’s perfect for the app's main background. It provides a modern, minimalist foundation.

2. Slate Blue-Gray (Secondary Background or Card Backgrounds)
    - Hex: #1E1E2E
    - Description: A subtle blue-gray tone for cards, modals, or secondary sections, adding just enough contrast without overwhelming.

3. Steel Gray (Text or Muted Borders)
    - Hex: #474A57
    - Description: A medium-gray with a slightly metallic edge, perfect for neutral text, icons, or border lines.

4. Cool Light Gray (Highlight Text or Muted Elements)
    - Hex: #A1A6B0
    - Description: A soft light gray for secondary text, dividers, or muted UI elements to ensure readability.

5. Electric Blue (Accent or Interactive Elements)
    - Hex: #007BFF
    - Description: A vibrant blue to make buttons, links, and interactive components pop on the dark background.
