import express from 'express';
import { GameData } from '../../models/GameData';
import { User } from "../../models/User";
import { authMiddleware } from "../middleware/auth-middleware";

const router = express.Router();

router.get('/', authMiddleware, async (req: any, res: any) => {
    try {
        const allGameData = await GameData.find({});
        res.send({ allGameData });
    } catch (error) {
        console.error('Error retrieving Game Data:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/write', authMiddleware, async (req: any, res: any) => {
    const { data } = req.body;
    const userId = req.user._id;

    try {
        const gameData = new GameData({ data });
        await gameData.save();

        await User.findByIdAndUpdate(userId, { $push: { gameData: gameData._id } });

        res.sendStatus(200);
    } catch (error) {
        console.error('Error writing game data:', error);
        res.status(500).send('Internal Server Error');
    }
});


export { router as gameDataRouter };
