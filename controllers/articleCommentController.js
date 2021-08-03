const ArticleComment = require('../models/ArticleComment')

// save a new comment on an article
const createComment = async (req, res, id) => {
	const article_id = id

	try {
		// Create a new comment in the db
		const newComment = await ArticleComment.create(req.body)

		// if a ArticleComment was created successfully, find the Article and push the new ArticleComment _id to the Articles `comments` array
		// { new: true } tells the query that we want it to return the updated Article -- it returns the original by default
		// since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query

		if (newComment) {
			const updatedArticle = await Article.findOneAndUpdate(
				{ _id: article_id },
				{ $push: { comments: newComment._id } },
				{ new: true }
			)
			// send the updated article back to the client
			return res.json(updatedArticle)
		}
	} catch (error) {
		return res.json(error)
		// return handleError(error)
	}
}

// delete a comment on an article
const deleteComment = async (req, res, id) => {
	try {
		// remove the article comment
		const commentRemoved = await ArticleComment.findByIdAndRemove({
			_id: id,
		}).lean()

		// create object to send back a message and the id of the document that was removed
		const response = {
			message: 'Comment successfully deleted',
			id: id,
			userName: commentRemoved.userName,
			comment: commentRemoved.comment,
		}

		return res.status(200).send(JSON.stringify(response))
	} catch (error) {
		console.log(error.message)
		return res.status(500).send(JSON.stringify(error))
		// return handleError(error)
	}
}

module.exports = {
	createComment,
	deleteComment,
}
