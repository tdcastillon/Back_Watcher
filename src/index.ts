import mongoose, { ConnectOptions } from 'mongoose';
import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import MainRouter from './routes/main_router';

import secret_key from './functions/secret_key';

const app = express();

secret_key.generateSecretKey();


mongoose.connect("mongodb+srv://Heairo:Pass20mot@cluster0.0dksk.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions);

mongoose.set('strictQuery', false);

const db = mongoose.connection;
db.on('error', (error: any) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', MainRouter);

app.listen(8080, () => {
    console.log('Server is running at \'http://localhost:8080\'');
});