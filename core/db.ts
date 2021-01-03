import mongoose from 'mongoose';
const config = require("config");

(<any>mongoose).Promise = Promise;

mongoose.connect(config.get('dbUrl'), {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

export { db, mongoose };


// {
//     "serverPort" : 5000,
//     "dbUrl" : "mongodb+srv://dbUser:1987toyuiui@platform.pfgw5.mongodb.net/PLATFORM?retryWrites=true&w=majority",
//     "secretKey": "mern-secret-key"
// }
