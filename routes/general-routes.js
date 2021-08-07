const express = require('express')
const router = express.Router()

const axios = require('axios')
const cheerio = require('cheerio')
const db = require('../models')
const SMASHING_MAGAZINE_URL = 'https://www.smashingmagazine.com'

// get data from Smashing Magazines articles and return the data
const getScrapedContent = async () => {
	console.log('in getScrapedContent')

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
		console.error('scape from site failed: ', error.message)
		return error
	}
}

// clear the articles from the store
const clearArticles = async (req, res) => {
	console.log('in clear all articles')

	try {
		// clear all data
		await db.ArticleComment.deleteMany({}, function (err) {})
		await db.Article.deleteMany({}, function (err) {})

		return res.redirect('/api/articles')
	} catch (error) {
		console.error(error.message)
		return res.json(error)
	}
}

// save the scraped data to the store
const scrapeArticles = async (req, res) => {
	console.log('in save of scraped articles')

	try {
		// scrapes and returns articles
		const articleList = await getScrapedContent()

		// for each article in the articleList, find it in Mongo and if it's not there, append it to a new array
		// save the new ones to mongo
		let newArticleList = []

		articleList.forEach(async (item, index) => {
			const dbResult = await db.Article.find({
				headline: item.headline.trim(),
			}).lean()

			// looking in store to see if article exists and saving it if it doesn't; uses headline to find
			if (dbResult.length === 0) {
				// create new article in Mongo
				const objArticle = new db.Article({
					headline: item.headline,
					summary: item.summary.trim(),
					urlLink: item.urlLink, // website url has already been appended at this point
					author: item.author,
					date: item.date,
				})
				await objArticle.save()

				newArticleList.push({ ...item, _id: objArticle._id })
			}
		})

		// send the new article list to handlebars
		const hbsObject = {
			articles: newArticleList,
			isScraping: true,
		}
		return res.render('index', hbsObject)
	} catch (error) {
		console.error(error.message)
		return res.json(error)
	}
	// END SCRAPESITE
}

// load the home page with existing articles and comments
const loadHome = (req, res) => {
	res.redirect('/api/articles')
}

// @desc    Root route. Will redirect to gets all of the existing articles along with their comments
// @route   GET /
router.get('/', loadHome)

// @desc    Scrape data from the Smashing Magazine site to retrieve articles
// @route   GET /scrape
router.get('/scrape', scrapeArticles)

// @desc    Clear all the articles and their comments from the store
// @route   GET /clear
router.get('/clear', clearArticles)

module.exports = router
