const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Using the Schema constructor, create a new ArticleSchema object
const ArticleSchema = new Schema({
	headline: {
		type: String,
		trim: true,
		unique: true,
		required: true,
	},
	summary: {
		type: String,
		trim: true,
		required: true,
	},
	urlLink: {
		type: String,
		trim: true,
	},
	author: {
		type: String,
	},
	articleDate: {
		type: String,
	},
	imgSrc: {
		type: String,
	},
	imgAlt: {
		type: String,
	},
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: 'ArticleComment',
		},
	],
})

ArticleSchema.set('timestamps', true)

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model('Article', ArticleSchema)

// Export the User model
module.exports = Article
