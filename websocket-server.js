// WebSocket Server Example using Node.js
// Install: npm install ws

const WebSocket = require('ws');

// Create WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server started on ws://localhost:8080');

// Connection event handler
wss.on('connection', (ws, req) => {
    console.log('New client connected from:', req.socket.remoteAddress);
    
    // Send welcome message to connected client
    ws.send(JSON.stringify({
        type: 'welcome',
        message: 'Connected to WebSocket server',
        timestamp: new Date().toISOString()
    }));
    
    // Message event handler
    ws.on('message', (data) => {
        console.log('Received:', data.toString());
        
        try {
            const message = JSON.parse(data);
            
            // Echo the message back to client
            ws.send(JSON.stringify({
                type: 'echo',
                original: message,
                timestamp: new Date().toISOString()
            }));
            
            // Broadcast to all connected clients
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'broadcast',
                        message: message,
                        timestamp: new Date().toISOString()
                    }));
                }
            });
            
        } catch (error) {
            console.error('Error parsing message:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Invalid JSON format'
            }));
        }
    });
    
    // Error event handler
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
    
    // Close event handler
    ws.on('close', () => {
        console.log('Client disconnected');
    });
    
    // Send periodic ping to keep connection alive
    const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.ping();
        }
    }, 30000); // Every 30 seconds
    
    ws.on('pong', () => {
        console.log('Received pong from client');
    });
    
    ws.on('close', () => {
        clearInterval(pingInterval);
    });
});

// Handle server errors
wss.on('error', (error) => {
    console.error('Server error:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    wss.clients.forEach((client) => {
        client.close();
    });
    wss.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
