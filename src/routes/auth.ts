import express from 'express';
import { config } from '../config';
import axios from 'axios';
import { randomUUID } from 'crypto';
import { User } from '../models/User';

const users: { [key: string]: any } = {};

const router = express.Router();

router.get('/discord/login', (req, res) => {
   const url = config.server.mode === 'prod'
       ? `https://discord.com/api/oauth2/authorize?client_id=${config.discord.clientId}&response_type=code&redirect_uri=http%3A%2F%2F103.241.65.202%3A3000%2Fauth%2Fdiscord%2Fcallback&scope=connections+identify`
       : `https://discord.com/api/oauth2/authorize?client_id=${config.discord.clientId}&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fdiscord%2Fcallback&scope=identify+connections`
    res.status(200).json({ url });
});

// router.get('/discord/token', async( req, res ) => {
//     const code = req.query.code;
//     const params = new URLSearchParams();
//
//     params.append('client_id', config.discord.clientId);
//     params.append('client_secret', config.discord.clientSecret);
//     params.append('grant_type', 'authorization_code');
//     params.append('code', code);
//     params.append('redirect_uri', config.discord.redirectURI);
//     const headers = {
//         'Content-Type': 'application/x-www-form-urlencoded'
//     }
//
//     try {
//         const response = await axios.post('https://discord.com/api/oauth2/token', params, { headers });
//         res.status(200).json({ response });
//     } catch (error) {
//         console.log('Error', error);
//         return res.send(error);
//     }
// });

router.post('/discord/user', async( req, res ) => {
    const access_token = req.body.access_token;
    const token_type = req.body.token_type;

    try {
        const response = await axios.get('https://discord.com/api/users/@me',{
            headers: {
                authorization: `${token_type} ${access_token}`
            }
        });
        const user = response.data;

        const existingUser = await User.findOne({ id: user.id, username: user.username });
        if (!existingUser) {
            const newUser = new User({ id: user.id, username: user.username, avatar: user.avatar });
            await newUser.save();
        }

        return res.json({ user });

    } catch (error) {
        console.log('Error', error);
        return res.send(error);
    }
});

router.get('/discord/connections', async( req, res ) => {
    const sessionId = req.query.sessionId;
    const user = users[sessionId];

    if (!user) {
        res.status(400).send('Connections not found');
        return;
    }
    const { access_token, token_type } = user;

    try {
        const response = await axios.get('https://discord.com/api/users/@me/connections',{
            headers: {
                authorization: `${token_type} ${access_token}`
            }
        });
        console.log(response);
        return res.json({ connections: response });

    } catch (error) {
        console.log('Error', error);
        return res.send(error);
    }
});

export { router as authRouter };

router.get('/discord/callback', async( req, res ) => {

    const code = req.query.code;
    const state = req.query.state;
    const params = new URLSearchParams();

    params.append('client_id', config.discord.clientId);
    params.append('client_secret', config.discord.clientSecret);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', config.discord.redirectURI);
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    try {
        const response = await axios.post('https://discord.com/api/oauth2/token', params, { headers });

        if (state) {
            users[state] = response.data;
        }

        res.send(`
            <html>
              <head>
                <title>Open Overwolf Duel App</title>
                <style>
                  body {
                    font-family: 'Arial', sans-serif;
                    text-align: center;
                    padding: 50px;
                  }
            
                  p {
                    font-size: 24px;
                    color: #7289DA;
                    font-weight: bold;
                  }
                </style>
              </head>
              <body>
                <p>Now open your Overwolf Duel app and press Continue.</p>
              </body>
            </html>
        `);
    } catch (error) {
        console.log('Error', error);
        return res.send(error);
    }

});

// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const User = require('../models/User');
//
// // Register a new user
// const register = async (req, res, next) => {
//     const { username, email, password } = req.body;
//
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = new User({ username, email, password: hashedPassword });
//         await user.save();
//         res.json({ message: 'Registration successful' });
//     } catch (error) {
//         next(error);
//     }
// };
//
// // Login with an existing user
// const login = async (req, res, next) => {
//     const { username, password } = req.body;
//
//     try {
//         const user = await User.findOne({ username });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//
//         const passwordMatch = await user.comparePassword(password);
//         if (!passwordMatch) {
//             return res.status(401).json({ message: 'Incorrect password' });
//         }
//
//         const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
//             expiresIn: '1 hour'
//         });
//         res.json({ token });
//     } catch (error) {
//         next(error);
//     }
// };
//
// module.exports = { register, login };
