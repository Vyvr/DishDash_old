import json
import random
import uuid
from faker import Faker

# Initialize Faker to generate fake data
fake = Faker()

# Generate a substantial amount of fake data for `data.json`

# Define the number of entries you want to create for each entity
num_users = 100
num_posts_per_user = 5
num_friends_per_user = 10
num_likes_per_post = 3
num_comments_per_post = 2

# Initialize lists to hold data for each entity type
users_ids = [None] * num_users
users = []
posts = []
friends = []
likes = []
comments = []

# Generate Users ids
users_ids = [uuid.uuid4() for _ in range(num_users)]

# Convert UUID objects to strings
users_ids_str = [str(uid) for uid in users_ids]

# Generate Users
for index, user_id in enumerate(users_ids_str):
    user_name = fake.first_name()
    user_surname = fake.last_name()

    users.append({
        "id": user_id,
        "email": fake.email(),
        "name": user_name,
        "surname": user_surname,
        "password": "1234567",
        "description": None,
        "token": None,
        "picturePath": None
    })
    
    # Generate Posts for each User
    for _ in range(num_posts_per_user):
        post_id = str(uuid.uuid4())
        posts.append({
            "id": post_id,
            "ownerId": user_id,
            "ownerName": user_name,
            "ownerSurname": user_surname,
            "title": fake.sentence(nb_words=4),
            "ingredients": fake.text(max_nb_chars=200),
            "portionQuantity": random.randint(1, 10),
            "preparation": fake.text(max_nb_chars=200),
            "likesCount": 0,
            "commentsCount": 0,
            "creation_date": fake.date_time_this_year().isoformat()
        })

        # Generate Likes and Comments for each Post
        for _ in range(num_likes_per_post):
            likes.append({
                "postId": post_id,
                "userId": random.choice(users_ids_str),
                "creation_date": fake.date_time_this_year().isoformat()
            })

        for _ in range(num_comments_per_post):
            comments.append({
                "id": str(uuid.uuid4()),
                "postId": post_id,
                "userId": random.choice(users_ids_str),
                "commentText": fake.text(max_nb_chars=100),
                "creation_date": fake.date_time_this_year().isoformat()
            })

# Generate Friends relationships
for user in users:
    for _ in range(num_friends_per_user):
        friends.append({
            "userAId": user["id"],
            "userBId": random.choice(users_ids_str),
            "creation_date": fake.date_time_this_year().isoformat()
        })

# Combine all data into one dictionary
data = {
    "Users": users,
    "Posts": posts,
    "Friends": friends,
    "Comments": comments,
    "Likes": likes
}

# Write the data to a JSON file
with open('data.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Data generated and written to data.json")
