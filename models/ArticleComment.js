var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleCommentSchema = new Schema({
    userName: {
        type: String,
        trim: true,
        required: "User is required."
    },
    comment: {
        type: String,
        trim: true,
        required: "Comment text is required."
    }
});

var ArticleComment = mongoose.model('ArticleComment', ArticleCommentSchema);

module.exports = ArticleComment;