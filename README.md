# @astermind/chatbot-template

Embeddable chatbot widget for AsterMind RAG - a drop-in chat UI that connects to your AsterMind backend.

[![npm version](https://img.shields.io/npm/v/@astermind/chatbot-template.svg)](https://www.npmjs.com/package/@astermind/chatbot-template)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **React Components**: Pre-built, customizable chat UI components
- **Vanilla JS Bundle**: Drop-in script tag integration for non-React sites
- **Theming System**: CSS custom properties for complete visual customization
- **Streaming Responses**: Real-time token-by-token message display
- **Offline Support**: Graceful degradation when connection is lost
- **Agentic UI**: Action cards for confirming agent actions
- **Source Citations**: Collapsible source references for RAG responses

## Installation

### NPM (React Projects)

```bash
npm install @astermind/chatbot-template
```

### CDN (Vanilla JS)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@astermind/chatbot-template/dist/astermind-chatbot.css">
<script src="https://cdn.jsdelivr.net/npm/@astermind/chatbot-template/dist/astermind-chatbot.min.js"></script>
```

## Quick Start

### React Usage

```tsx
import { ChatbotWidget } from '@astermind/chatbot-template';
import '@astermind/chatbot-template/styles';

function App() {
  return (
    <ChatbotWidget
      apiUrl="https://your-api-url.com"
      apiKey="your-api-key"
      position="bottom-right"
      greeting="Hi! How can I help you today?"
    />
  );
}
```

### Vanilla JS Usage

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@astermind/chatbot-template/dist/astermind-chatbot.css">
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/@astermind/chatbot-template/dist/astermind-chatbot.min.js"></script>
  <script>
    AsterMindChatbot.init({
      apiUrl: 'https://your-api-url.com',
      apiKey: 'am_your-api-key',
      position: 'bottom-right',
      greeting: 'Hi! How can I help you today?'
    });
  </script>
</body>
</html>
```

## Configuration

### Required Options

| Option | Type | Description |
|--------|------|-------------|
| `apiKey` | `string` | Your AsterMind API key |
| `apiUrl` | `string` | Backend API URL (e.g., `https://api.example.com`) |

### Optional Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Widget position on screen |
| `greeting` | `string` | `'Hi! How can I help you today?'` | Initial greeting message |
| `placeholder` | `string` | `'Type your message...'` | Input placeholder text |
| `headerTitle` | `string` | `'AsterMind'` | Chat window header title |
| `headerSubtitle` | `string` | `'AI Assistant'` | Chat window header subtitle |
| `defaultOpen` | `boolean` | `false` | Start with chat window open |
| `showPoweredBy` | `boolean` | `true` | Show "Powered by AsterMind" badge |
| `zIndex` | `number` | `9999` | Z-index for the widget |

### Theme Options

Customize the appearance via the `theme` object:

```javascript
{
  theme: {
    primaryColor: '#4F46E5',      // Primary brand color
    primaryHover: '#4338CA',      // Primary color on hover
    backgroundColor: '#ffffff',   // Background color
    surfaceColor: '#f3f4f6',      // Surface/card background
    textColor: '#1f2937',         // Primary text color
    textMuted: '#6b7280',         // Muted/secondary text
    borderColor: '#e5e7eb',       // Border color
    userBubbleBackground: '#4F46E5',  // User message background
    userBubbleText: '#ffffff',    // User message text
    botBubbleBackground: '#f3f4f6',   // Bot message background
    botBubbleText: '#1f2937',     // Bot message text
    widgetWidth: '380px',         // Widget width
    widgetHeight: '520px',        // Widget height
    bubbleSize: '60px',           // Trigger bubble size
    borderRadius: '12px',         // Border radius
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: '14px',
    shadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
  }
}
```

### Agent Configuration

Enable agentic capabilities:

```javascript
{
  agent: {
    enabled: true,
    confidenceThreshold: 0.8,     // Minimum confidence for auto-execution
    siteMap: [
      { path: '/products', name: 'Products', description: 'View products' },
      { path: '/contact', name: 'Contact', description: 'Contact us' }
    ],
    customActions: {
      openModal: async (params) => {
        // Custom action handler
      }
    }
  }
}
```

### Fallback Configuration

Configure offline behavior:

```javascript
{
  fallback: {
    enabled: true,
    message: 'Working in offline mode'
  }
}
```

### Event Callbacks

| Callback | Parameters | Description |
|----------|------------|-------------|
| `onReady` | `()` | Called when widget is ready |
| `onMessage` | `(message: ChatMessage)` | Called on each message sent/received |
| `onAction` | `(action: AgentAction)` | Called when an agentic action occurs |
| `onError` | `(error: Error)` | Called when an error occurs |
| `onToggle` | `(isOpen: boolean)` | Called when widget opens/closes |

## Connecting to AsterMind Backend

### API Endpoints

The chatbot template connects to these backend endpoints:

1. **Health Check**: `GET /api/external/health`
   - Used to verify connection status
   - Headers: `X-API-Key: your-api-key`

2. **Chat (Non-streaming)**: `POST /api/external/chat`
   - Request body: `{ message: string, sessionId?: string }`
   - Headers: `Content-Type: application/json`, `X-API-Key: your-api-key`
   - Response: `{ reply: string, sessionId: string, sources?: Source[] }`

3. **Chat (Streaming)**: `POST /api/external/chat/stream`
   - Request body: `{ message: string, sessionId?: string }`
   - Headers: `Content-Type: application/json`, `X-API-Key: your-api-key`
   - Response: Server-Sent Events (SSE) with chunks

### SSE Event Format

The streaming endpoint sends events in this format:

```
data: {"type": "chunk", "content": "Hello"}
data: {"type": "chunk", "content": " there"}
data: {"type": "sources", "sources": [...]}
data: {"type": "done", "sessionId": "sess_xxx"}
data: {"type": "error", "error": "Error message"}
```

### Backend Setup

Ensure your AsterMind backend has the external API routes enabled:

```typescript
// In your Express server
import { setupExternalApiRoutes } from './api/routes/externalApi';

app.use('/api/external', externalApiRoutes);
```

## React Hooks

For advanced customization, use the provided hooks:

### useOmega

Direct API client access:

```tsx
import { useOmega } from '@astermind/chatbot-template';

function MyComponent() {
  const {
    sendMessage,
    sendMessageStream,
    connectionStatus,
    isProcessing,
    lastError,
    sessionId,
    clearSession
  } = useOmega({
    apiUrl: 'https://api.example.com',
    apiKey: 'your-api-key'
  });

  const handleSend = async () => {
    const response = await sendMessage('Hello');
    console.log(response.reply);
  };
}
```

### useChat

Chat state management:

```tsx
import { useChat } from '@astermind/chatbot-template';

function MyComponent() {
  const {
    messages,
    addMessage,
    updateMessage,
    clearMessages,
    pendingAction,
    setPendingAction
  } = useChat();
}
```

### useTheme

Theme customization:

```tsx
import { useTheme } from '@astermind/chatbot-template';

function MyComponent() {
  const { theme, cssVariables } = useTheme({
    primaryColor: '#10B981'
  });
}
```

## Components

All components are exported for custom compositions:

```tsx
import {
  ChatbotWidget,    // Main widget
  ChatBubble,       // Floating trigger button
  ChatWindow,       // Chat window container
  ChatHeader,       // Window header
  ChatInput,        // Message input
  MessageList,      // Message container
  MessageBubble,    // Individual message
  ActionCard,       // Agentic action card
  SourceCitation,   // Source references
  StatusIndicator,  // Connection status
  TypingIndicator   // Typing animation
} from '@astermind/chatbot-template';
```

## CSS Customization

### Using CSS Variables

Override CSS variables in your stylesheet:

```css
:root {
  --astermind-primary: #10B981;
  --astermind-primary-hover: #059669;
  --astermind-border-radius: 16px;
}
```

### CSS Classes

All elements use the `astermind-` prefix:

- `.astermind-chatbot` - Main container
- `.astermind-bubble` - Trigger button
- `.astermind-window` - Chat window
- `.astermind-header` - Window header
- `.astermind-messages` - Message list
- `.astermind-message` - Individual message
- `.astermind-input` - Input area
- `.astermind-status` - Status indicator

## Build Outputs

| File | Format | Description |
|------|--------|-------------|
| `astermind-chatbot.esm.js` | ESM | ES Module for bundlers |
| `astermind-chatbot.umd.js` | UMD | Universal Module Definition |
| `astermind-chatbot.min.js` | IIFE | Standalone bundle with React included |
| `astermind-chatbot.css` | CSS | Compiled styles |

## Development

### Building

```bash
npm run build
```

### Type Checking

```bash
npm run typecheck
```

### Development Mode

```bash
npm run dev
```

### Running Tests

```bash
npm run test
```

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

MIT License - see [LICENSE](LICENSE) for details.
