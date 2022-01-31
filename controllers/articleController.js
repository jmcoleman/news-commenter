const Article = require('../models/Article')
const ArticleComment = require('../models/ArticleComment')
const getScrapedContent = require('../utils/webscrape')

// clear the articles from the store
const clearArticles = async (req, res) => {
	try {
		// clear all data
		await ArticleComment.deleteMany({})
		await Article.deleteMany({})

		const hbsObject = {
			alertState: 'success',
			alertMsg: 'All of the articles have been cleared.',
			articles: null,
			isScraping: false,
			isClearing: true,
		}
		return res.render('home', hbsObject)
	} catch (error) {
		console.error(error.message)
		return res.status(500).json({
			alertState: 'danger',
			alertMsg: 'Error found when clearing the data store.',
			error: error,
		})
	}
}

// save the scraped data to the store
const scrapeArticles = async (req, res, next) => {
	try {
		// scrapes and returns articles
		const articleList = await getScrapedContent()
		let newArticleList = []

		newArticleList = await articleList.reduce(
			async (accumulator, currentValue, currentIndex) => {
				try {
					// if found article it is not a new article
					const dbResult = await Article.find({
						headline: currentValue.headline.trim(),
					}).lean()

					let articleFound = dbResult.length > 0 ? true : false

					// if article found, it is not a new article that needs to be saved
					if (articleFound) return accumulator

					// create new article in Mongo
					const objArticle = new Article({
						headline: currentValue.headline,
						summary: currentValue.summary.trim(),
						urlLink: currentValue.urlLink, // website url has already been appended at this point
						author: currentValue.author,
						articleDate: currentValue.articleDate,
						imgSrc: currentValue.imgSrc,
						imgAlt: currentValue.imgAlt,
					})
					const savedArticle = await objArticle.save()

					return (await accumulator).concat({
						...currentValue,
						_id: savedArticle._id,
						createdAt: savedArticle.createdAt,
					})
				} catch (error) {
					console.error(error.message)
					next(error)
					// return res.status(500).json(error)
				}
			},
			[]
		)

		let msg =
			newArticleList.length > 0
				? `A total of ${newArticleList.length} article(s) are added to the stored collection.`
				: 'No new articles are added.'

		// send the new article list to handlebars
		const hbsObject = {
			alertState: 'success',
			alertMsg: msg,
			articles: newArticleList,
			isScraping: true,
			isClearing: false,
		}
		return res.render('home', hbsObject)
	} catch (error) {
		console.error(error.message)
		// next(error)
		return res.status(500).json({
			alertState: 'danger',
			alertMsg: 'Error encountered while scraping the Smashing magazine site.',
			error: error,
		})
	}
}

// get all articles (comments as objects)
const getArticles = async (req, res) => {
	try {
		Article.find({})
			.sort({ createdAt: -1 })
			.lean()
			.populate('comments')
			.exec(function (error, dbResult) {
				if (error) {
					console.error(error.message)
					return res.json(error)
				}

				let alert = dbResult.length > 0 ? 'info' : 'success'
				let msg =
					dbResult.length > 0
						? `${dbResult.length} articles are in the collection.`
						: 'No articles are stored in the collection.'

				// send to handlebars
				const hbsObject = {
					alertState: alert,
					alertMsg: msg,
					articles: dbResult,
				}
				return res.render('home', hbsObject)
			})
	} catch (error) {
		console.error(error.message)
		return res.status(500).json({
			alertState: 'danger',
			alertMsg: 'Error encountered while retrieving the stored articles.',
			error: error,
		})
	}
}

// retrieve 1 article (comments as array of objects)
const getArticle = async (req, res) => {
	try {
		let articleid = req.params.articleid

		// get article and associated comments
		const article = Article.find({ _id: articleid })
			.sort({ createdAt: -1 })
			.lean()
			.populate('comments')
			.exec(function (error, dbResult) {
				if (error) {
					console.error(error.message)
					return res.json(error)
				}

				let state = dbResult.length > 0 ? 'success' : 'warning'
				let msg =
					dbResult.length > 0
						? 'Article retrieved.'
						: 'Unable to retrieve article.'

				// send to handlebars
				const hbsObject = {
					alertState: state,
					alertMsg: msg,
					articles: dbResult,
				}
				return res.render('home', hbsObject)
			})
	} catch (error) {
		console.error(error.message)
		return res.status(500).json({
			alertState: 'danger',
			alertMsg: 'Error encountered while getting an article from the store.',
			error: error,
		})
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
			articleDate: req.body.date,
		})

		const hbsObject = {
			alertState: 'success',
			alertMsg: 'Article created.',
			articles: newArticle,
		}

		return res.render('home', hbsObject)
	} catch (error) {
		console.error(error.message)
		return res.status(500).json({
			alertState: 'danger',
			alertMsg: 'Error encountered while creating an article.',
			error: error,
		})
	}
}

// delete an article
const deleteArticle = async (req, res) => {
	try {
		let articleid = req.params.articleid

		// remove the article
		const articleRemoved = await Article.findByIdAndRemove({
			_id: articleid,
		}).lean()

		ArticleComment.deleteMany(
			{ _id: { $in: articleRemoved.comments } },
			function (error) {
				if (error) {
					return res.status(500).send(JSON.stringify(error))
				}
			}
		)

		// create object to send back a message and the id of the document that was removed
		const response = {
			alertState: 'success',
			alertMsg: 'Article successfully deleted.',
			id: articleRemoved._id,
			headline: articleRemoved.headline,
			comments: articleRemoved.comments,
		}

		return res.status(200).send(response)
	} catch (error) {
		console.error(error.message)
		return res.status(500).json({
			alertState: 'danger',
			alertMsg: 'Error encountered while deleting an article.',
			error: error,
		})
	}
}

module.exports = {
	getArticles,
	getArticle,
	createArticle,
	deleteArticle,
	scrapeArticles,
	clearArticles,
}
