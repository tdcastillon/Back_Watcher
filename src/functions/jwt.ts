import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import secret_key from './secret_key';
import { ObjectId } from 'mongoose';

const createToken = (id: ObjectId) => {
    // timeLeft = 10h
    let timeLeft: number = 60 * 60 * 10;
    return jwt.sign({ _id: id }, secret_key.getSecretKey(), {
        expiresIn: timeLeft
    });
};

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).send({ message: 'Access denied' });
    }
    try {
        const decodedToken: { _id: ObjectId } = jwt.verify(token, secret_key.getSecretKey()) as { _id: ObjectId };
        req.body._id = decodedToken._id; 
        next();
    } catch (err) {
        res.status(403).send({ message: 'Invalid token' });
    }
}

export default { createToken, verifyToken };