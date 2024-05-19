import express from 'express';
import path from 'path';

const router = express.Router();

router.use(express.static(path.join(__dirname, '../../views/auth/register')));

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/auth/register', 'register.html'));
});

export { router as registerRouter };
