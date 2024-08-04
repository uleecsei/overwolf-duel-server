import express from 'express';
import { User } from '../../models/User';
import { Invitation } from '../../models/Invitation';
import { authMiddleware } from "../middleware/auth-middleware";

const router = express.Router();

router.post('/invite', authMiddleware, async (req, res) => {
    const { username } = req.body;

    try {
        const sender = req.user;

        const recipient = await User.findOne({
            $or: [
                { username },
                { email: username },
                { 'discordData.username': username }
            ]
        });

        if (!recipient) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (recipient._id.equals(sender._id)) {
            return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
        }

        const isAlreadyFriend = sender.friends.includes(recipient._id);
        if (isAlreadyFriend) {
            return res.status(400).json({ message: 'User is already your friend' });
        }

        const existingRequest = await Invitation.findOne({
            sender: sender._id,
            recipient: recipient._id
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already sent' });
        }

        const friendRequest = new Invitation({
            sender: sender._id,
            recipient: recipient._id
        });

        await friendRequest.save();

        res.status(200).json({ message: 'Friend request sent' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
});

router.post('/accept', authMiddleware, async (req, res) => {
    const { friendId } = req.body;
    console.log(req.body);

    try {
        const user = req.user;
        const friendRequest = await Invitation.findById(friendId);

        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        if (!friendRequest.recipient.equals(user._id)) {
            return res.status(403).json({ message: 'You cannot accept this friend request' });
        }

        await User.findByIdAndUpdate(user._id, {
            $push: { friends: friendRequest.sender }
        });

        await User.findByIdAndUpdate(friendRequest.sender, {
            $push: { friends: friendRequest.recipient }
        });

        await friendRequest.deleteOne();

        res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
});

router.post('/reject', authMiddleware, async (req, res) => {
    const { friendId } = req.body;

    try {
        const user = req.user;
        const friendRequest = await Invitation.findById(friendId);

        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        if (!friendRequest.recipient.equals(user._id)) {
            return res.status(403).json({ message: 'You cannot reject this friend request' });
        }

        await friendRequest.deleteOne();

        res.status(200).json({ message: 'Friend request rejected' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
});

router.get('/friends-requests/list', authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const invitations = await Invitation.find({ recipient: req.user._id })
            .populate('sender')
            .exec();

        res.status(200).json({ invitations });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
});


router.get('/list', authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const populatedUser = await User.findById(user._id).populate('friends', 'username email');

        res.status(200).json({ friends: populatedUser.friends });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
});

router.delete('/delete', authMiddleware, async (req, res) => {
    const { friendId } = req.body;
    console.log(req.body);

    try {
        const user = req.user;

        const friend = await User.findById(friendId);
        if (!friend) {
            return res.status(404).json({ message: 'Friend not found' });
        }

        const isFriend = user.friends.includes(friendId);
        if (!isFriend) {
            return res.status(400).json({ message: 'User is not your friend' });
        }

        await User.findByIdAndUpdate(user._id, {
            $pull: { friends: friendId }
        });

        await User.findByIdAndUpdate(friendId, {
            $pull: { friends: user._id }
        });

        res.status(200).json({ message: 'Friend removed successfully' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
});

export { router as friendsRouter };
