import dotenv from 'dotenv'

import app from './server.js'
import mongodb from 'mongodb'
import ReviewsDAO from './backend/dao/reviewsDAO.js'
//DAO stands for data access object
//It is a common pattern for writing programs working with databases
//ReviewsDAO is what we're actually gonna use to make changes to the database

dotenv.config(); //To use data from .env file, the config fn has parameters the path of the .env file

const MongoClient = mongodb.MongoClient;
const mongo_username = process.env['MONGO_USERNAME'];
const mongo_password = process.env['MONGO_PASSWORD'];

const uri = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.lyr5qsv.mongodb.net/?retryWrites=true&w=majority`;

const port = process.env['PORT'];

MongoClient.connect(
    uri,
    {
        //options to configure the connection
        maxPoolSize: 50,
        wtimeoutMS: 2500, //Timeout if it does not connect within 25 seconds
        useNewUrlParser: true
    })
    .catch(err => {
        //Body of the function
        //Always deal with errors
        //This will catch & print any errors that might happen
        console.error(err.stack);
        process.exit(1); //Ends the program
    })
    .then(async client => {
        //client variable is what comes from the connection to the db
        //It is the result of MongoClient.connect()
        await ReviewsDAO.injectDB(client);
        app.listen(port, () => {
            //Error function with no parameters
            console.log(`Listening on port ${port}`);
        })
    });

    //async function runs asynchronously-can run at the same time as other functions
    //So you don't have to wait for one thing to end before other happens
    //Or make sure to wait before something else happens

    //index.js gives the entry-point