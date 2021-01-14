import dotenv from 'dotenv'
dotenv.config();

import express from "express";
import './core/db';

import { UserCtrl } from './controllers/UserController';
import { registerValidations } from "./validations/register";
import { passport } from './core/passport';
import { TweetsCtrl } from './controllers/TweetsController';
import { tweetsValidations } from './validations/createTweet';
import multer from 'multer';
import bodyParser from 'body-parser';
import { UploadFileCtrl } from './controllers/UploadFileController';

const app = express();

// const upload = multer({ dest: 'uploads/' })
// const storage = multer.memoryStorage();
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(passport.initialize());

app.get('/users', UserCtrl.index);
app.get('/users/me', passport.authenticate('jwt'), UserCtrl.getUserInfo);
app.get('/users/:id', UserCtrl.show);

app.get('/tweets', TweetsCtrl.index);
app.get('/tweets/:id', TweetsCtrl.show);
app.delete('/tweets/:id', passport.authenticate('jwt'), TweetsCtrl.delete);
app.post('/tweets', passport.authenticate('jwt'), tweetsValidations, TweetsCtrl.create);
app.patch('/tweets/:id', passport.authenticate('jwt'), tweetsValidations, TweetsCtrl.update);

app.get('/auth/verify', registerValidations, UserCtrl.verify);
app.post('/auth/register', registerValidations, UserCtrl.create);
app.post('/auth/login', passport.authenticate('local'), UserCtrl.afterLogin);

app.post('/upload', upload.single('avatar'), UploadFileCtrl.upload);

// app.patch('/users', UserCtrl.update);
// app.delete('/users', UserCtrl.delete);

app.get('/users');

app.listen(8888, (): void => {
    // if (err) {
    //     throw new Error(err);
    // }
    console.log('SERVER RUNNING!');
});