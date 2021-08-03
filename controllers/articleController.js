const Article = require('../models/Article')

// get all articles (comments as objects)
const getArticles = async (req, res) => {
	try {
		const articles = await Article.find({})
			.lean()
			.populate('comments')
			.exec(function (err, dbResult) {
				if (err) return handleError(err)

				// send to handlebars
				let hbsObject = {
					articles: dbResult,
				}
				return res.render('index', hbsObject)
			})
	} catch (error) {
		console.log(error)
		return handleError(error)
	}
}

// retrieve 1 article (comments as array of objects)
const getArticle = async (req, res, id) => {
	try {
		// get article and associated comments
		const article = await Article.find({ _id: id })
			.lean()
			.populate('comments')
			.exec(function (err, dbResult) {
				if (err) return handleError(err)

				// send to handlebars
				var hbsObject = {
					articles: dbResult,
				}
				return res.render('index', hbsObject)
			})
	} catch (error) {
		console.log(error)
		return handleError(error)
	}
}

// save new article (used when not done in scrape)
const createArticle = async (req, res) => {
	try {
		// Save a new article using the data object
		const newArticle = await Article.create({
			headline: req.body.headline,
			summary: req.body.summary.trim(),
			urlLink: req.body.urlLink,
			author: req.body.author,
			date: req.body.date,
		})

		var hbsObject = {
			articles: newArticle,
		}

		return res.render('index', hbsObject)
	} catch (error) {
		console.log(error.message)
		return handleError(error)
	}
}

// delete an article
const deleteArticle = async (req, res, id) => {
	try {
		// remove the article
		const articleRemoved = await Article.findByIdAndRemove({ _id: id }).lean()

		ArticleComment.deleteMany(
			{ _id: { $in: articleRemoved.comments } },
			function (err) {
				if (err) {
					return res.status(500).send(JSON.stringify(err))
				}
			}
		)

		// create object to send back a message and the id of the document that was removed
		const response = {
			message: 'Article successfully deleted',
			id: articleRemoved._id,
			headline: articleRemoved.headline,
			comments: articleRemoved.comments,
		}

		return res.status(200).send(response)
	} catch (error) {
		console.log(error.message)
		return handleError(error)
	}
}

module.exports = {
	getArticles,
	getArticle,
	createArticle,
	deleteArticle,
}
