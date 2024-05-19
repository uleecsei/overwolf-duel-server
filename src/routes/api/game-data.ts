import express from 'express';
import { GameData } from '../../models/GameData';

const router = express.Router();

router.get('/', async (req: any, res: any) => {
    try {
        const allGameData = await GameData.find({});
        res.send({ allGameData });
    } catch (error) {
        console.error('Error retrieving Game Data:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/write', (req: any, res: any) => {
    const data = req.body.data;
    try {
        const gameData = new GameData({ data });
        gameData.save();
        res.sendStatus(200);
    } catch (error) {
        console.error('Error writing user folders and data:', error);
        res.status(500).send('Internal Server Error');
    }
});


export { router as gameDataRouter };
