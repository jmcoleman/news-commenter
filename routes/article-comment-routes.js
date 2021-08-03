const {
	createComment,
	deleteComment,
} = require('../controllers/articleCommentController')

// Routes
module.exports = function (router) {
	// @desc    Saves a new comment on an article
	// @route   POST /comments/:id
	router.post('/comments/:id', (req, res) =>
		createComment(req, res, req.params.id ? req.params.id : req.body.id)
	)

	// @desc    Deletes a comment on an article
	// @route   DELETE /comments/:id
	router.delete('/comments/:id', (req, res) =>
		deleteComment(req, res, req.params.id)
	)
}
