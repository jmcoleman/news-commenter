///////////////////////////////////////////////////////////////////////////////////////////////////
// File Name: html-routes.js 
//
// Description: This file offers a set of routes for sending users to the various html pages
///////////////////////////////////////////////////////////////////////////////////////////////////

// dependencies
var path = require("path");
var db = require("./../../../models");

// Routes
module.exports = function(app) {

  // Each of the below routes just handles the HTML page that the user gets sent to.
  app.get("/", function(req, res) {
    res.render("index", {
      title: "Mongo Web Scraper"
    });
  });

};
