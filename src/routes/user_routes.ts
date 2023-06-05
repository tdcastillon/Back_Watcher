import express, { Request, Response } from 'express';
import User from '../models/User';
import { SHA256 } from 'crypto-js';
import jwt from '../functions/jwt';
import { ObjectId } from 'mongoose';

const app = express.Router();

interface User {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    is_verified: boolean;
    avatar_url: string;
}

/*
    * @function GET
    * @function_url '/'
    * @description Get all users
    * @returns {list} users if success
    * @returns {string} message if error
*/

app.get('/', async (res: Response) => {
    try {
        const user: any = await User.find();
        try {
            if (user) {
                res.status(200).send(user);
            } else {
                res.status(404).send({ message: 'User not found' });
            }
        } catch (err: any) {
            res.status(500).send({ message: err.message });
        }
    } catch (err: any) {
        res.status(500).send({ message: err.message });
    }
});

/* function Post
    * @function_url '/profil'
    * @param {string} id - The user's id
    * @description Get a user
    * @returns {User} user if success with status 200
    * @returns {string} message if an error occurs with status 500
*/

/* route is localhost:8080/users/profil */

app.post('/profil', jwt.verifyToken, async (req: Request, res: Response) => {
    try {
        await User.findOne({ _id: req.body._id }).then((user) => {
            if (user) {
                res.status(200).send({ user: user });
            } else {
                res.status(404).send({ message: 'User not found' });
            }
        }).catch((err: any) => {
            res.status(500).send({ message: err.message });
        });
    } catch (err: any) {
        res.status(500).send({ message: err.message });
    }
});


/*
    * @function POST
    * @function_url '/createUser'
    * @description Create a new user
    * @returns {string} message if success
    * @returns {string} message if error
*/

app.post('/createUser', async (req: Request, res: Response) => {
    try {
        let user = req.body;
        user['password'] = SHA256(user['password']).toString();
        const _user = await User.find({ email: user['email'] });
        if (_user.length != 0) {
            res.status(409).send({ message: 'User already exists' });
        } else {
            const new_user = new User(user);
            if (new_user) {
                new_user.save();
                res.status(200).send({ message: 'User created' });
            } else {
                res.status(500).send({ message: 'User not created' });
            }
        }
    } catch (err: any) {
        res.status(500).send({ message: err.message });
    }
});

/*
    * @function POST
    * @function_url '/updateUser'
    * @description Update a user
    * @returns {string} message if success
    * @returns {string} message if error
*/

app.post('/updateUser', jwt.verifyToken, async (req: Request, res: Response) => {
    try {
        const _user: any = User.findOneAndUpdate({ email: req.body._id }, req.body.user);
        if (_user) {
            res.status(201).send({ message: 'User updated' });
        } else {
            res.status(500).send({ message: 'User not updated' });
        }
    } catch (err: any) {
        res.status(500).send({ message: err.message });
    }
});

/*
    * @function POST
    * @function_url '/deleteUser'
    * @description Delete a user
    * @returns {string} message if success
    * @returns {string} message if error
*/

app.post('/deleteUser', jwt.verifyToken, async (req: Request, res: Response) => {
    try {
        const _user: any = User.findOneAndRemove({ _id: req.body._id });
        if (_user) {
            res.status(200).send({ message: 'User deleted' });
        } else {
            res.status(500).send({ message: 'User not deleted' });
        }
    } catch (err: any) {
        res.status(500).send({ message: err.message });
    }
});

/*
    * @function POST
    * @function_url '/login'
    * @description Login a user
    * @returns {Number} user_id if success
    * @returns {string} message if any error occurs
*/

app.post('/login', async (req: Request, res: Response) => {
    try {
        let { email, password } = req.body;
        let pass = SHA256(password).toString();
        console.log(email, pass)
        User.findOne({ email: email }).then((user: any) => {
            console.log(user)
            let token = jwt.createToken(user._id);
            res.status(200).send({ token: token})
        }).catch((err: any) => {
            console.log(err)
            res.status(500).send({ message: err.message });
        })
    } catch (err: any) {
        console.log(err)
        res.status(500).send({ message: err.message });
    }
});

export default app;