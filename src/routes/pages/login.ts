import express from 'express';
import path from 'path';

const router = express.Router();

router.use(express.static(path.join(__dirname, '../../views/auth/login')));

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/auth/login', 'Tracker_Network_Login.html'));
});

export { router as loginRouter };
