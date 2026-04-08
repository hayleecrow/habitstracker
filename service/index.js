const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const schedule = require('node-schedule');
const app = express();
const DB = require('./database.js');
const { peerProxy } = require('./peerProxy.js');

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

let socketServer = null; // Will be set by peerProxy

// Helper function to emit events and store notifications for users who have fromUser as friend
async function broadcastAndStoreEvent(fromUser, eventType, messageText) {
    try {
        const users = await DB.getAllUsers();
        
        // Find all users who have fromUser in their friends list
        for (const user of users) {
            if (user.friends && user.friends.some(friend => friend.name === fromUser)) {
                // Store notification in database
                await DB.addNotification(user.userName, fromUser, messageText);
                
                // Emit WebSocket event (peerProxy will handle filtering)
                if (socketServer) {
                    const wsEvent = JSON.stringify({
                        type: eventType,
                        fromUserId: fromUser
                    });
                    socketServer.clients.forEach((client) => {
                        if (client.readyState === 1) { // OPEN
                            client.send(wsEvent);
                        }
                    });
                }
            }
        }
    } catch (err) {
        console.error('Error in broadcastAndStoreEvent:', err);
    }
}

// This function will reset the completedToday field for all habits and increment the overall streak if the user completed their habits for the day
// 0 0 * * * corresponds to every day at midnight
const resetHabitsJob = schedule.scheduleJob('0 0 * * *', () => {
    console.log('It\'s midnight!!');
    resetHabits();
});

async function resetHabits() {
    const users = await DB.getAllUsers();
    for (const user of users) { 
        let lostHabits = [];
        
        if (user.habits.every(habit => habit.completedToday)) {
            user.overallStreak.completedToday = false;
        } else {
            user.overallStreak.value = 0;
            user.overallStreak.completedToday = false;
            
            // Collect habits that lost their streak
            for (const habit of user.habits) {
                if (!habit.completedToday) {
                    habit.streak = 0;
                    lostHabits.push(`${habit.emoji} ${habit.habitName}`);
                } else {
                    habit.completedToday = false;
                }
            }
            
            // Emit single streakLost event for all lost habits
            if (lostHabits.length > 0) {
                const message = `${user.userName} lost their streak on: ${lostHabits.join(', ')}`;
                await broadcastAndStoreEvent(user.userName, 'streakLost', message);
            }
        }
        
        DB.updateUserOverallStreak(user);
        DB.updateUserHabits(user);
    }
    console.log('Habits reset!');
}

async function createUser(userName, password) { 
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        userName: userName,
        password: hashedPassword,
        habits: [],
        overallStreak: { value: 0, completedToday: false },
        friends: [],
        token: uuid.v4()
    };
    await DB.addUser(user);

    return user;
}

function getUser(field, value) { 
    if (!value) return null;

    if (field === 'token') { 
        return DB.getUserByToken(value);
    }
    return DB.getUser(value);
}

// Create a token for the user and send a cookie containing the token
function setAuthCookie(res, user) { 
    res.cookie('token', user.token, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
}

async function getInfoByToken(token, field) {
    const user = await getUser('token', token);
    return user ? user[field] : null;
}

// Login Endpoints

app.post('/api/auth/create', async (req, res) => {
    if (await getUser('userName', req.body.userName)) {
        res.status(400).send({ message: 'User already exists' });
    } else { 
        const user = await createUser(req.body.userName, req.body.password);
        setAuthCookie(res, user);
        res.send({ userName: user.userName });
    }
});

app.put('/api/auth/login', async (req, res) => { 
    const user = await getUser('userName', req.body.userName);
    if (user && await bcrypt.compare(req.body.password, user.password)) { 
        user.token = uuid.v4();
        await DB.updateUser(user);
        setAuthCookie(res, user);
        res.send({ userName: user.userName });
    } else {
        res.status(401).send({ message: 'Unauthorized' });
    }
});

app.delete('/api/auth/logout', async (req, res) => { 
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    if (user) { 
        await DB.updateUserRemoveAuth(user);
    }
    res.clearCookie('token');
    res.send({});
});

// Username existence check endpoint for friend adding
app.post('/api/auth/checkUser', async (req, res) => {
    const user = await getUser('userName', req.body.userName);
    res.send({ exists: !!user });
});

// getMe
app.get('/api/user/me', async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    if (user) {
        res.send({ userName: user.userName });
    }
});

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
    const user = await getUser('token', req.cookies['token']);
    if (user) {
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
};

// Habits Endpoints

