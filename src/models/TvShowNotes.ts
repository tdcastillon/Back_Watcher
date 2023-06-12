import { Schema, model } from 'mongoose';

/**
 * @typedef {Object} MovieNotes
 * @property {number} serie_id
 * @property {ObjectID} user_id
 * @property {array} notes
 * @property {number} notes[].season
 * @property {number} notes[].note
*/

const serieNotesSchema = new Schema({
    serie_id: {
        type: Number,
        required: true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    notes: [{
        season: {
            type: Number,
            required: true,
        },
        note: {
            type: Number,
            required: true,
        },
    }],
});

const TvShowNotes = model('TvShowNotes', serieNotesSchema);

export default TvShowNotes;