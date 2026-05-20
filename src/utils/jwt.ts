import * as jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const generateToken = (payload: any) => {
    return jwt.sign(
        payload, 
        env.JWT_SECRET as string, 
        { 
            // Bypass the strict 'StringValue' type check here
            expiresIn: (env.JWT_EXPIRES_IN || "7d") as any 
        }
    );
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, env.JWT_SECRET as string);
};