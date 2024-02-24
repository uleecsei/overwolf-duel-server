import dotenv from 'dotenv';

dotenv.config();

export const config = {
    server: {
        url: process.env.MODE === 'prod' ? 'http://103.241.65.202' : 'http://localhost',
        port: process.env.PORT || 3000,
        mode: process.env.MODE,
    },
    db: {
        mongodbURI: process.env.MONGODB_URI
    },
    discord: {
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        redirectURI: process.env.DISCORD_REDIRECT_URI,
    },
    crypto: {
        encryptionKey: process.env.ENCRYPTION_KEY
    },
    jwt: {
        secretKey: process.env.SECRET_JWT_KEY
    }
}
