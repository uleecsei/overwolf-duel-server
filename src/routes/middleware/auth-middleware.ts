import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../../config';
import { User } from "../../models/User";

interface AuthenticatedRequest extends Request {
    user?: any;
    headers?: any;
}

const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        const jwtPayload = jwt.verify(token, config.jwt.secretKey) as JwtPayload;
        if (jwtPayload.userId) {
            const user = await User.findOne({ _id: jwtPayload.userId });
            req.user = user;
            next();
        }
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

export { authMiddleware, AuthenticatedRequest };
