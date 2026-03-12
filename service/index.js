const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

let users = [];

async function createUser(userName, password) { 
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        userName: userName,
        password: hashedPassword
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

function getHabitsForUser(userName) {
    const user = getUser('userName', userName);
    return user ? user.habits : res.status(400).send({ message: 'User does not exist' });
}

function updateHabits(userName, habit) {
    const user = getUser('userName', userName);
    if (user) {
        if (!user.habits) {
            user.habits = [];
        }
        user.habits.push(habit);
    }
    return user ? user.habits : res.status(400).send({ message: 'User does not exist' });
}

// Login Endpoints

app.post('/api/auth', async (req, res) => {
    if (await getUser('userName', req.body.userName)) {
        res.status(400).send({ message: 'User already exists' });
    } else { 
        const user = await createUser(req.body.userName, req.body.password);
        setAuthCookie(res, user);
        res.send({ message: 'User created' });
        console.log(users);
    }
});

app.put('/api/auth', async (req, res) => { 
    const user = await getUser('userName', req.body.userName);
    if (user && await bcrypt.compare(req.body.password, user.password)) { 
        setAuthCookie(res, user);
        res.send({ userName: user.userName });
        console.log(users);
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
    const user = await getUser('token', req.cookies[authCookieName]);
    if (user) {
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
};

// Habits Endpoints

app.get('/api/habits', verifyAuth, async (req, res) => {
    const habits = await getHabitsForUser(req.body.userName);
    res.send(habits);
});

app.post('/api/habits/add', verifyAuth, async (req, res) => {
    const habits = await updateHabits(req.body.userName, req.body.habit);
    res.send(habits);
});

const port = 3000;
app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});