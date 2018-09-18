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
};