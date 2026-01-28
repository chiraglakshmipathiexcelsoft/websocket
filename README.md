# WebSocket API Examples

This package contains complete WebSocket implementations including a server, Node.js client, and browser client.

## 📁 Files Included

- `websocket-server.js` - Node.js WebSocket server
- `websocket-client.js` - Node.js WebSocket client
- `websocket-client.html` - Browser-based WebSocket client with UI
- `README.md` - This file

## 🚀 Quick Start

### Prerequisites

```bash
npm install ws
```

### Running the Server

```bash
node websocket-server.js
```

The server will start on `ws://localhost:8080`

### Running the Node.js Client

In a new terminal:

```bash
node websocket-client.js
```

### Running the Browser Client

Open `websocket-client.html` in your web browser. The interface allows you to:
- Connect/disconnect from the server
- Send messages
- View received messages in real-time
- Clear message history

## 📡 WebSocket Server API

### Connection

**Endpoint:** `ws://localhost:8080`

### Events

#### Server → Client

**Welcome Message** (on connection)
```json
{
  "type": "welcome",
  "message": "Connected to WebSocket server",
  "timestamp": "2026-01-28T10:30:00.000Z"
}
```

**Echo Response**
```json
{
  "type": "echo",
  "original": { /* your original message */ },
  "timestamp": "2026-01-28T10:30:00.000Z"
}
```

**Broadcast Message** (sent to other clients)
```json
{
  "type": "broadcast",
  "message": { /* message from another client */ },
  "timestamp": "2026-01-28T10:30:00.000Z"
}
```

**Error Message**
```json
{
  "type": "error",
  "message": "Invalid JSON format"
}
```

#### Client → Server

Send JSON messages in any format. Example:
```json
{
  "type": "message",
  "content": "Hello, server!",
  "timestamp": "2026-01-28T10:30:00.000Z"
}
```

### Features

- **Auto-reconnect:** Clients can implement reconnection logic
- **Ping/Pong:** Server sends periodic pings every 30 seconds to keep connection alive
- **Broadcasting:** Messages are broadcast to all connected clients
- **Error Handling:** Comprehensive error handling for malformed messages
- **Graceful Shutdown:** Proper cleanup on server shutdown (CTRL+C)

## 💻 Usage Examples

### Browser JavaScript

```javascript
// Connect to server
const ws = new WebSocket('ws://localhost:8080');

// Connection opened
ws.addEventListener('open', (event) => {
    console.log('Connected to server');
    ws.send(JSON.stringify({ message: 'Hello Server!' }));
});

// Listen for messages
ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    console.log('Message from server:', data);
});

// Handle errors
ws.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
});

// Connection closed
ws.addEventListener('close', (event) => {
    console.log('Disconnected from server');
});
```

### Node.js

```javascript
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
    console.log('Connected');
    ws.send(JSON.stringify({ message: 'Hello!' }));
});

ws.on('message', (data) => {
    console.log('Received:', data.toString());
});

ws.on('error', (error) => {
    console.error('Error:', error);
});

ws.on('close', () => {
    console.log('Connection closed');
});
```

### Python (using websockets library)

```python
import asyncio
import websockets
import json

async def client():
    uri = "ws://localhost:8080"
    async with websockets.connect(uri) as websocket:
        # Send message
        await websocket.send(json.dumps({
            "type": "message",
            "content": "Hello from Python!"
        }))
        
        # Receive message
        response = await websocket.recv()
        print(f"Received: {response}")

asyncio.run(client())
```

## 🔧 Customization

### Changing the Port

In `websocket-server.js`:
```javascript
const wss = new WebSocket.Server({ port: 3000 }); // Change to your port
```

### Adding Authentication

```javascript
wss.on('connection', (ws, req) => {
    const token = new URL(req.url, 'ws://localhost').searchParams.get('token');
    
    if (token !== 'your-secret-token') {
        ws.close(1008, 'Unauthorized');
        return;
    }
    
    // Continue with normal connection handling
});
```

### Message Validation

```javascript
ws.on('message', (data) => {
    try {
        const message = JSON.parse(data);
        
        // Validate required fields
        if (!message.type || !message.content) {
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Missing required fields'
            }));
            return;
        }
        
        // Process valid message
        // ...
    } catch (error) {
        ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format'
        }));
    }
});
```

## 🛡️ Best Practices

1. **Always validate incoming messages** - Never trust client input
2. **Implement rate limiting** - Prevent abuse from malicious clients
3. **Use WSS (WebSocket Secure)** - For production environments, use SSL/TLS
4. **Handle connection drops** - Implement reconnection logic on the client
5. **Set message size limits** - Prevent memory issues from large messages
6. **Implement authentication** - Secure your WebSocket endpoints
7. **Monitor connections** - Track active connections and clean up properly

## 📊 Connection States

WebSocket connections have 4 states:

- `CONNECTING` (0) - Connection is being established
- `OPEN` (1) - Connection is established and ready
- `CLOSING` (2) - Connection is being closed
- `CLOSED` (3) - Connection is closed

Check state before sending:
```javascript
if (ws.readyState === WebSocket.OPEN) {
    ws.send('message');
}
```

## 🐛 Troubleshooting

**Connection Refused**
- Ensure the server is running
- Check firewall settings
- Verify the correct port is being used

**Messages Not Sending**
- Check connection state
- Verify JSON format
- Check server logs for errors

**Disconnections**
- Implement ping/pong to keep connection alive
- Check network stability
- Verify server timeout settings

## 📚 Additional Resources

- [WebSocket API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [ws Library Documentation](https://github.com/websockets/ws)
- [WebSocket Protocol RFC](https://tools.ietf.org/html/rfc6455)

## 🔐 Production Deployment

For production use, consider:

1. Use WSS (WebSocket Secure) with SSL certificates
2. Implement proper authentication and authorization
3. Add rate limiting and DDoS protection
4. Use a reverse proxy (nginx, Apache)
5. Monitor connection metrics
6. Implement logging and error tracking
7. Scale horizontally with load balancers

### Example with Express + WSS

```javascript
const express = require('express');
const https = require('https');
const WebSocket = require('ws');
const fs = require('fs');

const app = express();

const server = https.createServer({
    cert: fs.readFileSync('/path/to/cert.pem'),
    key: fs.readFileSync('/path/to/key.pem')
}, app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    // Your connection logic
});

server.listen(8080);
```

## 📝 License

These examples are provided as-is for educational purposes.
