'use strict'; 

const express = require('express');
const logger = require('morgan');  
const app = express(); 
const routes = require('./routes');

app.use(logger('dev'));
app.use(express.json());
app.use('/questions', routes);

const port = process.env.PORT || 3000; 

app.listen(port, () => {
    console.log(`Express server is listening on port ${port}`);
});