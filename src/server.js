const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const usersPath = 'users.json';
let logSecurity = {};

// Loading user data
const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

// Auth middleware
const authUser = (req, res, next) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
        req.user = user;
        next();
    } else {
        const tries = logSecurity[username] || 0;
        logSecurity[username] = tries + 1;

        if (tries >= 3) {
            res.status(401).json({ error: 'Too many failed attempts. Try again in 10 minutes' });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    }
};

// New user
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    const user = { username, password };
    users.push(user); // Fix: push to the users array
    fs.writeFileSync(usersPath, JSON.stringify(users));
    res.status(200).json({ message: 'User created successfully' });
});

// Login endpoint
app.post('/api/login', authUser, (req, res) => { // Fix: use correct middleware name
    const { username } = req.user;
    delete logSecurity[username]; // when logged in, clear the login attempts
    res.status(200).json({ message: 'Login successful' });
});

// Logout
app.post('/api/logout', (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
});

app.listen(PORT, () => {
    console.log(`Server running perfectly at http://localhost:${PORT}`);
});
