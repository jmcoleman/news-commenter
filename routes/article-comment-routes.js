const {
	createComment,
	deleteComment,
} = require('../controllers/articleCommentController')

// Routes
module.exports = function (router) {
	// @desc    Saves a new comment on an article
	// @route   POST /comments/:id
	router.post('/comments/:id', (req, res) => {
		console.log('ID IS:', req.params.id)
		const newComment = createComment(
			req,
			res,
			req.params.id ? req.params.id : req.body.id
		)

		console.log('what is in the db:')
		console.log(JSON.stringify(newComment))
	})

	// @desc    Deletes a comment on an article
	// @route   DELETE /comments/:id
	router.delete('/comments/:id', (req, res) =>
		deleteComment(req, res, req.params.id)
	)
}
