import express from 'express';
import path from 'path';

const router = express.Router();

router.use(express.static(path.join(__dirname, '../../views')));

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views', 'index.html'));
});

export { router as homeRouter };
