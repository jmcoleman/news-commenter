const cheerio = require('cheerio')
const axios = require('axios')

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

			let imgSrc = $(element).find('.bio-image-image').attr('src')
			let imgAlt = $(element).find('.bio-image-image').attr('alt')

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
					articleDate: date,
					imgSrc: imgSrc,
					imgAlt: imgAlt,
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

module.exports = getScrapedContent
