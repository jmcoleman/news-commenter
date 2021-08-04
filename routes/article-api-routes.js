// Requiring our models
const db = require('../models')

const {
	getArticles,
	getArticle,
	createArticle,
	deleteArticle,
	getArticlesX,
	getArticleX,
} = require('../controllers/articleController')

/////////////////
// Routes
/////////////////
module.exports = function (router) {
	// @desc    Gets All Articles and associated comments (comments as array of ids)
	// @route   GET /api/articlesX
	router.get('/api/articlesX', (req, res) => getArticlesX(req, res))

	// @desc    Gets An Article and associated comments (comments as array of ids)
	// @route   GET /api/articlesX/:id
	router.get('/api/articlesX/:id', (req, res) =>
		getArticleX(req, res, req.params.id)
	)

	// @desc    Gets All Articles and associated comments (comments as array of objects)
	// @route   GET /api/articles
	router.get('/api/articles', (req, res) => getArticles(req, res))

	// @desc    Gets An Article and associated comments (comments as array of objects)
	// @route   GET /api/articles/:id
	router.get('/api/articles/:id', (req, res) =>
		getArticle(req, res, req.params.id)
	)

	// @desc    Saves a new article (used when not done in scrape)
	// @route   POST /api/articles
	router.post('/api/articles', (req, res) => createArticle(req, res))

	// @desc    Deletes an article and it's associated comments
	// @route   DELETE /api/articles/:id
	router.delete('/api/articles/:id', (req, res) =>
		deleteArticle(req, res, req.params.id)
	)
}
