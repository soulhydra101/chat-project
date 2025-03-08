import React, { useState, useEffect } from 'react';
import './App.css'; // Assuming your CSS file is named App.css

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');

    const fetchMessages = async () => {
        try {
            const response = await fetch('http://localhost:5000/messages');
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async () => {
        try {
            await fetch('http://localhost:5000/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user, message }),
            });

            // Clear the message input after sending
            setMessage('');
            // Fetch messages to update the list
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
        // Fetch messages on component mount
        fetchMessages();
        // Poll for new messages every 2 seconds
        const interval = setInterval(() => {
            fetchMessages();
        }, 2000);

        return () => clearInterval(interval);
    }, []); // Run only once on mount

    return (
        <div className="App">
            <h2 className="header">Chat Room</h2>
            <div className="chat-container">
                <ul>
                    {messages.map((msg) => (
                        <li
                            key={msg._id}
                            className={msg.user === user ? 'user-message' : 'other-message'}
                        >
                            <strong>{msg.user}:</strong> {msg.message}
                            <div className="timestamp">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="chat-input-container">
                <input
                    type="text"
                    placeholder="Your name"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatRoom;
