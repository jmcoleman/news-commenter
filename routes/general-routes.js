///////////////////////////////////////////////////////////////////////////////////////////////////
// File Name: html-routes.js
//
// Description: This file offers a set of routes for sending users to the various html pages
///////////////////////////////////////////////////////////////////////////////////////////////////

const axios = require('axios')
const cheerio = require('cheerio')
const db = require('../models')
const LOAD_FROM_SCRAPE = false
const SMASHING_MAGAZINE_URL = 'https://www.smashingmagazine.com'

module.exports = function (router) {
	// functions
	async function getWebsiteContent() {
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
				let date = $(element)
					.find('.article--post__teaser time')
					.attr('datetime')

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
			console.error('scape from site failed: ', error)
			return error
		}
	}

	//////////////////////
	// Routes
	//////////////////////

	// GET root route
	router.get('/', function (req, res) {
		// show all of the existing content along with the comments
		res.redirect('/api/articles')
	})

	// GET scrape route to retrieve articles
	router.get('/scrape', async function (req, res) {
		console.log('route: in scrape articles')

		try {
			// scrapes and returns articles
			const articleList = await getWebsiteContent()

			// console.log('getWebsiteContent returned')
			// console.log(JSON.stringify(articleList))

			// for each article in the articleList, find it in Mongo and if it's not there, append it to a new array
			// save the new ones to mongo
			let newArticleList = []

			articleList.forEach(async (item, index) => {
				// console.log('Looking in Mongo for: ' + item.headline)

				const dbResult = await db.Article.find({
					headline: item.headline.trim(),
				}).lean()

				if (dbResult.length === 0) {
					// if don't find it, we'll need to add it
					// console.log('did not find so add: ', item.headline)

					////////////////////////
					// push to Mongo DB
					////////////////////////
					// console.log('scrape is creating NEW article')

					const objArticle = new db.Article({
						headline: item.headline,
						summary: item.summary.trim(),
						urlLink: item.urlLink, // website url has already been appended at this point
						author: item.author,
						date: item.date,
					})
					await objArticle.save()

					// Save a new Example using the data object
					// const savedData = await db.Article.create({
					// 	headline: item.headline,
					// 	summary: item.summary.trim(),
					// 	urlLink: item.urlLink, // website url has already been appended at this point
					// 	author: item.author,
					// 	date: item.date,
					// })

					// console.log('AFTER SAVE A ARTICLE')
					// console.log(objArticle)
					// console.log(objArticle._id)

					// newArticleList.push(savedData)
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
			console.log(error)
			return res.json(error)
		}
		// END SCRAPESITE
	})

	// GET clear all articles (and their associated comments) route
	router.get('/clear', function (req, res) {
		console.log('route: in clear all articles')

		// clear all data
		db.ArticleComment.deleteMany({}, function (err) {})
		db.Article.deleteMany({}, function (err) {})

		res.redirect('/api/articles')
	})
}
