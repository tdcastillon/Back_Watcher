import express, { Request, Response } from 'express';
import jwt from '../functions/jwt';
import { ObjectId } from 'mongoose';
import MovieNotes from '../models/MovieNotes';

const app = express.Router();

interface MovieNotes {
    movie_id: number;
    user_id: ObjectId;
    note: number;
}

/*
    * @function GET
    * @function_url '/'
    * @description Get all movie notes
    * @returns {list} movie notes if success
    * @returns {string} message if error
*/

app.get('/', async (req: Request, res: Response) => {
    MovieNotes.find()
    .then((movieNotes) => {
        if (movieNotes) {
            res.status(200).send(movieNotes);
        } else {
            res.status(404).send({ message: 'Movie notes not found' });
        }
    })
    .catch((err: any) => {
        res.status(500).send({ message: err.message });
    })
});

/*
    * @function POST
    * @function_url '/add'
    * @description Add a movie note for a user
    * @return note if success
    * @return message if error
    * @need in body: movie_id, note
    * @need authorization token
    * @return status 201 if success
    * @return status 500 if error
    * @return status 403 if token is invalid
    * @return status 400 if movie_id or note is missing
*/
    
app.post('/add', jwt.verifyToken, async (req: Request, res: Response) => {
    const { movie_id, note, _id } = req.body;
    if (!movie_id || !note) {
        return res.status(400).send({ message: 'Missing movie_id or note' });
    }
    MovieNotes.findOne({ movie_id, user_id: _id })
    .then((movieNote) => {
        if (movieNote) {
            return res.status(400).send({ message: 'Movie note already exists' });
        } else {
            MovieNotes.create({ movie_id, user_id: _id, note })
            .then((movieNote) => {
                if (movieNote) {
                    res.status(201).send(movieNote);
                } else {
                    res.status(500).send({ message: 'Cannot add movie note' });
                }
            })
            .catch((err: any) => {
                res.status(500).send({ message: err.message });
            })
        }
    })
    .catch((err: any) => {
        res.status(500).send({ message: err.message });
    })
})

/*
    * @function POST
    * @function_url '/update'
    * @description Update a movie note for a user
    * @return note if success
    * @return message if error
    * @need in body: movie_id, note
    * @need authorization token
    * @return status 201 if success
    * @return status 500 if error
    * @return status 403 if token is invalid
    * @return status 400 if movie_id or note is missing
    * @return status 404 if movie_id or note not found
*/

app.post('/update', jwt.verifyToken, async (req: Request, res: Response) => {
    const { movie_id, note, _id } = req.body;
    if (!movie_id || !note) {
        return res.status(400).send({ message: 'Missing movie_id or note' });
    }
    MovieNotes.findOne({ movie_id, user_id: _id })
    .then((movieNote) => {
        if (movieNote) {
            MovieNotes.updateOne({ movie_id, user_id: _id }, { note })
            .then((movieNote) => {
                if (movieNote) {
                    res.status(201).send(movieNote);
                } else {
                    res.status(500).send({ message: 'Cannot update movie note' });
                }
            })
            .catch((err: any) => {
                res.status(500).send({ message: err.message });
            })
        } else {
            res.status(404).send({ message: 'Movie note not found' });
        }
    })
    .catch((err: any) => {
        res.status(500).send({ message: err.message });
    })
})

/*
    * @function GET
    * @function_url '/:movie_id'
    * @description Get a movie note for a user
    * @return note if success
    * @return message if error
    * @need in params: movie_id
    * @need authorization token
    * @return status 200 if success
    * @return status 500 if error
    * @return status 403 if token is invalid
    * @return status 404 if movie_id not found
    * @return status 400 if movie_id is missing
*/

app.get('/:movie_id', jwt.verifyToken, async (req: Request, res: Response) => {
    const { _id } = req.body;
    const { movie_id } = req.params;
    if (!movie_id) {
        return res.status(400).send({ message: 'Missing movie_id' });
    }
    MovieNotes.findOne({ movie_id, user_id: _id })
    .then((movieNote) => {
        if (movieNote) {
            res.status(200).send({ note: movieNote.note });
        } else {
            console.log("Not found")
            res.status(404).send({ message: 'Movie note not found' });
        }
    })
    .catch((err: any) => {
        res.status(500).send({ message: err.message });
    })
})

/*
    * @function POST
    * @function_url '/delete/:movie_id'
    * @description Delete a movie note for a user
    * @return message if success
    * @return message if error
    * @need in params: movie_id
    * @need authorization token
    * @return status 201 if success
    * @return status 500 if server error
    * @return status 403 if token is invalid
    * @return status 400 if movie_id not in params
    * @return status 404 if movie_id not found
*/

app.post('/delete/:movie_id', jwt.verifyToken, async (req: Request, res: Response) => {
    const { _id } = req.body;
    const { movie_id } = req.params;
    if (!movie_id) {
        return res.status(400).send({ message: 'Missing movie_id' });
    }
    MovieNotes.findOne({ movie_id, user_id: _id })
    .then((movieNote) => {
        if (movieNote)
            MovieNotes.deleteOne({ movie_id, user_id: _id })
            .then((movieNote) => {
                if (movieNote) {
                    res.status(201).send({ message: 'Movie note deleted' });
                } else {
                    res.status(500).send({ message: 'Cannot delete movie note' });
                }
            })
            .catch((err: any) => {
                res.status(500).send({ message: err.message });
            })
        else
            res.status(404).send({ message: 'Movie note not found' });
    })
    .catch((err: any) => {
        res.status(500).send({ message: err.message });
    })
})

export default app