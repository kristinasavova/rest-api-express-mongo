'use strict'; 

const express = require('express');
const logger = require('morgan');  
const app = express(); 
const routes = require('./routes');

app.use(logger('dev'));
app.use(express.json());
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
            message: err.message,
            stack: err.stack
        }
    });
});

const port = process.env.PORT || 3000; 

app.listen(port, () => {
    console.log(`Express server is listening on port ${port}`);
});