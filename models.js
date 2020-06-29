'use strict'; 

const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * A sorting func that returns:
 * - negative (-) if a is before b
 * - positiv (+) if b appears before a 
 * - 0 to leave the order unchanged  
 * @param {object} a 
 * @param {object} b 
 */
const sortAnswers = function(a, b) {
    /* If votes match, order by the updatedAt date - a number of ms that has elapsed since the
       midnight Thursday the 1st of January 1970 - more recent times are bigger in number than less recent  */
    if (a.votes === b.votes) { 
        // returns the difference in ms and orders the larger or later date first 
        return b.updatedAt - a.updatedAt;  
    }
    return b.votes - a.votes; 
}

const AnswerSchema = new Schema({
    text: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    votes: { type: Number, default: 0 }
});

/**
 * An instance method to merge the updates into the answer document 
 * This refers to the instance of the document itself 
 */
AnswerSchema.method('update', function(updates, callback) {
    /* Object.assign(target, ...sources) copies the values of all the properties from one or more 
       source objects to a target object */
    Object.assign(this, updates, { updatedAt: new Date() });
    /* In order to save a child doc, we have to save its parent doc */
    this.parent().save(callback);
});

/**
 * An instance method to translate strings from the URL into math that moves the counts up and down
 * This refers to the instance of the document itself  
 */
AnswerSchema.method('vote', function(vote, callback) {
    if (vote === 'up') {
        this.votes += 1;
    } else {
        this.votes -= 1;
    }
    this.parent().save(callback);
});

const QuestionSchema = new Schema({
    text: String,
    createdAt: { type: Date, default: Date.now },
    answers: [ AnswerSchema ]
});

/**
 * A middleware to sort the answers before saving 
 */
QuestionSchema.pre('save', function(next) {
    // this refers to the docs to be saved 
    this.answers.sort(sortAnswers);
    next();
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports.Question = Question; 