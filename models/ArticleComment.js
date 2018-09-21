var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleCommentSchema = new Schema({
    author: {
        type: String,
        trim: true,
        required: "Author is required."
    },
    text: {
        type: String,
        trim: true,
        required: "Comment text is required."
    }
});

var ArticleComment = mongoose.model('ArticleComment', ArticleCommentSchema);

module.exports = ArticleComment;