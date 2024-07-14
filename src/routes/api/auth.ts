import express from 'express';
import { User } from '../../models/User';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { comparePasswords } from "../../utils/compare-passwords";
import { config } from "../../config";
import axios from "axios";
import { saveConnections } from "../../utils/connections";
import { authMiddleware } from "../middleware/auth-middleware";

const router = express.Router();

router.post('/register', async (req, res) => {
    const { UserName, Email, Password, ConfirmPassword } = req.body;

    if (!UserName || !Email || !Password || !ConfirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (Password !== ConfirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUsernameUser = await User.findOne({ username: UserName });
    if (existingUsernameUser) {
        return res.status(400).json({ message: 'Username is already taken' });
    }

    const existingEmailUser = await User.findOne({ email: Email });
    if (existingEmailUser) {
        return res.status(400).json({ message: 'Email is already registered' });
    }

    try {
        const hashedPassword = await bcrypt.hash(Password, 10);
        const user = new User({
            username: UserName,
            email: Email,
            password: hashedPassword
        });
        const newUser = await user.save();

        const token = jwt.sign({ userId: newUser._id }, config.jwt.secretKey, {
            expiresIn: '1 hour'
        });

        res.json({ token });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
});


router.post('/login', async (req, res) => {
    const { UserName, Password } = req.body;

    try {
        const user = await User.findOne({ username: UserName });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordMatch = await comparePasswords(Password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({ userId: user._id }, config.jwt.secretKey, {
            expiresIn: '1 hour'
        });

        res.json({ token });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
});

router.get('/user', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user._id).populate('friends', 'username email');
    res.status(200).json({ user });
});

router.get('/discord/login', (req, res) => {
    const url = config.server.mode === 'prod'
        ? `https://discord.com/api/oauth2/authorize?client_id=${config.discord.clientId}&response_type=code&redirect_uri=http%3A%2F%2F103.241.65.202%3A3000%2Fauth%2Fdiscord%2Fcallback&scope=connections+identify`
        : `https://discord.com/api/oauth2/authorize?client_id=${config.discord.clientId}&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fdiscord%2Fcallback&scope=identify+connections`
    res.status(200).json({ url });
});

router.post('/discord/user', async( req, res ) => {
    const { token_type, access_token, token } = req.body;

    try {
        const response = await axios.get('https://discord.com/api/users/@me',{
            headers: {
                authorization: `${token_type} ${access_token}`
            }
        });
        const user = response.data;

        const jwtPayload = jwt.verify(token, config.jwt.secretKey) as JwtPayload;
        if (jwtPayload.userId) {
            await User.findOneAndUpdate({ _id: jwtPayload.userId }, { discordId: user.id, discordData: user, isVerified: true }, {new: true});
        }

        const updatedUser =  await saveConnections(user.id, token_type, access_token);

        return res.json({ user: updatedUser });

    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Send a custom error message for Unauthorized error
            return res.status(401).send('Unauthorized: Discord API access token invalid');
        }
        // For other errors, send the error details
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
});

router.get('/discord/connections', async( req, res ) => {
    const { access_token, token_type } = req.body;

    try {
        const response = await axios.get('https://discord.com/api/users/@me/connections',{
            headers: {
                authorization: `${token_type} ${access_token}`
            }
        });
        return res.json({ connections: response });

    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Send a custom error message for Unauthorized error
            return res.status(401).send('Unauthorized: Discord API access token invalid');
        }
        // For other errors, send the error details
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
});

router.get('/discord/callback', async( req, res ) => {

    const code = req.query.code;
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
        res.redirect(`/redirect?token_type=${response.data.token_type}&access_token=${response.data.access_token}`);
    } catch (error) {
        console.log('Error', error);
        return res.send(error);
    }

});

export { router as authRouter };