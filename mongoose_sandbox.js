'use strict';

const mongoose = require('mongoose');

/* Connect to the MongoDB server */ 
mongoose.connect('mongodb://localhost:27017/sandbox', { 
    useNewUrlParser: true,
    useUnifiedTopology: true
});

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
        type: { type: String, default: 'goldfish' },
        size: String,
        color: { type: String, default: 'golden' },
        mass: { type: Number, default: 0.007 },
        name: { type: String, default: 'Angela' }    
    }); 

    // pre-hook middleware - executes before mongo saves docs to the database
    AnimalSchema.pre('save', function(next) {
        // 'this' points to the docs to be saved 
        if (this.mass >= 100) {
            this.size = 'big';
        } else if (this.mass >= 5 && this.mass < 100) {
            this.size = 'medium';
        } else {
            this.size = 'small';
        }
        next();
    });

    // static method is a custom func we can call on the model directly to help us access data in custom ways 
    AnimalSchema.statics.findSize = function(size, callback) {
        // 'this' refers to the model - Animal 
        return this.find({ size }, callback);
    }

    // find data based on the doc that we already have => instance methods
    AnimalSchema.methods.findSameColor = function(callback) {
        // 'this' points to instances of the documents itself 
        return this.model('Animal').find({ color: this.color }, callback);
    } 

    // convert AnimalSchema into a model we can work with 
    // Animal is a collection in the MongoDB database  
    const Animal = mongoose.model('Animal', AnimalSchema); 

    const elephant = new Animal({  // create animal document 
        type: 'elephant',
        color: 'gray',
        mass: 6000,
        name: 'Lawrence'
    });

    // create a generic default doc (in this case a goldfish)
    const animal = new Animal({}); 

    const whale = new Animal({
        type: 'whale',
        mass: 190500,
        name: 'Fig'
    });

    const animalData = [
        { type: 'mouse', color: 'gray', mass: 0.035, name: 'Marvin' },
        { type: 'nutria',color: 'brown', mass: 6.35, name: 'Gretchen' },
        { type: 'wolf', color: 'gray', mass: 45, name: 'Iris' },
        elephant,
        animal,
        whale
    ];

    // remove all docs from the Animal collection before we save anything 
    Animal.deleteMany({}, err => {
        if (err) console.error(err);
        Animal.create(animalData, (err, animals) => {
            if (err) console.log(err);
            Animal.findOne({ type: 'elephant' }, (err, elephant) => {
                if (err) console.error(err); 
                // find all other animals with the same color as the elephant 
                elephant.findSameColor((err, animals) => {
                    if (err) console.error(err);
                    animals.forEach(animal => {
                        console.log(`${animal.name} the ${animal.color} ${animal.type} is ${animal.size}`);
                    });
                    db.close(() => {
                        console.log('db connection closed');
                    });  
                });
            });
        });
    });
}); 