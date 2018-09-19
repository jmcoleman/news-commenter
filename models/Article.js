var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new ArticleSchema object
var ArticleSchema = new Schema({
  headline: {
    type: String,
    trim: true,
    unique: true,
    required: "Article name is Required"
  },
  summary: {
    type: String,
    trim: true,
    required: "Summary is Required"
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
  comment: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
    }]

});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the User model
module.exports = Article;