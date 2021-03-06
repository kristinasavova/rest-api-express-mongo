'use strict'; 

const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');  
const app = express(); 
const routes = require('./routes');

app.use(logger('dev'));
app.use(express.json());

/* Connect to the MongoDB server */ 
mongoose.connect('mongodb://localhost:27017/qa', { 
    useNewUrlParser: true,
    useUnifiedTopology: true
});

/* Monitor the status of the request through mongoose's connection object
   DB object will emit various events related to the database connection */ 
const db = mongoose.connection;

/* Listen to events related to the database connection and handle them when they occur */
db.on('error', err => {
    console.error('Connection error', err);
});

/* Mongoose will keep track of any DB requests made before the connection has been established
   and perform them after it has been established */
db.once('open', () => {   // open event - emitted when the connection is ready to go  
    console.log('Database connection is successful');
});

app.use((req, res, next) => {
    /* Grant access to the resources from any domain - cross origin requests */
    res.set('Access-Control-Allow-Origin', '*');
    /* Tell the client which headers are permitted in their request */
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    /* Grant preflight requests permission */
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
        res.status(200).json({}); 
    }
    next();
});

app.use('/questions', routes);

/* Catch 404 and forward to error handler */
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/* Error handler */
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

const port = process.env.PORT || 3000; 

app.listen(port, () => {
    console.log(`Express server is listening on port ${port}`);
});