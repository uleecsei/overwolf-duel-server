import axios from 'axios';
import { User } from '../models/User';

async function saveConnections(userId, token_type, access_token) {
    try {
        const response = await axios.get('https://discord.com/api/users/@me/connections', {
            headers: {
                authorization: `${token_type} ${access_token}`
            }
        });

        return await User.findOneAndUpdate({discordId: userId}, {connections: response.data}, {new: true});
    } catch (error) {
        console.error('Error saving connections:', error);
    }
}

export { saveConnections };
