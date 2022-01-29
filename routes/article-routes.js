const express = require('express')
const router = express.Router()

const {
	scrapeArticles,
	clearArticles,
	getArticles,
	// getArticle,
	// createArticle,
	deleteArticle,
} = require('../controllers/articleController')

// @desc    Scrape data from the Smashing Magazine site to retrieve articles
// @route   GET /api/articles/scrape
router.get('/scrape', (req, res) => scrapeArticles(req, res))

// @desc    Clear all the articles and their comments from the store
// @route   GET /api/articles/clear
router.get('/clear', (req, res) => clearArticles(req, res))

// @desc    Gets An Article and associated comments (comments as array of objects)
// @route   GET /api/articles/:id
// router.get('/:id', (req, res) => getArticle(req, res, req.params.id))

// @desc    Gets all Articles and associated comments (comments as array of objects)
// @route   GET /api/articles
router.get('/', (req, res) => getArticles(req, res))

// @desc    Saves a new article (used when not done in scrape)
// @route   POST /api/articles
// router.post('/', (req, res) => createArticle(req, res))

// @desc    Deletes an article and it's associated comments
// @route   DELETE /api/articles/:id
router.delete('/:id', (req, res) => deleteArticle(req, res, req.params.id))

module.exports = router
