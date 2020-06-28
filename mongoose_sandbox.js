'use strict';

const mongoose = require('mongoose');

/* Connect to the MongoDB server */ 
mongoose.connect('mongodb://localhost:27017/sandbox', { useNewUrlParser: true });

/* Monitor the status of the request through mongoose's connection object
   db object will emit various events related to the database connection */ 
const db = mongoose.connection;

/* Listen to events related to the database connection and handle them when they occur */

db.on('error', err => {
    console.error('Connection error', err);
});

db.once('open', () => {   // open event - emitted when the connection is ready to go  
    console.log('Database connection is successful');
    
    // all database communication goes here
    const { Schema } = mongoose; // create a schema
    const AnimalSchema = new Schema({  // create a schema to track animals
        type: String,
        size: String,
        color: String,
        mass: Number,
        name: String
    }); 

    // create a model which creates and saves our document objects 
    // Animal is a collection in the MongoDB database  
    const Animal = mongoose.model('Animal', AnimalSchema); 

    const elephant = new Animal({  // create animal document 
        type: 'elephant',
        size: 'big',
        color: 'grey',
        mass: 6000,
        name: 'Lawrence'
    });

    elephant.save(err => {  // save is asynchronous! 
        if (err) console.error('Save failed', err);
        else console.log('Saved!');
        db.close(() => {
            console.log('Database connection closed');
        });  
    });

}); 