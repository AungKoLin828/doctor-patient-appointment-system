import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useWebSocket } from './WebSocketProvider';
import EmojiPicker from 'emoji-picker-react';

const Chat = () => {
  const { id: recipientID } = useParams(); // Gets recipient ID from the URL
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');
  const { socket, connectWebSocket } = useWebSocket(); // Access WebSocket context
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messageInputRef = useRef();
  const receiverName = localStorage.getItem('receiverName');

  // Connect WebSocket on mount
  useEffect(() => {
    if (userId) {
      connectWebSocket(userId);
    }
  }, [userId, connectWebSocket]);

  // Auto-bind recipient based on user role and context
  useEffect(() => {
    if (userRole === 'doctor') {
      // For doctors, bind recipient automatically
      const autoRecipient = recipientID || recipientID; // Replace with actual logic
      setRecipient(autoRecipient);
    } else if (userRole === 'patient') {
      // Patients should see the doctor as the recipient
      setRecipient(recipientID); // Ensure the recipient is the doctor
    }
  }, [userRole, recipientID]);

  // Handle incoming messages
  useEffect(() => {
    if (!socket) return;

    // Utility function to find a user's name by ID
    const findNameById = async (id) => {
      try {
        const url =
          userRole === 'doctor'
            ? `http://localhost:5000/api/profile/patient/${id}`
            : `http://localhost:5000/api/profile/doctor/${id}`;
        const response = await axios.get(url);
        return response.data.name;
      } catch (error) {
        console.error('Patient not found', error);
        return 'Unknown User';
      }
    };

    const handleMessage = async (event) => {
      const messageData = JSON.parse(event.data);
      const { sender, content, notification, reactions } = messageData;

      if (userRole === 'doctor') {
        setRecipient(sender);
        if (sender !== undefined) {
          localStorage.setItem('msgSender', sender);
        }
        setRecipient(localStorage.getItem('msgSender'));
      }

      if (notification) {
        alert(notification); // Notify the user
      } else {
        // Fetch the sender's name
        const senderName = await findNameById(sender);
        // Update chat with the sender's name
        setChat((prevChat) => [
          ...prevChat,
          { sender: senderName || 'System', content, reactions: reactions || [] },
        ]);
      }
    };

    socket.addEventListener('message', handleMessage);
    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [socket, userRole]);

  // Send message
  const sendMessage = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      alert('WebSocket is not connected. Please try again later.');
      console.error('WebSocket is not open. Cannot send message.');
      return;
    }

    if (!message.trim() || !recipient) {
      return;
    }
    
    if (message.trim() && recipient.trim()) {
      const messagePayload = {
        type: 'private_message',
        sender: userId,
        recipient,
        content: message.trim(),
      };
      socket.send(JSON.stringify(messagePayload));
      setChat((prevChat) => [
        ...prevChat,
        { sender: 'You', content: message, reactions: [] },
      ]);
      setMessage('');
      messageInputRef.current.focus();
    }
  };

  // Add emoji to message
  const addEmojiToMessage = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji.emoji);
    setShowEmojiPicker(false);
  };

  // Add reaction to a message
  const addReaction = (index, emoji) => {
    const updatedChat = [...chat];
    if (!updatedChat[index].reactions) {
      updatedChat[index].reactions = [];
    }
    updatedChat[index].reactions.push(emoji.emoji);
    setChat(updatedChat);

    // Send reaction to the server (optional)
    const reactionPayload = {
      type: 'reaction',
      sender: userId,
      recipient,
      messageIndex: index,
      reaction: emoji.emoji,
    };
    socket.send(JSON.stringify(reactionPayload));
  };

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '500px',
        margin: 'auto',
        paddingTop: '150px',
        fontFamily: 'Arial, sans-serif',
        background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
        borderRadius: '15px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>
        {userRole === 'doctor' ? '👨‍⚕️ Doctor Chat' : '👩‍⚕️ Patient Chat'}
      </h2>
      <div>
        {userRole === 'doctor' && (
          <div>
            <input
              id="recipient"
              type="hidden"
              value={recipient}
              placeholder="Recipient will be auto-filled"
              style={{ marginBottom: '10px', width: '100%' }}
              disabled // Recipient is auto-bound, no manual input
            />
          </div>
        )}
        {userRole === 'patient' && (
          <p style={{ textAlign: 'center', fontWeight: 'bold', color: '#555' }}>
            To: Dr.{receiverName} 👩‍⚕️
          </p>
        )}
      </div>
      <div
        style={{
          height: '300px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: '10px',
          padding: '10px',
          background: '#fff',
          marginBottom: '10px',
        }}
      >
        {chat.map((entry, index) => (
          <div
            key={index}
            style={{
              marginBottom: '10px',
              padding: '8px',
              borderRadius: '10px',
              background: entry.sender === 'You' ? '#e3f2fd' : '#f5f5f5',
              alignSelf: entry.sender === 'You' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              marginLeft: entry.sender === 'You' ? 'auto' : '0',
              marginRight: entry.sender === 'You' ? '0' : 'auto',
            }}
          >
            <strong>{entry.sender}:</strong> {entry.content}
            <div style={{ marginTop: '5px' }}>
              {entry.reactions?.map((reaction, i) => (
                <span key={i} style={{ marginRight: '5px' }}>
                  {reaction}
                </span>
              ))}
              <button
                onClick={() => setShowEmojiPicker(index)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                😊
              </button>
              {showEmojiPicker === index && (
                <div style={{ position: 'absolute', zIndex: 100 }}>
                  <EmojiPicker onEmojiClick={(emoji) => addReaction(index, emoji)} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            ref={messageInputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          />
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            style={{
              position: 'absolute',
              left: '300px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            😊
          </button>
          {showEmojiPicker && (
            <div style={{ position: 'absolute', bottom: '40px', right: '0', zIndex: 100 }}>
              <EmojiPicker onEmojiClick={addEmojiToMessage} />
            </div>
          )}
        </div>
        <button
          onClick={sendMessage}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            background: '#007bff',
            color: '#fff',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background 0.3s ease',
          }}
          onMouseOver={(e) => (e.target.style.background = '#0056b3')}
          onMouseOut={(e) => (e.target.style.background = '#007bff')}
        >
          Send ✉️
        </button>
      </div>
    </div>
  );
};

export default Chat;