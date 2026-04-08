/**
 * friendNotifier.js - Singleton WebSocket manager for real-time friend event notifications
 * Handles connection, registration, and notification delivery only
 */

let ws = null;
const subscribers = new Set(); // Callbacks that listen for notifications
let username = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000;

/**
 * Initialize WebSocket connection with username
 */
export function initNotifier(userUsername) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        console.log('friendNotifier already initialized');
        return;
    }

    username = userUsername;

    try {
        // Determine WebSocket URL based on environment
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const wsUrl = `${protocol}//${host}`;

        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('WebSocket connected for notifications');
            reconnectAttempts = 0;
            
            // Register with server on connection (just username, no friends list initially)
            sendMessage({
                type: 'register',
                username: username,
                friends: []
            });
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // Broadcast to all subscribers
                subscribers.forEach(callback => {
                    callback(data);
                });
            } catch (err) {
                console.error('Error parsing notification message:', err);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            attemptReconnect();
        };
    } catch (err) {
        console.error('Error initializing WebSocket:', err);
    }
}

/**
 * Attempt to reconnect if connection drops
 */
function attemptReconnect() {
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
        setTimeout(() => {
            if (username) {
                initNotifier(username);
            }
        }, RECONNECT_DELAY);
    } else {
        console.error('Max reconnection attempts reached');
    }
}

/**
 * Subscribe a callback to receive notifications
 */
export function onNotification(callback) {
    subscribers.add(callback);
    console.log(`Notification subscriber added. Total subscribers: ${subscribers.size}`);
}

/**
 * Unsubscribe a callback from receiving notifications
 */
export function unsubscribe(callback) {
    subscribers.delete(callback);
    console.log(`Notification subscriber removed. Total subscribers: ${subscribers.size}`);
}

/**
 * Update friends list on WebSocket connection
 */
export function updateFriends(friendsList) {
    const friendNames = friendsList.map(friend => friend.name || friend);
    sendMessage({
        type: 'updateFriends',
        friends: friendNames
    });
    console.log(`Friends list updated on WebSocket: ${friendNames.join(', ')}`);
}

/**
 * Send message through WebSocket
 */
function sendMessage(data) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    } else {
        console.warn('WebSocket not connected, cannot send message:', data);
    }
}

/**
 * Close WebSocket connection
 */
export function closeConnection() {
    if (ws) {
        ws.close();
        ws = null;
        username = null;
        subscribers.clear();
        console.log('WebSocket connection closed');
    }
}

/**
 * Get current connection status
 */
export function isConnected() {
    return ws && ws.readyState === WebSocket.OPEN;
}
