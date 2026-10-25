import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

// Backend Socket.IO URL – matches Docker Compose mapping (frontend at localhost:3000 proxies /api/ but socket connects directly)
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function Chat() {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.name || '');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('Connecting');
  const socketRef = useRef(null);

  // Initialise socket once on mount
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current = socket;
    socket.on('connect', () => setStatus('Connected'));
    socket.on('disconnect', () => setStatus('Disconnected'));
    socket.on('chatMessage', (msg) => setMessages((prev) => [...prev, msg]));
    return () => socket.disconnect();
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!username.trim() || !message.trim()) return;
    const payload = { username: username.trim(), text: message.trim() };
    socketRef.current.emit('chatMessage', payload);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 p-4">
      <h1 className="text-2xl font-bold mb-4 text-slate-800">HackSphere Live Chat</h1>
      <div className="mb-2 text-sm text-slate-600">
        Status: <span className={`font-medium ${status === 'Connected' ? 'text-green-600' : status === 'Connecting' ? 'text-yellow-600' : 'text-red-600'}`}>{status}</span>
      </div>
      <div className="flex-1 overflow-y-auto border border-slate-200 rounded-lg p-3 mb-4 bg-white">
        {messages.length === 0 ? (
          <p className="text-center text-slate-400">No messages yet…</p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className="mb-2">
              <span className="font-semibold text-slate-800">{msg.username}:</span>
              <span className="ml-2 text-slate-700">{msg.text}</span>
            </div>
          ))
        )}
      </div>
      <form onSubmit={sendMessage} className="flex flex-col gap-2">
        {/* Display logged‑in user name (read‑only) */}
        <label className="text-sm font-medium text-slate-600 mb-1">You are:</label>
        <input
          type="text"
          value={username}
          readOnly
          className="border border-slate-300 rounded px-3 py-2 bg-gray-100 text-slate-800 cursor-default"
        />
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
          Send
        </button>
      </form>
    </div>
  );
}
