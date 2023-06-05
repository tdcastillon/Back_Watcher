import { Schema, model } from 'mongoose';

/**
 * @typedef {Object} User
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {boolean} is_verified
 * @property {string} avatar_url
*/

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    is_verified: {
        type: Boolean,
        default: false,
    },
    avatar_url: {
        type: String,
        default: '',
    }
});

const User = model('User', userSchema);

export default User;