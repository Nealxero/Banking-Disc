const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { log } = require('console');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const usersPath= 'users.json';
let logSecurity = {};

// loading user

const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'))

// auth middleware 

const authUser = (req, res, next) => {
    const { username, password} =  req.body;
    const user = users.find((u) => u.username === username && u.password === password)

    if (user) {
        req.user = user;
        next();
    } else {
        const tries = logSecurity[username] || 0;
        logSecurity[username] = tries + 1;

        if (tries >= 3 ){
            res.status(401).json({ error: 'Too many failed attempts. Try again in 10 minutes'})
        } else { 
            res.status(401).json({error: 'Invalid credentials'});
        }
    }
};

//new user

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    const user = { username, password};
    user.push(user);
    fs.writeFileSync(usersPath, JSON.stringify(users));
    res.status(200).json({ message: 'User created succesfully'});
});


// login endpoint

app.post('/api/login', authenticate, (req, res) => {
    const {username} = req.user;
    delete logSecurity[username] // when logged in clears the login attemps
    res.status(200).json({message: 'Login Succesfull'});
});

// logout
app.post('/api/logout', (req, res ) => {
    res.status(200).json({message: 'Logout succesful'});

});

app.listen(PORT, () => {
    console.log(`Server running perfectly at http://localhost:${PORT}`);
});
