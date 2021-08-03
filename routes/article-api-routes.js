// Requiring our models
const db = require('../models')

const {
	getArticles,
	getArticle,
	createArticle,
	deleteArticle,
} = require('../controllers/articleController')

/////////////////
// Routes
/////////////////
module.exports = function (router) {
	///////////////////////////////////////////////////////////////////////////
	// ARTICLE GET route - get all articles (comments as array of ids)
	///////////////////////////////////////////////////////////////////////////
	router.get('/api/articlesX', function (req, res) {
		console.log('route: all articlesX')
		// console.log(JSON.stringify(req.body));

		//find all articles
		db.Article.find({})
			.lean()
			.then(function (dbResult) {
				// res.send(JSON.stringify(dbResult));

				// send to handlebars
				var hbsObject = {
					articles: dbResult,
				}
				res.render('index', hbsObject)
			})
			.catch(function (err) {
				// If an error occurs, log the error message
				console.log(err.message)
			})
	})

	/////////////////////////////////////////////////////////////////////////////
	// ARTICLE GET route - retrieve 1 article (comments as array of ids)
	/////////////////////////////////////////////////////////////////////////////
	router.get('/api/articlesX/:id', function (req, res) {
		console.log('route: specific articleX')
		// console.log(JSON.stringify(req.body));

		db.Article.findById(req.params.id, function (err, article) {})
			.lean()
			.then(function (dbResult) {
				// res.send(JSON.stringify(dbResult));

				// send to handlebars
				var hbsArticle = {
					articles: dbResult,
				}
				// console.log(dbResult);
				res.render('index', hbsArticle)
			})
	})

	// @desc    Gets All Articles and associated comments (comments as array of objects)
	// @route   GET /api/articles
	router.get('/api/articles', (req, res) => getArticles(req, res))

	// @desc    Gets An Articles and associated comments (comments as array of objects)
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
