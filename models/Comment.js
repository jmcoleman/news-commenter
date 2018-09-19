var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    author: String,
    text: String
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;