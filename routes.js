'use strict';

const express = require('express'); 
const router = express.Router();

/* GET /questions and return all the questions */
router.get('/', (req, res) => {
    res.json({ response: 'You sent me a GET request' });
});

/* POST /questions and create a question */
router.post('/', (req, res) => {
    res.json({ 
        response: 'You sent me a POST request',
        body: req.body 
     });
});

/* GET /questions/:qID and return a specific question */
router.get('/:qID', (req, res) => {
    res.json({ response: `You sent me a GET request for ID ${req.params.qID}` });
});

/* POST /questions/:qID/answers and create an answer */
router.post('/:qID/answers', (req, res) => {
    res.json({ 
        response: 'You sent me a POST request to /answers',
        questionID: req.params.qID,
        body: req.body 
     });
});

/* PUT /questions/:qID/answers/:aID and edit a specific answer */
router.put('/:qID/answers/:aID', (req, res) => {
    res.json({ 
        response: 'You sent me a PUT request to /answers',
        questionID: req.params.qID,
        answerID: req.params.aID, 
        body: req.body 
     });
});

/* DELETE /questions/:qID/answers/:aID and delete a specific answer */
router.delete('/:qID/answers/:aID', (req, res) => {
    res.json({ 
        response: 'You sent me a DELETE request to /answers',
        questionID: req.params.qID,
        answerID: req.params.aID
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
    (req, res) => {
        res.json({ 
            response: 'You sent me a POST request to /vote',
            questionID: req.params.qID,
            answerID: req.params.aID,
            vote: req.params.dir
        });
});

module.exports = router; 