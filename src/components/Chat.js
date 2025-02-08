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
      const { sender, content, notification } = messageData;

      if (userRole === 'doctor') {
        setRecipient(sender);
        if (sender !== undefined ){
          localStorage.setItem('msgSender', sender);
        }
        setRecipient(localStorage.getItem('msgSender'))
      }

      if (notification) {
        alert(notification); // Notify the user
      } else {
        // Fetch the sender's name
        const senderName = await findNameById(sender);
        // Update chat with the sender's name
        setChat((prevChat) => [
          ...prevChat,
          { sender: senderName || 'System', content },
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
        { sender: 'You', content: message },
      ]);
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
        {userRole === 'patient' && <p>To : {receiverName}</p>}
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
          style={{ width: '98%' }}
        />
        <button onClick={sendMessage} style={{ marginLeft: '2px', width: '98%', height:'35px', backgroundColor: 'blue'}}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;