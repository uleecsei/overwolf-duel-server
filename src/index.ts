import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import { config } from './config';
import { connectDB } from './db';
import { authRouter } from './routes/auth';
import { profileRouter } from './routes/profile';
import { loginRouter } from './routes/login';
import { gameDataRouter } from './routes/game-data';

const app = express();

const corsOptions = {
  origin: config.server.url + config.server.port,
  credentials: true,
  optionSuccessStatus: 200,
};
const logFormat = config.server.mode === 'prod' ? 'combined' : 'dev';

connectDB();

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(morgan(logFormat));

app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/login', loginRouter);
app.use('/game-data', gameDataRouter);

app.use('/', (req, res) => {
  res.redirect('login');
});
// app.use('/', fileRouter);

app.listen(config.server.port, () => {
  console.log(`Port is ${config.server.port}`);
});
