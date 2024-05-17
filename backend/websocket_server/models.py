from sqlalchemy import Column, ForeignKeyConstraint, String, ForeignKey, DateTime, PrimaryKeyConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

Base = declarative_base()


class UserEntity(Base):
    __tablename__ = 'user_entities'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String)
    surname = Column(String)


class FriendsEntity(Base):
    __tablename__ = 'friends_entities'

    user_a_id = Column(UUID(as_uuid=True), ForeignKey(
        'user_entities.id'), nullable=False)
    user_b_id = Column(UUID(as_uuid=True), ForeignKey(
        'user_entities.id'), nullable=False)
    creation_date = Column(
        DateTime, default=lambda: datetime.now(timezone.utc))

    user_a = relationship('UserEntity', foreign_keys=[user_a_id], backref='user_a_friends',
                          primaryjoin="FriendsEntity.user_a_id == UserEntity.id")
    user_b = relationship('UserEntity', foreign_keys=[user_b_id], backref='user_b_friends',
                          primaryjoin="FriendsEntity.user_b_id == UserEntity.id")

    __table_args__ = (
        PrimaryKeyConstraint('user_a_id', 'user_b_id', name='friends_pk'),
    )


class ChatConnectionsEntity(Base):
    __tablename__ = 'chat_connections_entities'

    user_a_id = Column(UUID(as_uuid=True), ForeignKey('user_entities.id'), nullable=False, primary_key=True)
    user_b_id = Column(UUID(as_uuid=True), ForeignKey('user_entities.id'), nullable=False, primary_key=True)

    user_a = relationship('UserEntity', foreign_keys=[user_a_id], primaryjoin="ChatConnectionsEntity.user_a_id == UserEntity.id")
    user_b = relationship('UserEntity', foreign_keys=[user_b_id], primaryjoin="ChatConnectionsEntity.user_b_id == UserEntity.id")

    messages = relationship('MessagesEntity', back_populates='chat_connection')

class MessagesEntity(Base):
    __tablename__ = 'messages_entities'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    chat_id_part_1 = Column(UUID(as_uuid=True), nullable=False)
    chat_id_part_2 = Column(UUID(as_uuid=True), nullable=False)
    message = Column(String, nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        ForeignKeyConstraint(
            ['chat_id_part_1', 'chat_id_part_2'],
            ['chat_connections_entities.user_a_id', 'chat_connections_entities.user_b_id']
        ),
    )
    chat_connection = relationship('ChatConnectionsEntity', 
                                primaryjoin="and_(MessagesEntity.chat_id_part_1 == ChatConnectionsEntity.user_a_id, MessagesEntity.chat_id_part_2 == ChatConnectionsEntity.user_b_id)",
                                back_populates='messages')

