const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const bcrypt = require('bcryptjs');

let users = [];
let habits = [];

async function createUser(email, password) { 
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        email:email,
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

// Endpoints

app.post('/api/auth', async (req, res) => {
    if (await getUser('email', req.body.email)) {
        res.status(400).send({ message: 'User already exists' });
    } else { 
        const user = await createUser(req.body.email, req.body.password);
        setAuthCookie(res, user);
        res.send({ message: 'User created' });
    }
});

app.put('/api/auth', async (req, res) => { 
    const user = await getUser('email', req.body.email);
    if (user && await bcrypt.compare(req.body.password, user.password)) { 
        setAuthCookie(res, user);
        res.send({ email: user.email });
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
    res.send({ email: user.email });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});