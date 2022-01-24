const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArticleCommentSchema = new Schema({
	articleId: {
		type: Schema.Types.ObjectId,
		ref: 'Article',
	},
	userName: {
		type: String,
		trim: true,
		required: true,
	},
	comment: {
		type: String,
		trim: true,
		required: true,
	},
})

ArticleCommentSchema.set('timestamps', true)

const ArticleComment = mongoose.model('ArticleComment', ArticleCommentSchema)

module.exports = ArticleComment
