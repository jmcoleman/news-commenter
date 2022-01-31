const express = require('express')
const api = express.Router()

const {
	scrapeArticles,
	clearArticles,
} = require('../controllers/articleController')

api.route('/scrape').get(scrapeArticles)
api.route('/clear').get(clearArticles)

module.exports = api
