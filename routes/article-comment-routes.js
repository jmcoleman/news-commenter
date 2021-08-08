const express = require('express')
const router = express.Router()

const {
	createComment,
	deleteComment,
} = require('../controllers/articleCommentController')

// @desc    Saves a new comment on an article
// @route   POST /comments/:id
router.post('/:id', (req, res) => {
	// console.log('ID IS:', req.params.id)
	const newComment = createComment(
		req,
		res,
		req.params.id ? req.params.id : req.body.id
	)
})

// @desc    Deletes a comment on an article
// @route   DELETE /comments/:id
router.delete('/:articleId/:id', (req, res) =>
	deleteComment(req, res, req.params.articleId, req.params.id)
)

module.exports = router
