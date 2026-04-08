const { WebSocketServer, WebSocket } = require('ws');

function peerProxy(httpServer) {
    const socketServer = new WebSocketServer({ server: httpServer });
    
    // Track connected users and their friend lists
    const userConnections = new Map(); // userId -> { ws, friends: Set }

    socketServer.on('connection', (ws) => {
        console.log('Peer connected');
        ws.isAlive = true;
        let userId = null;

        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                
                // Handle registration message with username and friends list
                if (data.type === 'register') {
                    userId = data.username;
                    const friends = new Set(data.friends || []);
                    userConnections.set(userId, { ws, friends });
                    console.log(`User ${userId} registered with ${friends.size} friends`);
                    return;
                }
                
                // Handle friends list update
                if (data.type === 'updateFriends') {
                    if (userConnections.has(userId)) {
                        userConnections.get(userId).friends = new Set(data.friends || []);
                    }
                    return;
                }
                
                // Handle event broadcasts - only send to users who have the originator as a friend
                if (data.type && (data.type === 'habitComplete' || data.type === 'habitAdded' || data.type === 'habitDeleted' || data.type === 'streakLost')) {
                    const fromUserId = data.fromUserId;
                    // Find all connected users who have fromUserId in their friends list
                    for (const [cUserId, cData] of userConnections) {
                        if (cData.friends.has(fromUserId) && cData.ws.readyState === WebSocket.OPEN) {
                            cData.ws.send(JSON.stringify(data));
                        }
                    }
                    return;
                }

                // Fallback: broadcast to all other clients (for backward compatibility)
                socketServer.clients.forEach((client) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(message);
                    }
                });
            } catch (err) {
                console.error('Error parsing WebSocket message:', err);
            }
        });

        // Respond to pong messages by marking the connection alive
        ws.on('pong', () => {
            ws.isAlive = true;
        });
        
        // Cleanup on disconnect
        ws.on('close', () => {
            if (userId && userConnections.has(userId)) {
                userConnections.delete(userId);
                console.log(`User ${userId} disconnected`);
            }
        });
    });

    // Periodically send out a ping message to make sure clients are alive
    setInterval(() => {
        socketServer.clients.forEach(function each(client) {
        if (client.isAlive === false) return client.terminate();

        client.isAlive = false;
        client.ping();
        });
    }, 10000);

    return socketServer;
}

module.exports = { peerProxy };