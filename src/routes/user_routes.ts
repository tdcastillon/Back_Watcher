import express, { Request, Response } from 'express';
import User from '../models/User';
import { SHA256 } from 'crypto-js';
import jwt from '../functions/jwt';
import { ObjectId } from 'mongoose';
import MovieNotes from '../models/MovieNotes';
import TvShowNotes from '../models/TvShowNotes';

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

app.get('/', async (req: Request, res: Response) => {
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
                res.status(201).send({ message: 'User created' });
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


/*
    * @function GET
    * @function_url '/getMoviesNotes'
    * @description Get all movies notes for a user
    * @returns {list} movies notes if success
    * @returns {string} message if error
    * @authorization token
    * error 403 if token is invalid
    * error 404 if user not found
    * error 500 if any error occurs
    * success 200 if success
*/

app.get('/getMoviesNotes', jwt.verifyToken, async (req: Request, res: Response) => {
    console.log("getMoviesNotes")
    try {
        const {_id} = req.body;
        MovieNotes.find({ user_id: _id }).then((moviesNotes) => {
            if (moviesNotes) {
                let response : Array<{movie_id: number, note: number}> = []
                moviesNotes.forEach((movieNote) => {
                    response.push({ movie_id: movieNote.movie_id, note: movieNote.note });
                });
                res.status(200).send(response);  
            } else {
                res.status(404).send({ message: 'Movies notes not found' });
            }
        }).catch((err: any) => {
            res.status(500).send({ message: err.message });
        });
    } catch (err: any) {
        res.status(500).send({ message: err.message });
    }
});

/*
    * @function GET
    * @function_url '/getMovieNote/:movie_id'
    * @description Get a movie note for a user
    * @returns {number} movie note if success
    * @returns {string} message if error
    * @authorization token
    * error 403 if token is invalid
    * error 404 if movie note not found
    * error 500 if any error occurs
    * success 200 if success
    * @need token
*/

app.get('/getMovieNote/:movie_id', jwt.verifyToken, async (req: Request, res: Response) => {
    try {
        const { movie_id } = req.params;
        const { _id } = req.body;
        MovieNotes.findOne({ movie_id, user_id: _id }).then((movieNote) => {
            if (movieNote) {
                res.status(200).send({ note: movieNote.note });
            } else {
                res.status(404).send({ message: 'Movie note not found' });
            }
        }).catch((err: any) => {
            res.status(500).send({ message: err.message });
        });
    } catch (err: any) {
        res.status(500).send({ message: err.message });
    }
});

/*
    * @function GET
    * @function_url '/getTvShowsNotes'
    * @description Get all tvshows notes for a user
    * @returns {list} tvshows notes if success
    * @returns {string} message if error
    * @authorization token
    * error 403 if token is invalid
    * error 404 if user not found
    * error 500 if any error occurs
    * success 200 if success
    * @need token
*/

app.get('/getTvShowsNotes', jwt.verifyToken, async (req: Request, res: Response) => {
    try {
        const { _id } = req.body;
        TvShowNotes.find({ user_id: _id }).then((tvshowsNotes) => {
            if (tvshowsNotes) {
                let response : Array<{tvshow_id: number, notes: Array<{season: number, note: number}>}> = []
                tvshowsNotes.forEach((tvshowNote) => {
                    response.push({ tvshow_id: tvshowNote.serie_id, notes: tvshowNote.notes });
                });
                res.status(200).send(response);
            } else {
                res.status(404).send({ message: 'Tvshows notes not found' });
            }
        }).catch((err: any) => {
            res.status(500).send({ message: err.message });
        });
    } catch (err: any) {
        res.status(500).send({ message: err.message });
    }
});

/*
    * @function GET
    * @function_url '/getTvShowNote/:tvshow_id'
    * @description Get a tvshow note for a user
    * @returns {list} tvshow note if success
    * @returns {string} message if error
    * @authorization token
    * error 403 if token is invalid
    * error 404 if tvshow note not found
    * error 500 if any error occurs
    * success 200 if success
    * @need token
*/

app.get('/getTvShowNote/:serie_id', jwt.verifyToken, async (req: Request, res: Response) => {
    try {
        const { serie_id } = req.params;
        const { _id } = req.body;
        TvShowNotes.findOne({ serie_id, user_id: _id }).then((tvshowNote) => {
            if (tvshowNote) {
                res.status(200).send({ notes: tvshowNote.notes });
            } else {
                res.status(404).send({ message: 'Tvshow note not found' });
            }
        }).catch((err: any) => {
            res.status(500).send({ message: err.message });
        });
    } catch (err: any) {
        res.status(500).send({ message: err.message });
    }
});

export default app;