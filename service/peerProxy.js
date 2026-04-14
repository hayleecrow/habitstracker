const { WebSocketServer, WebSocket } = require('ws');

function peerProxy(httpServer) {
    const socketServer = new WebSocketServer({ server: httpServer });

    socketServer.on('connection', (ws) => {
        console.log('Peer connected');
        ws.isAlive = true;

        //
        ws.on('message', (message) => {
            // Broadcast the message to all other connected clients
            socketServer.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        });


        // Respond to pong messages by marking the connection alive
        ws.on('pong', () => {
            ws.isAlive = true;
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
}

module.exports = { peerProxy };