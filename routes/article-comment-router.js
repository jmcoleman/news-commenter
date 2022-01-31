const express = require('express')
const router = express.Router()
const util = require('../utils/miscUtilities')
const chalk = require('chalk')

const {
	createComment,
	deleteComment,
} = require('../controllers/articleCommentController')

// router.param -- called only ONCE
router.param('commentid', function (req, res, next, id) {
	if (!util.checkIfValidMongoObjectID(id)) {
		console.log(chalk.red.bold('Comment ID is not a valid MongoDB ObjectID.'))
		return next(new Error('InvalidObjIDCommentID'))
	}
	console.log(chalk.dim.italic('Comment ID parameter accepted.'))
	return next()
})

// **route middleware -- this works too**
// const validCommentObjId = function (req, res, next) {
// 	if (!util.checkIfValidMongoObjectID(req.params.commentid)) {
// 		console.log(chalk.red.bold('Comment ID is not a valid MongoDB ObjectID.'))
// 		return next(new Error('InvalidObjIDCommentID'))
// 	}
// 	console.log(chalk.dim.italic('Comment ID parameter accepted.'))
// 	return next()
// }

router
	.route('/')
	// .get(function (req, res, next) {
	// 	next(new Error('not implemented'))
	// })
	.post(createComment)
router
	.route('/:commentid')
	// .all(validCommentObjId)
	// .get(function (req, res, next) {
	// 	next(new Error('not implemented'))
	// })
	// .post(function (req, res, next) {
	// 	next(new Error('not implemented'))
	// })
	// .put(function (req, res, next) {
	// 	next(new Error('not implemented'))
	// })
	.delete(deleteComment)

module.exports = router
