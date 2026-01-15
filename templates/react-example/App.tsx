// React Example - AsterMind Chatbot Integration
// This example shows how to use the chatbot widget in a React application

import { useState } from 'react';
import { ChatbotWidget, useOmega, useChat } from '@astermind/chatbot-template';
import '@astermind/chatbot-template/styles';

// Configuration - replace with your actual values
const API_URL = 'https://your-api-url.com';
const API_KEY = 'your-api-key';

/**
 * Basic Integration Example
 *
 * Simply drop in the ChatbotWidget component with your API credentials.
 */
export function BasicExample() {
  return (
    <div className="app">
      <h1>Basic Chatbot Integration</h1>
      <p>Click the chat bubble in the bottom-right corner to open the chat.</p>

      <ChatbotWidget
        apiUrl={API_URL}
        apiKey={API_KEY}
        position="bottom-right"
        greeting="Hello! How can I assist you today?"
        placeholder="Type your question..."
        headerTitle="Support Assistant"
        headerSubtitle="We're here to help"
        onReady={() => console.log('Chatbot ready!')}
        onMessage={(msg) => console.log('Message:', msg)}
      />
    </div>
  );
}

/**
 * Themed Example
 *
 * Customize the chatbot appearance to match your brand.
 */
export function ThemedExample() {
  return (
    <div className="app">
      <h1>Themed Chatbot</h1>

      <ChatbotWidget
        apiUrl={API_URL}
        apiKey={API_KEY}
        position="bottom-right"
        theme={{
          primaryColor: '#10B981',      // Emerald green
          primaryHover: '#059669',
          userBubbleBackground: '#10B981',
          borderRadius: '16px',
          fontFamily: "'Poppins', sans-serif"
        }}
        greeting="Welcome! What can I help you with?"
        headerTitle="Green Assistant"
      />
    </div>
  );
}

/**
 * Agentic Example
 *
 * Enable agentic capabilities for navigation and actions.
 */
export function AgenticExample() {
  const handleAction = (action: any) => {
    console.log('Action requested:', action);

    // Handle navigation
    if (action.type === 'navigate' && action.status === 'executed') {
      window.location.href = action.target;
    }
  };

  return (
    <div className="app">
      <h1>Agentic Chatbot</h1>
      <p>The chatbot can help navigate and perform actions on your site.</p>

      <ChatbotWidget
        apiUrl={API_URL}
        apiKey={API_KEY}
        agent={{
          enabled: true,
          confidenceThreshold: 0.8,
          siteMap: [
            { path: '/dashboard', name: 'Dashboard', description: 'View your dashboard' },
            { path: '/settings', name: 'Settings', description: 'Manage account settings' },
            { path: '/profile', name: 'Profile', description: 'Edit your profile' },
            { path: '/help', name: 'Help Center', description: 'Get help and support' }
          ]
        }}
        onAction={handleAction}
      />
    </div>
  );
}

/**
 * Custom Hook Example
 *
 * Build a completely custom chat UI using the provided hooks.
 */
export function CustomChatExample() {
  const [input, setInput] = useState('');
  const { messages, addMessage, clearMessages } = useChat();
  const {
    sendMessage,
    connectionStatus,
    isProcessing
  } = useOmega({
    apiUrl: API_URL,
    apiKey: API_KEY
  });

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user' as const,
      content: input,
      timestamp: new Date()
    };
    addMessage(userMessage);
    setInput('');

    try {
      // Get response
      const response = await sendMessage(input);

      // Add bot response
      addMessage({
        id: `bot-${Date.now()}`,
        role: 'assistant' as const,
        content: response.reply,
        timestamp: new Date(),
        sources: response.sources,
        confidence: response.confidence
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="custom-chat">
      <div className="custom-chat__header">
        <h2>Custom Chat UI</h2>
        <span className={`status status--${connectionStatus}`}>
          {connectionStatus}
        </span>
        <button onClick={clearMessages}>Clear</button>
      </div>

      <div className="custom-chat__messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`custom-message custom-message--${msg.role}`}
          >
            <p>{msg.content}</p>
            {msg.sources && msg.sources.length > 0 && (
              <div className="custom-message__sources">
                <small>Sources: {msg.sources.length}</small>
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="custom-message custom-message--loading">
            <p>Thinking...</p>
          </div>
        )}
      </div>

      <div className="custom-chat__input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          disabled={isProcessing}
        />
        <button
          onClick={handleSend}
          disabled={isProcessing || !input.trim()}
        >
          Send
        </button>
      </div>

      <style>{`
        .custom-chat {
          max-width: 600px;
          margin: 0 auto;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }

        .custom-chat__header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .custom-chat__header h2 {
          flex: 1;
          margin: 0;
          font-size: 18px;
        }

        .status {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
        }

        .status--online { background: #d1fae5; color: #065f46; }
        .status--offline { background: #fef3c7; color: #92400e; }
        .status--connecting { background: #dbeafe; color: #1e40af; }
        .status--error { background: #fee2e2; color: #991b1b; }

        .custom-chat__messages {
          height: 400px;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .custom-message {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 12px;
        }

        .custom-message p {
          margin: 0;
        }

        .custom-message--user {
          align-self: flex-end;
          background: #4F46E5;
          color: white;
        }

        .custom-message--assistant {
          align-self: flex-start;
          background: #f3f4f6;
        }

        .custom-message--loading {
          align-self: flex-start;
          background: #f3f4f6;
          font-style: italic;
          color: #6b7280;
        }

        .custom-message__sources {
          margin-top: 8px;
          color: #6b7280;
        }

        .custom-chat__input {
          display: flex;
          gap: 8px;
          padding: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .custom-chat__input input {
          flex: 1;
          padding: 10px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          outline: none;
        }

        .custom-chat__input input:focus {
          border-color: #4F46E5;
        }

        .custom-chat__input button {
          padding: 10px 20px;
          background: #4F46E5;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
        }

        .custom-chat__input button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

/**
 * Main App Component
 *
 * Shows all examples. In a real app, you'd use just one approach.
 */
function App() {
  const [example, setExample] = useState<'basic' | 'themed' | 'agentic' | 'custom'>('basic');

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>AsterMind Chatbot - React Examples</h1>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ marginRight: '12px' }}>Select Example:</label>
        <select
          value={example}
          onChange={(e) => setExample(e.target.value as any)}
          style={{ padding: '8px 12px', borderRadius: '6px' }}
        >
          <option value="basic">Basic Integration</option>
          <option value="themed">Themed</option>
          <option value="agentic">Agentic</option>
          <option value="custom">Custom UI (Hooks)</option>
        </select>
      </div>

      {example === 'basic' && <BasicExample />}
      {example === 'themed' && <ThemedExample />}
      {example === 'agentic' && <AgenticExample />}
      {example === 'custom' && <CustomChatExample />}
    </div>
  );
}

export default App;
