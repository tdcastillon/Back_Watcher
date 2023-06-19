import express, { Request, Response } from 'express';
import jwt from '../functions/jwt';
import { ObjectId } from 'mongoose';
import MovieNotes from '../models/MovieNotes';
import TvShowNotes from '../models/TvShowNotes';

const app = express.Router();

interface TvShowNotes {
    tvshow_id: number;
    user_id: ObjectId;
    notes: {
        season: number;
        note: number;
    }[];
}

/*
    * @function GET
    * @function_url '/'
    * @description Get all tvshow notes
    * @returns {list} tvshow notes if success
    * @returns {string} message if error
    * @need authorization token
    * @return status 200 if success
    * @return status 500 if error
    * @return status 403 if token is invalid
    * @return status 404 if tvshow notes not found
    * @return status 500 if any error occurs
*/

app.get('/', jwt.verifyToken, async (req: Request, res: Response) => {
    const { _id } = req.body;
    TvShowNotes.find({ user_id: _id })
    .then((tvshowNotes) => {
        if (tvshowNotes) {
            res.status(200).send(tvshowNotes);
        } else {
            res.status(404).send({ message: 'Tvshow notes not found' });
        }
    })
    .catch((err: any) => {
        res.status(500).send({ message: err.message });
    })
})

/*
    * @function POST
    * @function_url '/add/:serie_id'
    * @description Add a tvshow note for a user
    * @return note if success
    * @return message if error
    * @need in body: notes (array of {season, note})
    * @need authorization token
    * @return status 201 if success
    * @return status 500 if error
    * @return status 403 if token is invalid
    * @return status 400 if tvshow_id or notes is missing
    * @return status 401 if tvshow note already exists
    * @return status 404 if tvshow not found
    * @return status 500 if any error occurs
*/

app.post('/add/:serie_id', jwt.verifyToken, async (req: Request, res: Response) => {
    const notes : {season: number, note: number}[] = req.body.notes;
    const { _id } = req.body;
    const { serie_id } = req.params;
    if (!notes || !serie_id) {
        return res.status(400).send({ message: 'Missing tvshow_id or notes' });
    }
    TvShowNotes.findOne({ serie_id, user_id: _id })
    .then((tvshowNote) => {
        if (tvshowNote)
            return res.status(401).send({ message: 'Tvshow note already exists' });
        else
            TvShowNotes.create({ serie_id , user_id: _id, notes })
            .then((tvshowNote) => {
                if (tvshowNote) {
                    res.status(201).send({message: 'Tvshow note created'})
                } else {
                    console.log(tvshowNote);
                    res.status(500).send({ message: 'Error while creating tvshow note' });
                }
            })
            .catch((err: any) => {
                console.log(err);
                res.status(500).send({ message: err.message });
            })
    })
    .catch((err: any) => {
        console.log(err.message)
        res.status(500).send({ message: err.message });
    })
})

/*
    * @function POST
    * @function_url '/update/:serie_id'
    * @description Update a tvshow note for a user
    * @return note if success
    * @return message if error
    * @need in body: notes (array of {season, note})
    * @need in params: serie_id
    * @need authorization token
    * @return status 201 if success
    * @return status 500 if error
    * @return status 403 if token is invalid
    * @return status 400 if tvshow_id or notes is missing
    * @return status 404 if tvshow note not found
*/

app.post('/update/:serie_id', jwt.verifyToken, async (req: Request, res: Response) => {
    const notes : {season: number, note: number}[] = req.body.notes;
    const { _id } = req.body;
    const { serie_id } = req.params;
    if (!notes || !serie_id) {
        return res.status(400).send({ message: 'Missing tvshow_id or notes' });
    }
    TvShowNotes.findOne({ serie_id, user_id: _id })
    .then((tvshowNote) => {
        if (!tvshowNote)
            return res.status(404).send({ message: 'Tvshow note not found' });
        else
            TvShowNotes.updateOne({ serie_id, user_id: _id }, { notes })
            .then((tvshowNote) => {
                if (tvshowNote) {
                    res.status(201).send(tvshowNote);
                } else {
                    res.status(500).send({ message: 'Error while updating tvshow note' });
                }
            })
            .catch((err: any) => {
                res.status(500).send({ message: err.message });
            })
    })
    .catch((err: any) => {
        res.status(500).send({ message: err.message });
    })
})

export default app;