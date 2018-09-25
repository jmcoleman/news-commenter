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

  ///////////////////////////////////////////////////////////////////////////
  // GET route for getting all of the articles (comments as array of ids)
  ///////////////////////////////////////////////////////////////////////////
  app.get("/api/articlesX", function(req, res) {

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

  ///////////////////////////////////////////////////////////////////////////
  // new GET route for getting all of the articles (comments as objects)
  ///////////////////////////////////////////////////////////////////////////
  app.get("/api/articles", function(req, res) {

    console.log("route: all articles");
    // console.log(JSON.stringify(req.body));

    // get all articles and associated comments
    db.Article.
      find({}).
      populate('comments'). 
      exec(function (err, dbResult) {
        if (err) return handleError(err);
        console.log(dbResult);
        // console.log('The author is %s', dbResults[0].comments.userName);
        // console.log('The comment is %s', dbResults[0].comments.comment);
        // send to handlebars
        var hbsObject = {
          articles: dbResult
        };
        res.render("index", hbsObject);       
      });


    //find all articles
    // db.Article.find({})
    //   .then(function(dbResult) {
    //     // res.send(dbResult);

    //     // send to handlebars
    //     var hbsObject = {
    //       articles: dbResult
    //     };
    //     res.render("index", hbsObject);       
    //   })
    //   .catch(function(err) {
    //     // If an error occurs, log the error message
    //     console.log(err.message);
    //   });
   
  });

  /////////////////////////////////////////////////////////////////////////////
  // GET route for retrieving a single article (comments as array of ids)
  /////////////////////////////////////////////////////////////////////////////
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

  ///////////////////////////////////////////////////////////////////////////
  // POST route for saving new article (when not saved as part of scrape)
  ///////////////////////////////////////////////////////////////////////////
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


  ///////////////////////////////////////////////////////////////////
  // DELETE route for deleting a article (not currently accessed)
  ///////////////////////////////////////////////////////////////////
  app.delete("/api/articles/:id", function(req, res) {

    console.log("route: delete a article");
    console.log(JSON.stringify(req.body));

    db.Article.findByIdAndRemove(req.params.id)
      .then(function(dbResult) {
        console.log("after the deletion of article: " + req.params.id);
        res.json(dbResult);
      });
  });

  ////////////////////////////////////////////////////////
  // ** save a new comment and associate it to an article
  ////////////////////////////////////////////////////////
  // Route for saving a new comment to the db and associating it with a article
  app.post("/comments/:id", function(req, res) {

    var article_id = (req.params.id) ? req.params.id : req.body.id;

    // Create a new comment in the db
    db.ArticleComment.create(req.body)
      .then(function(dbComment) {
        // If a ArticleComment was created successfully, find the Article and push the new ArticleComment _id to the Articles `comments` array
        // { new: true } tells the query that we want it to return the updated Article -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({_id: article_id}, { $push: { comments: dbComment._id } }, { new: true });
      })
      .then(function(dbArticle) {
        // If the User was updated successfully, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });

//////////////////////////

  //////////////////////////////////////////////////
  // PUT route for updating (not used or tested)
  //////////////////////////////////////////////////
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
      populate('comments'). 
      exec(function (err, article) {
        if (err) return handleError(err);

        console.log('The author is %s', article.comments.userName);
        console.log('The comment is %s', article.comments.comment);
      });


    });

    // ///////////////////////////////
    // // gets an articles comments
    // ///////////////////////////////
    // app.get("/api/articles/:id/comments", function(req, res) {

    //   var id = (req.params.id) ? req.params.id : req.body.id;

    //   db.Article.
    //     findOne({ _id: id }).
    //     populate({
    //       path: 'comments',
    //     });
    
    // });
};

