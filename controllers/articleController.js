const Article = require('../models/Article')
const ArticleComment = require('../models/ArticleComment')
const axios = require('axios')
const cheerio = require('cheerio')
const SMASHING_MAGAZINE_URL = 'https://www.smashingmagazine.com'

// get data from Smashing Magazines articles and return the data
const getScrapedContent = async () => {
	try {
		// An empty array to save the data that we'll scrape
		let results = []

		// Make a request for articles from Smashing Magazines web site.
		const axiosConfig = {
			responseType: 'text',
		}
		const axiosResponse = await axios(
			`${SMASHING_MAGAZINE_URL}/articles`,
			axiosConfig
		)

		// Load the html data into cheerio and save it to a variable
		// '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
		const $ = cheerio.load(axiosResponse.data, { ignoreWhitespace: true })

		////////////////////////////////////////////////////////////////////////////////////////
		// for each article
		//   * Headline - the title of the article
		//   * Summary - a short summary of the article
		//   * Author - the author of the article
		//   * URL - the link with the url to the original article
		//   * Date - the date of the article
		//   * Feel free to add more content to your database (photos, bylines, and so on).
		////////////////////////////////////////////////////////////////////////////////////////

		// With cheerio, find each "article--post" class
		// (i: iterator. element: the current element)
		$('.article--post').each(function (i, element) {
			// Save the text of the "article--post__title" class element in a "headline" variable
			let headline = $(element).find('.article--post__title').text()

			// In the currently selected element, look at its child elements (i.e., its p-tags with a class "article--post__teaser"),
			// then filter for any text elements that are contents and save it to the "summary" variable
			let summary = $(element)
				.find('p.article--post__teaser')
				.first()
				.contents()
				.filter(function () {
					return this.type === 'text'
				})
				.text()

			// use cheerio to scrape the html and get the author, url and date of the article
			let author = $(element).find('img.bio-image-image').attr('alt')
			let urlLink = $(element)
				.find('.article--post__title')
				.children()
				.attr('href')
			let date = $(element).find('.article--post__teaser time').attr('datetime')

			// If this found element had both a headline and a link
			if (headline && urlLink) {
				// save the results in an object that we'll push into the results array that we defined earlier
				results.push({
					headline: headline,
					summary: summary.trim(),
					urlLink: SMASHING_MAGAZINE_URL + urlLink,
					author: author,
					date: date,
				})
			}
		})

		// return the result data returned from the scrape
		return results
	} catch (error) {
		console.error('scrape from site failed: ', error.message)
		return error
	}
}

// get all articles (comments as objects)
const getArticles = async (req, res) => {
	try {
		const articles = await Article.find({})
			.lean()
			.populate('comments')
			.exec(function (error, dbResult) {
				if (error) {
					console.error(error.message)
					return res.json(error)
				}
				// send to handlebars
				const hbsObject = {
					articles: dbResult,
				}
				return res.render('index', hbsObject)
			})
	} catch (error) {
		console.error(error.message)
		return res.json(error)
	}
}

// retrieve 1 article (comments as array of objects)
const getArticle = async (req, res, id) => {
	try {
		// get article and associated comments
		const article = await Article.find({ _id: id })
			.lean()
			.populate('comments')
			.exec(function (error, dbResult) {
				if (error) {
					console.error(error.message)
					return res.json(error)
				}

				// send to handlebars
				const hbsObject = {
					articles: dbResult,
				}
				return res.render('index', hbsObject)
			})
	} catch (error) {
		console.error(error.message)
		return res.json(error)
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

		const hbsObject = {
			articles: newArticle,
		}

		return res.render('index', hbsObject)
	} catch (error) {
		console.error(error.message)
		return res.json(error)
	}
}

// delete an article
const deleteArticle = async (req, res, id) => {
	try {
		// remove the article
		const articleRemoved = await Article.findByIdAndRemove({ _id: id }).lean()

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
			message: 'Article successfully deleted',
			id: articleRemoved._id,
			headline: articleRemoved.headline,
			comments: articleRemoved.comments,
		}

		return res.status(200).send(response)
	} catch (error) {
		console.error(error.message)
		return res.json(error)
	}
}

// get all articles (comments as array of ids)
const getArticlesX = async (req, res) => {
	try {
		//find all articles
		const dbResult = await Article.find({}).lean()
		// send to handlebars
		const hbsObject = {
			articles: dbResult,
		}
		res.render('index', hbsObject)
	} catch (error) {
		console.error(error.message)
		return res.json(error)
	}
}

// retrieve 1 article (comments as array of ids)
const getArticleX = async (req, res, id) => {
	try {
		const dbResult = await Article.findById(id).lean()
		// send to handlebars
		var hbsArticle = {
			articles: dbResult,
		}
		res.render('index', hbsArticle)
	} catch (error) {
		console.error(error.message)
		return res.json(error)
	}
}

// clear the articles from the store
const clearArticles = async (req, res) => {
	try {
		// clear all data
		await ArticleComment.deleteMany({})
		await Article.deleteMany({})

		const hbsObject = {
			articles: null,
			isScraping: false,
			isClearing: true,
		}
		return res.render('index', hbsObject)
	} catch (error) {
		console.error(error.message)
		return res.json(error)
	}
}

// save the scraped data to the store
const scrapeArticles = async (req, res) => {
	try {
		// scrapes and returns articles
		const articleList = await getScrapedContent()

		// for each article in the articleList, find it in Mongo and if it's not there, append it to a new array
		// save the new ones to mongo
		let newArticleList = []

		articleList.forEach(async (item, index) => {
			const dbResult = await Article.find({
				headline: item.headline.trim(),
			}).lean()

			// looking in store to see if article exists and saving it if it doesn't; uses headline to find
			if (dbResult.length === 0) {
				// create new article in Mongo
				const objArticle = new Article({
					headline: item.headline,
					summary: item.summary.trim(),
					urlLink: item.urlLink, // website url has already been appended at this point
					author: item.author,
					date: item.date,
				})
				// await objArticle.save(function () {
				// 	newArticleList.push({ ...item, _id: objArticle._id })
				// })

				const savedArticle = await objArticle.save()
				newArticleList.push({ ...item, _id: savedArticle._id })
			}
		})

		// send the new article list to handlebars
		const hbsObject = {
			articles: newArticleList,
			isScraping: true,
			isClearing: false,
		}
		return res.render('index', hbsObject)
	} catch (error) {
		console.error(error.message)
		return res.json(error)
	}
	// END SCRAPESITE
}

module.exports = {
	getArticles,
	getArticle,
	createArticle,
	deleteArticle,
	getArticlesX,
	getArticleX,
	scrapeArticles,
	clearArticles,
}
