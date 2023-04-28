import express from 'express';
import ReviewsCtrl from './reviews.controller.js';

const router = express.Router();

/*
router.route('/').get((req, res) => res.send('Hello World')); 
//Sends same response for ALL GET requests
*/

router.route('/movie/:id').get(ReviewsCtrl.apiGetReviews);
router.route('/new').post(ReviewsCtrl.apiPostReview);
router.route('/:id')
    .get(ReviewsCtrl.apiGetReview)
    .put(ReviewsCtrl.apiUpdateReview)
    .delete(ReviewsCtrl.apiDeleteReview);   //All 4 requests for same route
    //:id => a variable called id

export default router;

//A web app usually does a get request

//reviews.router.js sends the appropriate response for each review request based on path & method where the review request was sent  
//We use a controller file which tells us what route to go to to access different files