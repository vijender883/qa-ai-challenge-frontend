import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

const ChatApp = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hello! I'm your AI assistant. I can help you with a wide range of tasks including:

🛫 **Travel & Booking** - Flight reservations, hotel bookings, train tickets
🍕 **Food Orders** - Restaurant reservations, food delivery, meal planning
🚗 **Transportation** - Cab bookings, ride sharing, travel arrangements
📅 **Appointments** - Meeting scheduling, doctor visits, calendar management
🎵 **Entertainment** - Music, movies, games, and media recommendations
🛒 **Shopping** - Product search, online purchases, price comparisons
⏰ **Reminders** - Alerts, notifications, task management
ℹ️ **Information** - Weather, facts, general questions, research
📋 **Calendar & Scheduling** - Event planning, time management
📱 **Communication** - Messages, calls, emails, contact management

What would you like me to help you with today?`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: data.response,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: "Sorry, I'm having trouble connecting to the server. Please try again.",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'Arial, sans-serif'}}>
      <div style={{maxWidth: '1024px', margin: '0 auto', padding: '24px'}}>
        <div style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', height: '600px', display: 'flex', flexDirection: 'column'}}>
          <div style={{padding: '16px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb', borderRadius: '8px 8px 0 0'}}>
            <h2 style={{fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0'}}>AI Assistant Chat</h2>
            <p style={{fontSize: '14px', color: '#6b7280', margin: 0}}>Enter your prompts and observe the AI responses</p>
          </div>
          <div style={{flex: 1, overflowY: 'auto', padding: '16px'}}>
            {messages.map((message) => (
              <div key={message.id} style={{display: 'flex', justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start', marginBottom: '16px'}}>
                <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px', maxWidth: '80%', flexDirection: message.type === 'user' ? 'row-reverse' : 'row'}}>
                  <div style={{
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: message.type === 'user' ? '#3b82f6' : '#d1d5db'
                  }}>
                    {message.type === 'user' ? <User size={16} color="white" /> : <Bot size={16} color="#374151" />}
                  </div>
                  <div style={{
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: message.type === 'user' ? '#3b82f6' : '#f3f4f6',
                    color: message.type === 'user' ? 'white' : '#1f2937'
                  }}>
                    <p style={{fontSize: '14px', margin: '0 0 4px 0', whiteSpace: 'pre-wrap', textAlign: message.type === 'user' ? 'right' : 'left'}}>{message.content}</p>
                    <p style={{
                      fontSize: '12px', 
                      margin: 0,
                      color: message.type === 'user' ? 'rgba(255,255,255,0.7)' : '#6b7280'
                    }}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{display: 'flex', justifyContent: 'flex-start', marginBottom: '16px'}}>
                <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px', maxWidth: '80%'}}>
                  <div style={{
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: '#d1d5db'
                  }}>
                    <Bot size={16} color="#374151" />
                  </div>
                  <div style={{backgroundColor: '#f3f4f6', padding: '12px', borderRadius: '8px'}}>
                    <div style={{display: 'flex', gap: '4px'}}>
                      <div style={{width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%'}}></div>
                      <div style={{width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%'}}></div>
                      <div style={{width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div style={{padding: '16px', borderTop: '1px solid #e5e7eb'}}>
            <div style={{display: 'flex', gap: '8px'}}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  fontSize: '14px'
                }}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                style={{
                  padding: '8px 24px',
                  backgroundColor: isLoading || !inputValue.trim() ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px'
                }}
              >
                <Send size={16} />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;