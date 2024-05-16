import socketio
import eventlet
from sqlalchemy.orm import Session
from models import UserEntity, FriendsEntity
from database import setup_database, get_db, get_user_friends, get_user_chat_connections, create_chat_connection, create_message

sio = socketio.Server(cors_allowed_origins='*')
app = socketio.WSGIApp(sio)

connected_clients = {}
receiver_to_senders = {}
chat_connections_data = []

@sio.event
def connect(sid, environ):
    print(f'Client connected: {sid}')
    
    query_string = environ.get('QUERY_STRING')
    if query_string:
        params = dict(param.split('=') for param in query_string.split('&'))
        user_id = params.get('user_id')
    else:
        user_id = None

    if not user_id:
        print('User ID not found in query parameters')
        return

    # Store the connected client with their user_id
    connected_clients[user_id] = sid

    print(f'Connected user SID: {sid}')
    
    with next(get_db()) as db:
        friends = get_user_friends(user_id, db)
        chat_connections = get_user_chat_connections(user_id, db)
        
        global chat_connections_data
        chat_connections_data = []
        for chat in chat_connections:
            chat_data = {
                'id': str(chat.id),
                'user_a_id': str(chat.user_a_id),
                'user_b_id': str(chat.user_b_id)
            }
            chat_connections_data.append(chat_data)
        
        sio.emit('users_list', friends, room=sid)
        sio.emit('chat_connections', chat_connections_data, room=sid)

@sio.event
def select_friend(sid, data):
    sender = data['sender']
    receiver = data['receiver']
    
    if sender in connected_clients:
        for recv, senders in receiver_to_senders.items():
            if sender in senders:
                senders.remove(sender)
                break
        
        if receiver not in receiver_to_senders:
            receiver_to_senders[receiver] = []
        receiver_to_senders[receiver].append(sender)
        
        print(f'Connecting sender {sender} with receiver {receiver}')
        sio.emit('friend_selected', {'sender': sender, 'receiver': receiver}, room=connected_clients[sender])

@sio.event
def chat_message(sid, data):
    print(f'Received message from {data["sender"]}: {data}')
    sender = data['sender']
    receiver = data['receiver']
    message_text = data['message']

    with next(get_db()) as db:
        chat_connection = next((chat for chat in chat_connections_data if 
                                (chat['user_a_id'] == sender and chat['user_b_id'] == receiver) or
                                (chat['user_a_id'] == receiver and chat['user_b_id'] == sender)), None)

        if not chat_connection:
            new_chat_connection = create_chat_connection(sender, receiver, db)
            if new_chat_connection:
                chat_connection = {
                    'id': str(new_chat_connection.id),
                    'user_a_id': str(new_chat_connection.user_a_id),
                    'user_b_id': str(new_chat_connection.user_b_id)
                }
                chat_connections_data.append(chat_connection)
                print(f"Chat connection created: {new_chat_connection.id}")
            else:
                print("Failed to create chat connection")
                return

        new_message = create_message(chat_connection['id'], message_text, db)
        if new_message:
            print(f"Message created with ID: {new_message.id}")
        else:
            print("Failed to create message")
            return

    receiver_sid = connected_clients.get(receiver)
    if receiver_sid:
        sio.emit('chat_message', data, room=receiver_sid)

@sio.event
def disconnect(sid):
    print(f'Client disconnected: {sid}')
    user_to_remove = None
    for user_id, client_sid in connected_clients.items():
        if client_sid == sid:
            user_to_remove = user_id
            break
    
    if user_to_remove:
        del connected_clients[user_to_remove]
        
        for receivers in receiver_to_senders.values():
            if user_to_remove in receivers:
                receivers.remove(user_to_remove)
                break

if __name__ == '__main__':
    setup_database()
    print('Starting WebSocket server on port 3000...')
    eventlet.wsgi.server(eventlet.listen(('0.0.0.0', 3000)), app)