const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArticleCommentSchema = new Schema({
	userName: {
		type: String,
		trim: true,
		required: 'User is required.',
	},
	comment: {
		type: String,
		trim: true,
		required: 'Comment text is required.',
	},
})

const ArticleComment = mongoose.model('ArticleComment', ArticleCommentSchema)

module.exports = ArticleComment
