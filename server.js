const cheerio = require("cheerio");
const request = require("request");
const mongojs = require("mongojs");
const mongoose = require("mongoose");

const SMASHING_MAGAZINE_URL = "https://www.smashingmagazine.com";

/////////////////////////////////////////////////////////
// handle environment variables
/////////////////////////////////////////////////////////
// use dotenv to read .env vars into Node but silence the Heroku log error for production as no .env will exist
require('dotenv').config( { silent: process.env.NODE_ENV === 'production' } );

// process.env.NODE_ENV is set by heroku with a default value of production
if (process.env.NODE_ENV === 'production') {
  console.log("in PROD");
  // connect to the JawsDB on heroku
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  console.log("in DEV");
  // use the connection info from the .env file otherwise
  require('dotenv').load();
}
// console.log("process env: " + JSON.stringify(process.env,null,'\t'));


//////////////////////////
// dependencies
//////////////////////////
var express = require("express");
var session = require('express-session');
var path = require('path');
var bodyParser = require("body-parser");

// var cookieParser = require('cookie-parser');

// var db = require("./models");                               // models are required to sync them

///////////////////////
// configure Express
///////////////////////
var app = express();
app.use(express.json());

// sets the port info
app.set('port', (process.env.PORT || 8080));

// body parsing middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(cookieParser());

// serve static folders
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/assets/img')); 

/////////////////////////
// connect to Mongo DB
/////////////////////////
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

////////////////////////////////////////
// Database configuration -- mongojs
////////////////////////////////////////
var databaseUrl = "mongoHeadlines";
var collections = ["scrapedArticles"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

/////////////////
// handlebars
/////////////////
var exphbs = require("express-handlebars");

// handlebar configuration
app.set('views', path.join(__dirname, 'views'));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

/////////////////////
// Expess Session
/////////////////////
// console.log("secret: " +  process.env.SECRET_KEY);
app.use(session({
  secret: process.env.SECRET_KEY,     // put this in the heroku environment variables
  saveUninitialized: true,
  resave: true
}));

////////////////////////////////////////////////////////
// Import routes and give the server access to them.
////////////////////////////////////////////////////////
// var routes = require("./controllers/app_controller.js");
// app.use(routes);

////////////////////////////
// functions
////////////////////////////
const scrapeSite = function () {
    // First, tell the console what server.js is doing
    console.log("\n***********************************\n" +
                "Grabbing every article name and link\n" +
                "from Smashing Magazines's web site:" +
                "\n***********************************\n");

    // Making a request for Smashing Magazines's web site for articles. The page's HTML is passed as the callback's third argument
    request("https://www.smashingmagazine.com/articles/", function(error, response, html) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    const $ = cheerio.load(html, { ignoreWhitespace: true });

    // An empty array to save the data that we'll scrape
    var results = [];

        ////////////////////////////////////////////////////////////////////////////////////////
        // for each article
        //   * Headline - the title of the article
        //   * Summary - a short summary of the article
        //   * URL - the url to the original article
        //   * Feel free to add more content to your database (photos, bylines, and so on).
        ////////////////////////////////////////////////////////////////////////////////////////

        // With cheerio, find each "article--post" class
        // (i: iterator. element: the current element)
        $(".article--post").each(function(i, element) {

            // Save the text of the "article--post__title" class element in a "headline" variable
            var headline = $(element).find(".article--post__title").text();

            // In the currently selected element, look at its child elements (i.e., its p-tags with a class "article--post__teaser"),
            // then filter for any text elements that are contents and save it to the "summary" variable
            var summary = $(element).find("p.article--post__teaser").first().contents().filter(function() {
                return this.type === 'text';
            }).text();

            // console.log("Stuff: " + $(element).find("div.author__image").children("div").data('alt'));

            // use cheerio to scrape the html and get the author, url and date of the article
            var author = $(element).find("div.author__image").children("div").data('alt');
            var urlLink = $(element).find(".article--post__title").children().attr("href");
            var date = $(element).find(".article--post__teaser time").attr("datetime");

            // Save these results in an object that we'll push into the results array we defined earlier
            results.push({
                headline: headline,
                summary: summary.trim(),
                urlLink: SMASHING_MAGAZINE_URL + urlLink,
                author: author,
                date: date
            });

            ////////////////////////
            // push to Mongo DB
            ////////////////////////

            // If this found element had both a title and a link
            if (headline && urlLink) {
                // Insert the data in the scrapedData db
                db.scrapedArticles.insert({
                    headline: headline,
                    summary: summary.trim(),
                    urlLink: SMASHING_MAGAZINE_URL + urlLink,
                    author: author,
                    date: date
                },
                function(err, inserted) {
                if (err) {
                    // Log the error if one is encountered during the query
                    console.log(err);
                }
                else {
                    // Otherwise, log the inserted data
                    console.log(inserted);
                }
                });
            }
        });

    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);
    });
};

////////////////////////////
// execute program
////////////////////////////
scrapeSite();

app.listen(app.get('port'), function() {
    console.log("App now listening at localhost: " + app.get('port'));
});