///////////////////////////////////////////////////////////////////////////////////////////////////
// File Name: html-routes.js 
//
// Description: This file offers a set of routes for sending users to the various html pages
///////////////////////////////////////////////////////////////////////////////////////////////////

const cheerio = require("cheerio");
const request = require("request");
const db = require("./../../../models");
const LOAD_FROM_SCRAPE = false;

const SMASHING_MAGAZINE_URL = "https://www.smashingmagazine.com";

module.exports = function(app) {

  //////////////////////
  // functions
  //////////////////////
  const scrapeSite = function (callback) {
    // First, tell the console what server.js is doing
    console.log("\n***********************************\n" +
                "Grabbing every article name and link\n" +
                "from Smashing Magazines's web site:" +
                "\n***********************************\n");

    // Making a request for Smashing Magazines's web site for articles. The page's HTML is passed as the callback's third argument
    request("https://www.smashingmagazine.com/articles/", function(error, response, html) {

      if (error) {
        return console.error('scape from site failed: ', error);
      }

      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      const $ = cheerio.load(html, { ignoreWhitespace: true });

      // An empty array to save the data that we'll scrape
      let results = [];

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

          // If this found element had both a headline and a link
          if (headline && urlLink) {

            // save the results in an object that we'll push into the results array that we defined earlier
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

            // console.log("route: scrape is creating article");

            // Save a new Example using the data object
            // db.Article.create({
            //   headline: headline,
            //   summary: summary.trim(),
            //   urlLink: SMASHING_MAGAZINE_URL + urlLink,
            //   author: author,
            //   date: date
            // })
            // .then(function(savedData) {
            //   // if saved successfully
            //   // console.log(savedData);


            // })
            // .catch(function(err) {
            //   // If an error occurs, log the error message
            //   console.log(err.message);
            // });
           
          }
      });

      // log the results once you've looped through each of the elements found with cheerio
      // console.log(results);

      // call the callback function with the result data returned from the scrape
      callback(null, results);
    });

  };

  //////////////////////
  // Routes 
  //////////////////////

  // GET root route
  app.get("/", function(req, res) {
    // show all of the existing content along with the comments
    res.redirect("/api/articles");
  });

  // GET scrape route to retrieve articles
  app.get("/scrape", function(req, res) {
    console.log("route: in scrape articles");

    // scrapes and returns articles
    scrapeSite(function(err,articleList) {
      console.log("returned results in");
      console.log(JSON.stringify(articleList));
  
      // for each item in the articleList, find it in Mongo and if it's not there, append it to a new array
      // save the new ones to mongo
      var newArticleList = [];

      articleList.forEach((item, index) => {
        console.log("Finding: " + item.headline);

        db.Article.find({headline: item.headline.trim()})
          .then(function(dbResult){
            console.log(dbResult);

            if (dbResult.length === 0) {
              // if don't find it, we'll need to add it
              console.log(item);
              newArticleList.push(item);

            ////////////////////////
            // push to Mongo DB
            ////////////////////////

            console.log("scrape is creating NEW article");

            // Save a new Example using the data object
            db.Article.create({
              headline: item.headline,
              summary: item.summary.trim(),
              urlLink: item.urlLink,  // website url has aleady been appended at this point
              author: item.author,
              date: item.date
            })
            .then(function(savedData) {
              // if saved successfully
              // console.log(savedData);
            })
            .catch(function(err) {
              // If an error occurs, log the error message
              console.log(err.message);
            });

            }

          })
          .catch(function(err) {
            // If an error occurs, log the error message
            console.log(err.message);
          });

      });
        
      // send the new article list to handlebars
      var hbsObject = {
        articles: newArticleList,
        isScraping: true
      };
      res.render("index", hbsObject);   
    
      // END SCRAPESITE
    });

  });
  
  // GET clear all articles (and their associated comments) route
  app.get("/clear", function(req, res) {
    console.log("route: in clear all articles");

    // clear all data
    db.ArticleComment.deleteMany({}, function(err) {});
    db.Article.deleteMany({}, function(err) {});

    res.redirect("/api/articles");
  });

};
