import ReviewsDAO from '../dao/reviewsDAO.js';
import AzureHelper from '../Azure/text_transform.js';

export default class ReviewsController {
    //A class is used in js to export multiple functions

    //-------------------POST A REVIEW-------------------
    static async apiPostReview(req, res, next) {
        //static function so that it can be called without an instance
        try {

            const movieId = parseInt(req.body.movieId);
            const user = req.body.user;
            let rating;
            const headline = req.body.headline;
            const review = req.body.review;
            const review_time = req.body.review_time;

            //Added code fragment and changed "const rating = req.body.rating;" to "let rating;"
            if(req.body.rating === "" || req.body.rating == 0) {
                rating = await AzureHelper.sentimentMining([review]); //Sending an array of strings as that is the value the Azure functions take
                console.log(rating);

            } else { 
                rating = req.body.rating; //add below code to front-end checking
                if(rating > 10)
                    while (rating > 10) 
                        rating /= 10;
                else if(rating < 1)
                    while (rating < 1) 
                        rating *= 10;
            }
            const roundedRating = Math.round(rating * 10) / 10;
            //End of addition 1

            //Azure code fragment to save translated reviews in case of non-English reviews
            let language = await AzureHelper.languageDetection([req.body.review]);
            console.log(language);
            let translatedReview = "";
            
            if(language != "en") {     
                translatedReview = await AzureHelper.translatesReviews(language, req.body.review);
                console.log(translatedReview);
            }
            //End of addition 2 
            
            const reviewResponse = await ReviewsDAO.addReview(
                movieId,
                user,
                roundedRating,
                headline,
                review,
                translatedReview,
                review_time
            );
            res.json({ status: 'Success' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    //-----------------GET USER REVIEWS-----------------
    static async apiGetReview(req, res, next) {
        try {
            let id = req.params.id || {};   //Body of req => data that is sent, parameters => url data
            let review = await ReviewsDAO.getReview(id);

            if (!review) {
                res.status(404).json({ error: 'Not found' });
                return;
            }
            res.json(review);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    //-----------------UPDATE REVIEW-----------------
    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.params.id;
            let rating;
            const headline = req.body.headline;
            const review = req.body.review;
            const review_time = req.body.review_time;
            const user = req.body.user;

            //Added code fragment and changed "const rating = req.body.rating;" to "let rating;"
            if(req.body.rating === "" || req.body.rating == 0) {
                rating = await AzureHelper.sentimentMining([review]); //Sending an array of strings as that is the value the Azure functions take
                console.log(rating);
            } else { 
                rating = req.body.rating; //add below code to front-end checking
                if(rating > 10)
                    while (rating > 10) 
                        rating /= 10;
                else if(rating < 1)
                    while (rating < 1) 
                        rating *= 10;
            }
            const roundedRating = Math.round(rating * 10) / 10;
            //End of addition

            //Azure code fragment to save translated reviews in case of non-English reviews
            let language = await AzureHelper.languageDetection([req.body.review]);
            console.log(language);
            let translatedReview = "";
            
            if(language != "en") {     
                translatedReview = await AzureHelper.translatesReviews(language, req.body.review);
                console.log(translatedReview);
            }
            //End of addition 2 

            const reviewResponse = await ReviewsDAO.updateReview (
                reviewId,
                user,
                roundedRating,
                headline,
                review,
                translatedReview,
                review_time
            );

            var { error } = reviewResponse;
            if (error) {
                res.status(400).json({ error });
            }

            if (reviewResponse.modifiedCount === 0) {
                throw new Error('Unable to update review');
            }

            res.json({ status: 'success' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    //-----------------DELETE REVIEW-----------------
    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.params.id;
            const reviewResponse = await ReviewsDAO.deleteReview(reviewId);
            res.json({ status: 'success' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    //-------------GET REVIEWS BY MOVIE-------------
    static async apiGetReviews(req, res, next) {
        try {
            let id = req.params.id || {};
            let reviews = await ReviewsDAO.getReviewsByMovieId(id);

            if (reviews.length === 0) {
                res.status(404).json({ error: 'Not found' });
                return;
            }
            res.json(reviews);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }
}

//Controller file gets info that was sent to route and sends it to the DAO

/*
  Problem encountered: I was not able to add or update reviews - after many
  experiments I realized that it was because my program was not parsing the
  request body. All of this was because I was not using the cors() in my app.
  Also learnt how to send http requests via curl in the command line.
  Actually, the problem was also that curl on windows ps/cmd/vscode was not
  sending parsable data or something? 
  However after wasting 2 days away on this, I am finally able to add and
  update the reviews in the database by making use of Advanced REST client 
  extension on Chrome.
  The code works perfectly.
*/