const express = require('express')
const router = express.Router()
const util = require('../utils/miscUtilities')
const chalk = require('chalk')

const {
	getArticles,
	getArticle,
	createArticle,
	deleteArticle,
} = require('../controllers/articleController')

// router.param -- called only ONCE
router.param('articleid', function (req, res, next, id) {
	if (!util.checkIfValidMongoObjectID(id)) {
		console.log(chalk.red.bold('Article ID is not a valid MongoDB ObjectID.'))
		return next(new Error('InvalidObjIDArticleID'))
	}
	console.log(chalk.dim.italic('Article ID parameter accepted.'))
	return next()
})

// **route middleware -- this works too**
// check for valid MongoDB ObjectID
// const validArticleObjId = function (req, res, next) {
// 	if (!util.checkIfValidMongoObjectID(req.params.articleid)) {
// 		console.log(chalk.red.bold('Article ID is not a valid MongoDB ObjectID.'))
// 		return next(new Error('InvalidObjIDArticleID'))
// 	}
// 	console.log(chalk.dim.italic('Article ID parameter accepted.'))
// 	return next()
// }

router.route('/').get(getArticles).post(createArticle)
router
	.route('/:articleid')
	// .all(validArticleObjId)
	.get(getArticle)
	// .post(function (req, res, next) {
	// 	next(new Error('not implemented'))
	// })
	// .put(function (req, res, next) {
	// 	next(new Error('not implemented'))
	// })
	.delete(deleteArticle)

const articleCommentRouter = require('./article-comment-router.js')
router.use('/:articleid/comments', articleCommentRouter)

module.exports = router
