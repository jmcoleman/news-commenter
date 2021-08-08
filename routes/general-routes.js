const express = require('express')
const router = express.Router()

const {
	clearArticles,
	scrapeArticles,
} = require('../controllers/articleController')

// load the home page with existing articles and comments
const loadHome = (req, res) => {
	res.redirect('/api/articles')
}

// @desc    Root route. Will redirect to gets all of the existing articles along with their comments
// @route   GET /
router.get('/', loadHome)

// @desc    Scrape data from the Smashing Magazine site to retrieve articles
// @route   GET /scrape
router.get('/scrape', (req, res) => scrapeArticles(req, res))

// @desc    Clear all the articles and their comments from the store
// @route   GET /clear
router.get('/clear', (req, res) => clearArticles(req, res))

module.exports = router
