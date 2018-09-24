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

    console.log("route: all articles");
    // console.log(JSON.stringify(req.body));

    //find all articles
    db.Article.find({})
      .then(function(dbResult) {
        // res.send(dbResult);

        // send to handlebars
        var hbsObject = {
          articles: dbResult
        };
        res.render("index", hbsObject);       
      })
      .catch(function(err) {
        // If an error occurs, log the error message
        console.log(err.message);
      });
   
  });

  /////////////////////////////////////////////
  // GET route for retrieving a single article
  /////////////////////////////////////////////
  app.get("/api/articles/:id", function(req, res) {

    console.log("route: specific article");
    // console.log(JSON.stringify(req.body));

    db.Article.findById(req.params.id, function(err, article) {})
      .then(function(dbResult) {
        // res.send(dbResult);

        // send to handlebars
        var hbsArticle = {
          articles: dbResult
        };
        // console.log(dbResult);
        res.render("index", hbsArticle); 
      });
  });

  /////////////////////////////////////////////
  // POST route for saving new article
  /////////////////////////////////////////////
  app.post("/api/articles", function(req, res) {

    console.log("route: create article");
    console.log(JSON.stringify(req.body));

    // Save a new Example using the data object
    db.Article.create({
      headline: req.body.headline,
      summary: req.body.summary.trim(),
      urlLink: req.body.urlLink,
      author: req.body.author,
      date: req.body.date
    })
    .then(function(savedData) {
      // If saved successfully, print the new document to the console
      // console.log(savedData);

      // send to handlebars
      var hbsObject = {
        articles: savedData
      };
      res.render("index", hbsObject);
    })
    .catch(function(err) {
      // If an error occurs, log the error message
      console.log(err.message);
    });

  });


  /////////////////////////////////////////////
  // DELETE route for deleting a article
  /////////////////////////////////////////////
  app.delete("/api/articles/:id", function(req, res) {

    console.log("route: delete a article");
    console.log(JSON.stringify(req.body));

    db.Article.findByIdAndRemove(req.params.id)
      .then(function(dbResult) {
        console.log("after the deletion of article: " + req.params.id);
        res.json(dbResult);
      });
  });

  /////////////////////////////////////////////
  // PUT route for updating
  /////////////////////////////////////////////
  app.put("/api/articles/:id", function(req, res) {

    console.log("route: update article");
    // console.log(JSON.stringify(req.body));
    // console.log("request query: " + req.query.articles_id);
    // console.log("request params: " + req.params.id);

    var id = (req.params.id) ? req.params.id : req.body.id;
    var comment = req.query.comment ? true : false;
    
    // update db here
    db.Article.
      findOne({ _id: id }).
      populate('comment'). 
      exec(function (err, article) {
        if (err) return handleError(err);

        console.log('The author is %s', article.comment.author);
        console.log('The comment is %s', article.comment.text);
      });


    });

    ///////////////////////////////
    // gets an articles comments
    ///////////////////////////////
    app.get("/api/articles/:id/comments", function(req, res) {

      var id = (req.params.id) ? req.params.id : req.body.id;

      db.Article.
        findOne({ _id: id }).
        populate({
          path: 'comments',
        });
    
    });

};

//////////////

  // /////////////////////////////////////////////
  // // PUT route for updating
  // /////////////////////////////////////////////
  // app.put("/api/articles/:id", function(req, res) {

  //    var saved = req.query.saved ? true : false;

  //   console.log("route: update article");
  //   console.log(JSON.stringify(req.body));
  //   console.log("request query: " + req.query.articles_id);
  //   console.log("request params: " + req.params.id);

  //   var id = (req.params.id) ? req.params.id : req.body.id;

  //   db.Articles.update(
  //     req.body,
  //     {
  //       where: {
  //         article_id: id
  //       }
  //     }).then(function(dbResult) {
  //       res.json(dbResult);
  //   });
  // });

  // Story.
  // findOne({ title: /casino royale/i }).
  // populate('author', 'name'). // only return the Persons name
  // exec(function (err, story) {
  //   if (err) return handleError(err);

  //   console.log('The author is %s', story.author.name);
  //   // prints "The author is Ian Fleming"

  //   console.log('The authors age is %s', story.author.age);
  //   // prints "The authors age is null'
  // });