from sqlalchemy import Column, String, ForeignKey, DateTime, PrimaryKeyConstraint
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
    
    user_a_id = Column(UUID(as_uuid=True), ForeignKey('user_entities.id'), nullable=False)
    user_b_id = Column(UUID(as_uuid=True), ForeignKey('user_entities.id'), nullable=False)
    creation_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    user_a = relationship('UserEntity', foreign_keys=[user_a_id], backref='user_a_friends',
                          primaryjoin="FriendsEntity.user_a_id == UserEntity.id")
    user_b = relationship('UserEntity', foreign_keys=[user_b_id], backref='user_b_friends',
                          primaryjoin="FriendsEntity.user_b_id == UserEntity.id")

    __table_args__ = (
        PrimaryKeyConstraint('user_a_id', 'user_b_id', name='friends_pk'),
    )

class ChatConnectionsEntity(Base):
    __tablename__ = 'chat_connections_entities'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_a_id = Column(UUID(as_uuid=True), ForeignKey('user_entities.id'), nullable=False)
    user_b_id = Column(UUID(as_uuid=True), ForeignKey('user_entities.id'), nullable=False)

    user_a = relationship('UserEntity', foreign_keys=[user_a_id], primaryjoin="ChatConnectionsEntity.user_a_id == UserEntity.id")
    user_b = relationship('UserEntity', foreign_keys=[user_b_id], primaryjoin="ChatConnectionsEntity.user_b_id == UserEntity.id")

class MessagesEntity(Base):
    __tablename__ = 'messages_entities'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    chat_id = Column(UUID(as_uuid=True), ForeignKey('chat_connections_entities.id'), nullable=False)
    message = Column(String, nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    chat_connection = relationship('ChatConnectionsEntity', foreign_keys=[chat_id])
