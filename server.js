//////////////////////////
// dependencies
//////////////////////////
const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorHandler')
const cliLogger = require('./middleware/logger')

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Environment Variables
//
// process.env.NODE_ENV is set by heroku with a default value of production
// use dotenv to read .env vars into Node but silence the Heroku log error for production as no .env will exist
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// load env variables
dotenv.config({ silent: process.env.NODE_ENV === 'production' })
// console.log('process env: ' + JSON.stringify(process.env, null, '\t'))

/////////////////////////
// connect to Mongo DB
/////////////////////////
// If deployed, use the deployed database. Otherwise use the local database

// connect to MongoDB on Heroku using MONGODB_URI environment variable
// let MONGODB_URI = process.env.MONGODB_URI
// or connect to the local mongo environment for dev
let MONGODB_URI = `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`
// or run Mongo Atlas in dev
// let MONGODB_URI = `mongodb+srv://${process.env.DB_USER_ATLAS}:${process.env.DB_PASSWORD_ATLAS}@${process.env.DB_CLUSTER_ATLAS}/${process.env.DB_NAME_ATLAS}?retryWrites=true&w=majority`

// Connect to the Mongo DB
connectDB(MONGODB_URI)

///////////////////////
// configure Express
///////////////////////
const app = express()

// sets the some express variables for info
app.set('port', process.env.PORT || 8080)
app.set('deployment', process.env.NODE_ENV || 'development') // will be set to production in Heroku

// body parsing middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// serve static folders
app.use(express.static(__dirname + '/public'))

// logger middleware when in dev
if (app.get('deployment') === 'development') app.use(cliLogger)

/////////////////
// handlebars
/////////////////
const exphbs = require('express-handlebars')

//pass helpers that can otherwise be defined in registerHelpers
//define stuff like `defaultLayout` and `partialsDir`
const hbs = exphbs.create({
	defaultLayout: 'main',
	path: path.join(__dirname, 'views'),
	layoutsDir: path.join(__dirname, 'views/layouts/'),
	partialsDir: path.join(__dirname, 'views/partials/'),
	helpers: {
		eq: function (a, b) {
			return a === b
		},
		gt: function (a, b) {
			return a > b
		},
		gte: function (a, b) {
			return a >= b
		},
		lt: function (a, b) {
			return a < b
		},
		lte: function (a, b) {
			return a <= b
		},
		ne: function (a, b) {
			return a !== b
		},
		// used with the article date
		appendTime: function (date) {
			return new Date(date + ' 00:00:00Z' + ' UTC').toLocaleDateString(
				{},
				{ timeZone: 'UTC' }
			)
		},
		// used with createdAt date
		readableDate: function (date) {
			return new Date(date + ' UTC').toLocaleString({}, { timeZone: 'UTC' })
		},
	},
})

// handlebar configuration
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

// more handlebars helpers
require('handlebars-helpers')(['comparison'])

////////////////////////////////////////////////////////
// Import routes and give the server access to them.
////////////////////////////////////////////////////////
const authorizeIPs = require('./middleware/authorizeIPs')
const apiRouter = require('./routes/api-router.js')
const articleRouter = require('./routes/article-router.js')

const { getArticles } = require('./controllers/articleController')

// home page route
app.get('/', getArticles)

// api routes
app.use('/api', authorizeIPs, apiRouter)
app.use('/api/articles', authorizeIPs, articleRouter)

// 404 Route (must be last route)
app.get('*', function (req, res) {
	res.status(404)

	if (req.accepts('html'))
		return res.render('404', { url: req.url, statusCode: res.statusCode })
	if (req.accepts('json')) return res.json({ error: 'Not found' })

	res.type('txt').send('Not found') // otherwise, send plain-text
})

// error handling middleware
app.use(errorHandler)

// app.use(express.static(__dirname + '/node_modules/bootstrap/dist/js'))
app.listen(app.get('port'), function () {
	console.log(
		`App now listening at localhost: ${app.get('port')} (${app.get(
			'deployment'
		)}) `
	)
})
