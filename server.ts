import express from "express";

const app = express();

app.get('/users');

app.listen(8888, (): void => {
    // if (err) {
    //     throw new Error(err);
    // }
    console.log('SERVER RUNNNING!');
});