import express from 'express';
import cors from 'cors';  //cross-origin resource sharing
import reviews from './backend/api/reviews.route.js';

const app = express();
app.use(cors());
app.use(express.json());
//app.use(express.urlencoded({extended: true}));

app.use('/api/v1/reviews', reviews);   //For this path, use 'reviews' module that we imported
app.use('*', (req, res) => res.status(404).json({error: 'Not found'}));   //For this path => all paths (means unspecified) send this response

export default app;

//server.js handles the server requests 
//It basically sends requests to correct route

/*
  We make use of ES6 modules import/export here;
  in commonjs we use
  const express = require('express') to use the 
  express module. However, in ES6 standard:
  1. Write "type": "module" in package.json file
  2. npm i "package-name" in terminal for all 
  packages we're gonna be using
  3. In the program 
  import <module-name> from <pkg-name>
  if it's a global package like express, cors, etc.
  Else if it is a local package, write relative
  address\filename.js as package name
*/