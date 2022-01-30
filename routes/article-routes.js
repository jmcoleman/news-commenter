const express = require('express')
const router = express.Router()

const {
	scrapeArticles,
	clearArticles,
	getArticles,
	getArticle,
	createArticle,
	deleteArticle,
} = require('../controllers/articleController')

router.route('/').get(getArticles).post(createArticle)
router.route('/scrape').get(scrapeArticles)
router.route('/clear').get(clearArticles)
router.route('/:id').get(getArticle).delete(deleteArticle)

module.exports = router
