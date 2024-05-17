# database.py
from datetime import datetime, timezone
import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session
from models import ChatConnectionsEntity, MessagesEntity, UserEntity, FriendsEntity
from models import Base


DATABASE_URL = 'postgresql://gorm:gorm@localhost/dish-dash'

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def setup_database():
    Base.metadata.create_all(engine)
    print("Tables created successfully.")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_user(user_id: str, db: Session):
    user = db.query(UserEntity).filter(UserEntity.id == user_id).first()
    return user


def get_user_friends(user_id: str, db: Session):
    try:
        friends = db.query(FriendsEntity).filter(
            (FriendsEntity.user_a_id == user_id) | (
                FriendsEntity.user_b_id == user_id)
        ).all()

        users = []
        for friend in friends:
            if friend.user_a_id == user_id:
                friend_id = friend.user_a_id
            else:
                friend_id = friend.user_b_id

            user = db.query(UserEntity).filter(
                UserEntity.id == friend_id).first()
            if user:
                users.append({
                    'id': str(user.id),
                    'name': user.name,
                    'surname': user.surname
                })
        return users
    except Exception as e:
        print(f'Error fetching user friends: {e}')
        return []


def get_user_chat_connections(user_id: str, db: Session):
    chat_connections = db.query(ChatConnectionsEntity).filter(
        (ChatConnectionsEntity.user_a_id == user_id) |
        (ChatConnectionsEntity.user_b_id == user_id)
    ).all()
    return chat_connections


def create_chat_connection(user_a_id: str, user_b_id: str, db: Session):
    try:
        new_chat_connection = ChatConnectionsEntity(
            user_a_id=user_a_id,
            user_b_id=user_b_id
        )
        db.add(new_chat_connection)
        db.commit()
        db.refresh(new_chat_connection)
        return new_chat_connection
    except Exception as e:
        db.rollback()
        print(f"Error creating chat connection: {e}")
        return None


def create_message(chat_id: str, message_text: str, db: Session):
    try:
        new_message = MessagesEntity(
            id=uuid.uuid4(),
            chat_id=chat_id,
            message=message_text,
            timestamp=datetime.now(timezone.utc)
        )
        db.add(new_message)
        db.commit()
        db.refresh(new_message)
        return new_message
    except Exception as e:
        db.rollback()
        print(f"Error creating message: {e}")
        return None


def get_messages(user_a_id: str, user_b_id: str, db: Session):
    try:
        chat_connection = db.query(ChatConnectionsEntity).filter(
            ((ChatConnectionsEntity.user_a_id == user_a_id) & (ChatConnectionsEntity.user_b_id == user_b_id)) |
            ((ChatConnectionsEntity.user_a_id == user_b_id) &
             (ChatConnectionsEntity.user_b_id == user_a_id))
        ).first()

        if not chat_connection:
            return []

        messages = db.query(MessagesEntity).filter(
            MessagesEntity.chat_id == chat_connection.id
        ).all()

        return messages
    except Exception as e:
        print(f"Error fetching messages: {e}")
        return None
