'use strict';

const express = require('express'); 
const router = express.Router();
const { Question } = require('./models'); // import Question model  

/* GET /questions and return all the questions */
router.get('/', (req, res, next) => {
    Question.find({})
        .sort({createdAt: -1 })
        .exec((err, questions) => {
            if (err) next(err); 
            res.json(questions);
    });
});

/* POST /questions and create a question */
router.post('/', (req, res, next) => {
    const question = new Question(req.body); 
    question.save((err, question) => {
        if (err) next(err); 
        res.status(201).json(question); 
    }); 
});

/* GET /questions/:qID and return a specific question */
router.get('/:qID', (req, res, next) => {
    Question.findById(req.params.qID, (err, question) => {
        if (err) next(err);
        if (question) {
            res.json(question);
        } else {
            const err = new Error('Not Found');
            err.status = 404;
            next(err); 
        }
    }); 
});

/* POST /questions/:qID/answers and create an answer */
router.post('/:qID/answers', (req, res, next) => {
    Question.findById(req.params.qID, (err, question) => {
        if (err) next(err);
        if (question) {
            question.answers.push(req.body);
            question.save((err, question) => {
                if (err) next(err);
                res.status(201).json(question);
            });
        } else {
            const err = new Error('Not Found!');
            err.status = 404;
            next(err); 
        }
    });
});

/* PUT /questions/:qID/answers/:aID and edit a specific answer */
router.put('/:qID/answers/:aID', (req, res) => {
    Question.findById(req.params.qID, (err, question) => {
        if (err) next(err);
        if (question) {
            /* The id method takes an ID of a sub-doc and returns sub-doc with that matching ID */
            const answer = question.answers.id(req.params.aID); 
            if (answer) {
                answer.update(req.body, err => {
                    if (err) next(err);
                    res.set('Location', '/').sendStatus(204);
                });
            } else {
                const err = new Error('Not Found');
                err.status = 404;
                next(err); 
            }
        } else {
            const err = new Error('Not Found');
            err.status = 404;
            next(err);
        }
    });
});

/* DELETE /questions/:qID/answers/:aID and delete a specific answer */
router.delete('/:qID/answers/:aID', (req, res) => {
    Question.findById(req.params.qID, (err, question) => {
        if (err) next(err);
        if (question) {
            const answer = question.answers.id(req.params.aID);
            if (answer) {
                answer.remove(err => {
                    if (err) next(err);
                    question.save(err => {
                        if (err) next(err);
                        res.set('Location', '/').sendStatus(204);
                    });
                });
            } else {
                const err = new Error('Not Found');
                err.status = 404;
                next(err); 
            }
        } else {
            const err = new Error('Not Found');
            err.status = 404;
            next(err); 
        }
    });
});

/* POST /questions/:qID/answers/:aID/vote-up 
   POST /questions/:qID/answers/:aID/vote-down 
   Vote on a specific answer */
router.post('/:qID/answers/:aID/vote-:dir', 
    (req, res, next) => {
        if (req.params.dir.search(/^(up|down)$/) === -1) {
            const err = new Error('Not Found');
            err.status = 404;
            next(err); 
        } else { 
            next();
        }
    },
    (req, res, next) => {
        Question.findById(req.params.qID, (err, question) => {
            if (err) next(err);
            if (question) {
                const answer = question.answers.id(req.params.aID);
                if (answer) {
                    const vote = req.params.dir;
                    answer.vote(vote, (err, question) => {
                        if (err) next(err);
                        res.json(question);
                    });
                } else {
                    const err = new Error('Not Found');
                    err.status = 404;
                    next(err); 
                }
            } else {
                const err = new Error('Not Found');
                err.status = 404;
                next(err); 
            }
        });
    }
);

module.exports = router; 