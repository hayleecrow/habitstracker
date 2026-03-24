const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const DB = require('./database.js');

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

let users = [];

async function createUser(userName, password) { 
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        userName: userName,
        password: hashedPassword,
        habits: [],
        overallStreak: { value: 0, completedToday: false },
        friends: []
    };
    users.push(user);
    return user;
}

function getUser(field, value) { 
    if (value) { 
        return users.find((user) => user[field] === value);
    }
    return null;
}

// Create a token for the user and send a cookie containing the token
function setAuthCookie(res, user) { 
    user.token = uuid.v4();

    res.cookie('token', user.token, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
}

function clearAuthCookie(res, user) { 
    delete user.token;
    res.clearCookie('token');
}

function getInfoForUser(token, field) {
    const user = getUser('token', token);
    return user ? user[field] : null;
}

// Login Endpoints

app.post('/api/auth', async (req, res) => {
    if (await getUser('userName', req.body.userName)) {
        res.status(400).send({ message: 'User already exists' });
    } else { 
        const user = await createUser(req.body.userName, req.body.password);
        setAuthCookie(res, user);
        res.send({ userName: user.userName });
    }
});

app.put('/api/auth', async (req, res) => { 
    const user = await getUser('userName', req.body.userName);
    if (user && await bcrypt.compare(req.body.password, user.password)) { 
        setAuthCookie(res, user);
        res.send({ userName: user.userName });
    } else {
        res.status(400).send({ message: 'Unauthorized' });
    }
});

app.delete('/api/auth', async (req, res) => { 
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    if (user) { 
        clearAuthCookie(res, user);
    }
    res.send({});
});

// getMe
app.get('/api/user/me', async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    if (user) {
        res.send({ userName: user.userName });
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
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
    const habits = await getInfoForUser(req.cookies['token'], 'habits');
    if (habits != null) {
        res.send(habits);
    } else {
        res.status(400).send({ message: 'User does not exist' });
    }
});

app.post('/api/habits/add', verifyAuth, async (req, res) => {
    const user = getUser('token', req.cookies['token']);
    if (user) {
        user.habits = req.body.habits;
        res.send(user.habits);
    }
    else {
        res.status(400).send({ message: 'User does not exist' });
    }
});

app.get('/api/overallStreak/get', verifyAuth, async (req, res) => {
    const overallStreak = await getInfoForUser(req.cookies['token'], 'overallStreak');
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
        res.send(user.overallStreak);
    } else {
        res.status(400).send({ message: 'User does not exist' });
    }
});

app.get('/api/friends/get', verifyAuth, async (req, res) => {
    const friends = await getInfoForUser(req.cookies['token'], 'friends');
    if (friends != null) {
        res.send(friends);
    } else {
        res.status(400).send({ message: 'User does not exist' });
    }
});

app.post('/api/friends/add', verifyAuth, async (req, res) => {
    const user = await getUser('token', req.cookies['token']);
    if (user) {
        user.friends = req.body.friends;
        res.send(user.friends);
    } else {
        res.status(400).send({ message: 'User does not exist' });
    }
});

const port = 4000;
app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});

app.get(/.*/, (req, res) => {
    res.sendFile('index.html', { root: 'public' });
});