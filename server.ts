import dotenv from 'dotenv'
dotenv.config();

import express from "express";
import './core/db';

import { UserCtrl } from './controllers/UserController';
import { registerValidations } from "./validations/register";


const app = express();

app.use(express.json());

app.get('/users', UserCtrl.index);
app.post('/users', registerValidations, UserCtrl.create);
app.get('/users/verify', registerValidations, UserCtrl.verify);
// app.patch('/users', UserCtrl.update);
// app.delete('/users', UserCtrl.delete);

app.get('/users');

app.listen(8888, (): void => {
    // if (err) {
    //     throw new Error(err);
    // }
    console.log('SERVER RUNNNING!');
});