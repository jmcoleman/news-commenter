var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new ArticleSchema object
var ArticleSchema = new Schema({
  articlename: {
    type: String,
    trim: true,
    required: "Article name is Required"
  },
  // `password` must be of type String
  // `password` will trim leading and trailing whitespace before it's saved
  // `password` is a required field and throws a custom error message if not supplied
  // `password` uses a custom validation function to only accept values 6 characters or more
//   password: {
//     type: String,
//     trim: true,
//     required: "Password is Required",
//     validate: [
//       function(input) {
//         return input.length >= 6;
//       },
//       "Password should be longer."
//     ]
//   },
  // `email` must be of type String
  // `email` must be unique
  // `email` must match the regex pattern below and throws a custom error message if it does not
  // You can read more about RegEx Patterns here https://www.regexbuddy.com/regex.html
//   email: {
//     type: String,
//     unique: true,
//     match: [/.+@.+\..+/, "Please enter a valid e-mail address"]
//   },
  // `date` must be of type Date. The default value is the current date
  articleCreated: {
    type: Date,
    default: Date.now
  }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the User model
module.exports = Article;