app.get('/api/habits/get', verifyAuth, async (req, res) => {
    const habits = await getInfoByToken(req.cookies['token'], 'habits');
    if (habits != null) {
        res.send(habits);
    } else {
        res.status(400).send({ message: 'User does not exist' });
    }
});

app.post('/api/habits/add', verifyAuth, async (req, res) => {
    const user = await getUser('token', req.cookies['token']);
    if (user) {
        const oldHabits = user.habits || [];
        const newHabits = req.body.habits || [];
        
        // Detect completed habits (compare by habitName and check if completedToday changed)
        for (let i = 0; i < newHabits.length; i++) {
            const newHabit = newHabits[i];
            const oldHabit = oldHabits.find(h => h.habitName === newHabit.habitName);
            
            if (oldHabit && !oldHabit.completedToday && newHabit.completedToday) {
                // Habit was just completed
                const message = `${user.userName} completed their habit: ${newHabit.emoji} ${newHabit.habitName}`;
                await broadcastAndStoreEvent(user.userName, 'habitComplete', message);
            }
        }
        
        // Detect deleted habits
        for (const oldHabit of oldHabits) {
            if (!newHabits.find(h => h.habitName === oldHabit.habitName)) {
                const message = `${user.userName} deleted their habit: ${oldHabit.emoji} ${oldHabit.habitName}`;
                await broadcastAndStoreEvent(user.userName, 'habitDeleted', message);
            }
        }
        
        // Detect added habits
        for (const newHabit of newHabits) {
            if (!oldHabits.find(h => h.habitName === newHabit.habitName)) {
                const message = `${user.userName} added a new habit: ${newHabit.emoji} ${newHabit.habitName}`;
                await broadcastAndStoreEvent(user.userName, 'habitAdded', message);
            }
        }
        
        user.habits = newHabits;
        await DB.updateUserHabits(user);
        res.send(user.habits);
    }
    else {
        res.status(400).send({ message: 'User does not exist' });
    }
});

app.get('/api/overallStreak/get', verifyAuth, async (req, res) => {
    const overallStreak = await getInfoByToken(req.cookies['token'], 'overallStreak');
    if (overallStreak != null) {
        res.send(overallStreak);
    } else {
        res.status(400).send({ message: 'User does not exist' });
    }
});

app.post('/api/overallStreak/add', verifyAuth, async (req, res) => {
    const user = await getUser('token', req.cookies['token']);
    if (user) {
        user.overallStreak = req.body.overallStreak;
        await DB.updateUserOverallStreak(user);
        res.send(user.overallStreak);
    } else {
        res.status(400).send({ message: 'User does not exist' });
    }
});

app.get('/api/friends/get', verifyAuth, async (req, res) => {
    const friends = await getInfoByToken(req.cookies['token'], 'friends');
    if (friends != null) {
        const friendsInfo = [];
        for (const friend of friends) {
            const friendUser = await getUser('userName', friend.name);
            if (friendUser) {
                friendsInfo.push({
                    name: friendUser.userName,
                    overallStreak: friendUser.overallStreak,
                    habits: friendUser.habits
                });
            } else {
                // error handling if friend user doesn't exist, for now just skip that friend
                console.log(`Friend user ${friend} does not exist`);
            }
        }
        res.send(friendsInfo);
    } else {
        res.status(400).send({ message: 'User does not exist' });
    }
});

app.post('/api/friends/add', verifyAuth, async (req, res) => {
    const user = await getUser('token', req.cookies['token']);
    if (user) {
        user.friends = req.body.friends;
        await DB.updateUserFriends(user);
        res.send(user.friends);
    } else {
        res.status(400).send({ message: 'User does not exist' });
    }
});

// Get all notifications for current user
app.get('/api/notifications', verifyAuth, async (req, res) => {
    const user = await getUser('token', req.cookies['token']);
    if (user) {
        const notifications = await DB.getNotifications(user.userName);
        res.send(notifications || []);
    } else {
        res.status(400).send({ message: 'User does not exist' });
    }
});

// Delete a notification by ID
app.delete('/api/notifications/:id', verifyAuth, async (req, res) => {
    const user = await getUser('token', req.cookies['token']);
    if (user) {
        const result = await DB.deleteNotification(req.params.id);
        if (result.deletedCount > 0) {
            res.send({ message: 'Notification deleted' });
        } else {
            res.status(404).send({ message: 'Notification not found' });
        }
    } else {
        res.status(400).send({ message: 'User does not exist' });
    }
});

const port = 4000;
const httpService = app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});

socketServer = peerProxy(httpService);

app.get(/.*/, (req, res) => {
    res.sendFile('index.html', { root: 'public' });
});