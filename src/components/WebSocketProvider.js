import React, { createContext, useContext, useState, useEffect } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const connectWebSocket = (userId) => {
    if (socket) {
      console.log('WebSocket already connected');
      return;
    }

    const ws = new WebSocket('ws://localhost:5000');

    ws.onopen = () => {
      console.log('WebSocket connection opened');
      ws.send(JSON.stringify({ type: 'register', sender: userId }));
    };

    ws.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      if (messageData.type === 'status') {
        console.log('Status received:', messageData.status);
      } else {
        console.log('Message received:', event.data);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      // Implement reconnection logic
      setTimeout(() => connectWebSocket(userId), 3000); // Retry every 3 seconds
    };

    setSocket(ws);
  };

  const disconnectWebSocket = () => {
    if (socket) {
        console.log('Closing WebSocket connection');
        socket.close();
        setSocket(null);
    }
  };

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  return (
    <WebSocketContext.Provider value={{ socket, connectWebSocket, disconnectWebSocket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
