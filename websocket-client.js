// WebSocket Client Example (Node.js)
// Install: npm install ws

const WebSocket = require('ws');

// Connect to WebSocket server
const ws = new WebSocket('ws://localhost:8080');

// Connection opened
ws.on('open', () => {
    console.log('Connected to WebSocket server');
    
    // Send a message to the server
    ws.send(JSON.stringify({
        type: 'greeting',
        message: 'Hello from Node.js client',
        clientId: 'nodejs-client-' + Date.now()
    }));
    
    // Send messages periodically
    let messageCount = 0;
    const messageInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            messageCount++;
            ws.send(JSON.stringify({
                type: 'update',
                message: `Message #${messageCount}`,
                timestamp: new Date().toISOString()
            }));
            console.log(`Sent message #${messageCount}`);
        }
    }, 5000); // Every 5 seconds
    
    // Clean up interval on close
    ws.on('close', () => {
        clearInterval(messageInterval);
    });
});

// Listen for messages from server
ws.on('message', (data) => {
    try {
        const message = JSON.parse(data);
        console.log('Received from server:', message);
    } catch (error) {
        console.log('Received (raw):', data.toString());
    }
});

// Handle errors
ws.on('error', (error) => {
    console.error('WebSocket error:', error.message);
});

// Connection closed
ws.on('close', () => {
    console.log('Disconnected from WebSocket server');
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\nClosing connection...');
    ws.close();
    process.exit(0);
});
