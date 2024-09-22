import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import { config } from './config';
import { connectDB } from './db';
import { friendsPageRouter } from './routes/pages/friends';
import { loginRouter } from './routes/pages/login';
import { gameDataRouter } from './routes/api/game-data';
import { homeRouter } from "./routes/pages/home";
import { registerRouter } from "./routes/pages/register";
import { authRouter } from "./routes/api/auth";
import { discordPageRouter } from "./routes/pages/discord";
import { redirectRouter } from "./routes/pages/redirect";
import { friendsRouter } from "./routes/api/friends";
import { profileRouter } from "./routes/pages/profile";

const app = express();

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};
const logFormat = config.server.mode === 'prod' ? 'combined' : 'dev';

connectDB();

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(morgan(logFormat));

// auth
app.use('/auth', authRouter);

// pages
app.use('/', homeRouter);
app.use('/login', loginRouter);
app.use('/discord-page', discordPageRouter);
app.use('/redirect', redirectRouter);
app.use('/friends', friendsPageRouter);
app.use('/profile', profileRouter);
app.use('/register', registerRouter);

// api
app.use('/api/friends', friendsRouter);
app.use('/api/game-data', gameDataRouter);
// app.use('/', fileRouter);

app.listen(config.server.port, () => {
  console.log(`Port is ${config.server.port}`);
});
