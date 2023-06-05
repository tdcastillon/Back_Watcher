import { Schema, model } from 'mongoose';

/**
 * @typedef {Object} MovieNotes
 * @property {number} movie_id
 * @property {ObjectID} user_id
 * @property {number} note
*/

const movieNotesSchema = new Schema({
    movie_id: {
        type: Number,
        required: true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    note: {
        type: Number,
        required: true,
    },
});


const MovieNotes = model('MovieNotes', movieNotesSchema);

export default MovieNotes;