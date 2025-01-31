import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useWebSocket } from './WebSocketProvider';

const Chat = () => {
  const { id: recipientID } = useParams(); // Gets recipient ID from the URL
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');
  const { socket, connectWebSocket } = useWebSocket(); // Access WebSocket context
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [recipient, setRecipient] = useState('');
  const messageInputRef = useRef();
  const receiverName = localStorage.getItem('receiverName');
  
  // Utility function to find a user's name by ID
  const findNameById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/profile/patient/${id}`);
      setRecipient(id);
      return response.data.name; // Return the patient's name
    } catch (error) {
      console.error('Patient not found', error);
      return 'Unknown User';
    }
  };

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
      if (autoRecipient !== undefined ){
        setRecipient(autoRecipient);
      }
      
    } else if (userRole === 'patient') {
      // Patients should see the doctor as the recipient
      setRecipient(recipientID); // Ensure the recipient is the doctor
    }
  }, [userRole, recipientID]);

  // Handle incoming messages
  useEffect(() => {

    if (!socket) return;

    const handleMessage = (event) => {
      const messageData = JSON.parse(event.data);
      const { sender, content, notification } = messageData;

      if (userRole === 'doctor') {
        setRecipient(sender);
        if (sender !== undefined ){
          localStorage.setItem('msgSender', sender);
        }
        const senderName =  findNameById(sender); // Get the patient's name
        setRecipient(localStorage.getItem('msgSender'))
      }

      if (notification) {
        alert(notification); // Notify the user
      } else {
        setChat((prevChat) => [
          ...prevChat,
          { sender: sender || 'System', content },
        ]);
      }
    };

    socket.addEventListener('message', handleMessage);
    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [userRole,socket]);

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
      setChat((prevChat) => [...prevChat, { sender: 'You', content: message }]);
      setMessage('');
      messageInputRef.current.focus();
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', paddingTop: '70px' }}>
      <h2>{userRole === 'doctor' ? 'Doctor Chat' : 'Patient Chat'}</h2>
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
        {userRole === 'patient' && <p>Recipient: {receiverName}</p>}
      </div>
      <div
        style={{
          height: '200px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '10px',
        }}
      >
        {chat.map((entry, index) => (
          <div key={index}>
            <strong>{entry.sender}:</strong> {entry.content}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '10px' }}>
        <input
          type="text"
          ref={messageInputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          style={{ width: '80%' }}
        />
        <button onClick={sendMessage} style={{ marginLeft: '5px' }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;