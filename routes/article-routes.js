const express = require('express')
const router = express.Router()

const {
	getArticles,
	getArticle,
	createArticle,
	deleteArticle,
	getArticlesX,
	getArticleX,
} = require('../controllers/articleController')

// @desc    Gets All Articles and associated comments (comments as array of objects)
// @route   GET /api/articles
router.get('/articles', (req, res) => getArticles(req, res))

// @desc    Saves a new article (used when not done in scrape)
// @route   POST /api/articles
router.post('/articles', (req, res) => createArticle(req, res))

// @desc    Gets An Article and associated comments (comments as array of objects)
// @route   GET /api/articles/:id
router.get('/articles/:id', (req, res) => getArticle(req, res, req.params.id))

// @desc    Deletes an article and it's associated comments
// @route   DELETE /api/articles/:id
router.delete('/articles/:id', (req, res) =>
	deleteArticle(req, res, req.params.id)
)

//////////////////////////
// BELOW AREN'T USED
//////////////////////////

// @desc    Gets All Articles and associated comments (comments as array of ids)
// @route   GET /api/articlesX
router.get('/articlesX', (req, res) => getArticlesX(req, res))

// @desc    Gets An Article and associated comments (comments as array of ids)
// @route   GET /api/articlesX/:id
router.get('/articlesX/:id', (req, res) => getArticleX(req, res, req.params.id))

module.exports = router
