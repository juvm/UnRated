import mongodb from 'mongodb';

//const ObjectId =  mongodb.ObjectId;
//We can search database only by making use of a specific datatype, objectid, which is different from strings or ints

let reviews;

export default class ReviewsDAO {
    //------------------injectDB--------------------
    static async injectDB(conn) {
        if (reviews) {
            //If there is already a db connection
            return;
        }
        try {
            reviews = await conn.db('reviews').collection('reviews');
            //Gets the db connection
            //db name is reviews and collection name is reviews
            //db contains a number of collections
        } catch (e) {
            console.error(`Unable to establish collection handles in userDAO: ${e}`);
        }
    }

    //------------------addReview--------------------
    static async addReview(movieId, user, rating, headline, review, translation, review_time) {
        try {
            const reviewDoc = {
                movieId: movieId,
                user: user,
                rating: rating,
                headline: headline,
                review: review,
                translation: translation,
                review_time: review_time
            };
            return await reviews.insertOne(reviewDoc);
            //Inserting data so not gonna use ObjectId
            //insertOne is a mongodb command to insert a doc into the collection
        } catch (e) {
            console.error(`Unable to post review: ${e}`);
            return { error: e };
            //Probably because the user also needs to know what went wrong
        }
    }

    //------------------getReview--------------------
    static async getReview(reviewId) {
        try {
            return await reviews.findOne({ _id: new mongodb.ObjectId(reviewId) });
            //_id's are created automatically when we insert the data
            //We convert the string reviewId into ObjectId format to get the _id
            //Like previously noted, we can't rly query the db with usual strings or numbers - we have to send the ObjectId version
        } catch (e) {
            console.error(`Unable to get review: ${e}`);
            return { error: e };
        }
    }

    //------------------updateReview--------------------
    static async updateReview(reviewId, user, rating, headline, review, translation, review_time) {
        try {
            const updateResponse = await reviews.updateOne(
                { _id: new mongodb.ObjectId(reviewId) },
                { $set: { user: user, rating: rating, headline: headline, review: review, translation: translation, review_time: review_time } }
            );
            //updateOne() is a combination of find and post value which explains the two parameters
            //Second parameter sets the value to new value
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update review: ${e}`);
            return { error: e };
        }
    }

    //------------------deleteReview--------------------
    static async deleteReview(reviewId) {
        try {
            return await reviews.deleteOne({  _id: new mongodb.ObjectId(reviewId) }); //lLLLLLLLLLLLLLLLLLLLLLLLLLLL
        } catch (e) {
            console.error(`Unable to delete review: ${e}`);
            return { error: e };
        }
    }

    //------------------getReviewsByMovieId--------------------
    static async getReviewsByMovieId(movieId) {
        //movieId is an integer
        try {
            const cursor = await reviews.find({ movieId: parseInt(movieId) });
            //parseInt() converts string to integer
            //It is stored in cursor which is a list of all the documents
            return cursor.toArray();
        } catch (e) {
            console.error(`Unable to get review: ${e}`);
            return { error: e };
        }
    }

} 