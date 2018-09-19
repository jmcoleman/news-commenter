///////////////////////////////////////////////////////////////////////////////////////////////////
// File Name: api-routes.js 
//
// Description: This file offers a set of routes for displaying and saving news articles
///////////////////////////////////////////////////////////////////////////////////////////////////

// Requiring our models
var db = require("./../../../models");

/////////////////
// Routes
/////////////////
module.exports = function(app) {

  /////////////////////////////////////////////
  // GET route for getting all of the articles
  /////////////////////////////////////////////
  app.get("/api/articles", function(req, res) {
    var query = {};

    console.log("route: all articles");
    console.log(JSON.stringify(req.body));

    //find all articles
    db.Articles.findAll({
      where: query
    }).then(function(dbResult) {
      // res.json(dbResult);

      // send to handlebars
      var hbsObject = {
        articles: dbResult
      };
      res.render("articles", hbsObject);
    });
  });

  /////////////////////////////////////////////
  // GET route for retrieving a single article
  /////////////////////////////////////////////
  app.get("/api/articles/:id", function(req, res) {

    console.log("route: specific article");
    console.log(JSON.stringify(req.body));

    db.Articles.findAll({
      where: {
        article_id: req.params.id
      }
    }).then(function(dbResult) {
      // res.json(dbResult);

      // send to handlebars
      var hbsArticle = {
        article: dbResult
      };
      // console.log(dbResult);
      res.render("articles", hbsArticle);
    });
  });

  /////////////////////////////////////////////
  // POST route for saving new article
  /////////////////////////////////////////////
  app.post("/api/articles", function(req, res) {

    console.log("route: create article");
    console.log(JSON.stringify(req.body));

    db.Articles.create(req.body).then(function(dbResult) {
      console.log("Article created.");
      res.json(dbResult);
    }).catch(function (err) {
      // send to handlebars
      var hbsObject = {
        article: req.body
      };
      res.render("articles", hbsObject);
    });
  });

  /////////////////////////////////////////////
  // DELETE route for deleting a article
  /////////////////////////////////////////////
  app.delete("/api/articles/:id", function(req, res) {

    console.log("route: delete a article");
    console.log(JSON.stringify(req.body));

    db.Articles.destroy({
      where: {
        article_id: req.params.id
      }
    }).then(function(dbResult) {
      console.log("after the deletion of article");
      res.json(dbResult);
    });
  });

  /////////////////////////////////////////////
  // PUT route for updating
  /////////////////////////////////////////////
  app.put("/api/articles/:id", function(req, res) {

    console.log("route: update article");
    console.log(JSON.stringify(req.body));
    console.log("request query: " + req.query.articles_id);
    console.log("request params: " + req.params.id);

    var id = (req.params.id) ? req.params.id : req.body.id;

    db.Articles.update(
      req.body,
      {
        where: {
          article_id: id
        }
      }).then(function(dbResult) {
        res.json(dbResult);
    });
  });


////////////////////////////////////////////

// Scrape data from one site and place it into the mongodb db
// app.get("/scrape", function(req, res) {
//   // Make a request for the news section of `ycombinator`
//   request("https://news.ycombinator.com/", function(error, response, html) {
//     // Load the html body from request into cheerio
//     var $ = cheerio.load(html);
//     // For each element with a "title" class
//     $(".title").each(function(i, element) {
//       // Save the text and href of each link enclosed in the current element
//       var title = $(element).children("a").text();
//       var link = $(element).children("a").attr("href");

//       // If this found element had both a title and a link
//       // if (title && link) {
//       //   // Insert the data in the scrapedData db
//       //   db.scrapedData.insert({
//       //     title: title,
//       //     link: link
//       //   },
//       //   function(err, inserted) {
//       //     if (err) {
//       //       // Log the error if one is encountered during the query
//       //       console.log(err);
//       //     }
//       //     else {
//       //       // Otherwise, log the inserted data
//       //       console.log(inserted);
//       //     }
//       //   });
//       // }
//     });
//   });

  ///////////////////////////////////////////

////////////////////////////
// functions
////////////////////////////
// const scrapeSite = function () {
//   // First, tell the console what server.js is doing
//   console.log("\n***********************************\n" +
//               "Grabbing every article name and link\n" +
//               "from Smashing Magazines's web site:" +
//               "\n***********************************\n");

//   // Making a request for Smashing Magazines's web site for articles. The page's HTML is passed as the callback's third argument
//   request("https://www.smashingmagazine.com/articles/", function(error, response, html) {

//   // Load the HTML into cheerio and save it to a variable
//   // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
//   const $ = cheerio.load(html, { ignoreWhitespace: true });

//   // An empty array to save the data that we'll scrape
//   var results = [];

//       ////////////////////////////////////////////////////////////////////////////////////////
//       // for each article
//       //   * Headline - the title of the article
//       //   * Summary - a short summary of the article
//       //   * URL - the url to the original article
//       //   * Feel free to add more content to your database (photos, bylines, and so on).
//       ////////////////////////////////////////////////////////////////////////////////////////

//       // With cheerio, find each "article--post" class
//       // (i: iterator. element: the current element)
//       $(".article--post").each(function(i, element) {

//           // Save the text of the "article--post__title" class element in a "headline" variable
//           var headline = $(element).find(".article--post__title").text();

//           // In the currently selected element, look at its child elements (i.e., its p-tags with a class "article--post__teaser"),
//           // then filter for any text elements that are contents and save it to the "summary" variable
//           var summary = $(element).find("p.article--post__teaser").first().contents().filter(function() {
//               return this.type === 'text';
//           }).text();

//           // console.log("Stuff: " + $(element).find("div.author__image").children("div").data('alt'));

//           // use cheerio to scrape the html and get the author, url and date of the article
//           var author = $(element).find("div.author__image").children("div").data('alt');
//           var urlLink = $(element).find(".article--post__title").children().attr("href");
//           var date = $(element).find(".article--post__teaser time").attr("datetime");

//           // Save these results in an object that we'll push into the results array we defined earlier
//           results.push({
//               headline: headline,
//               summary: summary.trim(),
//               urlLink: SMASHING_MAGAZINE_URL + urlLink,
//               author: author,
//               date: date
//           });

//           ////////////////////////
//           // push to Mongo DB
//           ////////////////////////

//           // If this found element had both a title and a link
//           if (headline && urlLink) {
//               // Insert the data in the scrapedData db
//               db.scrapedArticles.insert({
//                   headline: headline,
//                   summary: summary.trim(),
//                   urlLink: SMASHING_MAGAZINE_URL + urlLink,
//                   author: author,
//                   date: date
//               },
//               function(err, inserted) {
//               if (err) {
//                   // Log the error if one is encountered during the query
//                   console.log(err);
//               }
//               else {
//                   // Otherwise, log the inserted data
//                   console.log(inserted);
//               }
//               });
//           }
//       });

//   // Log the results once you've looped through each of the elements found with cheerio
//   console.log(results);
//   });
// };

////////////////////////////
// execute program
////////////////////////////
// scrapeSite();

};