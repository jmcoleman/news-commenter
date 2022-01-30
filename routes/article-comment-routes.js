const express = require('express')
const router = express.Router()

const {
	createComment,
	deleteComment,
} = require('../controllers/articleCommentController')

router.route('/:id').post(createComment)
router.route('/:articleId/:id').delete(deleteComment)

module.exports = router
