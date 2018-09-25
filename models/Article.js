var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Requiring our models
var db = require("./../models");

// Using the Schema constructor, create a new ArticleSchema object
var ArticleSchema = new Schema({
  headline: {
    type: String,
    trim: true,
    unique: true,
    required: "Article name is required"
  },
  summary: {
    type: String,
    trim: true,
    required: "Summary is required"
  },
  urlLink: {
    type: String,
    trim: true
  },
  author: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'ArticleComment'
    }]
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the User model
module.exports = Article;