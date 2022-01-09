//////////////////////////
// dependencies
//////////////////////////
const mongoose = require('mongoose')
const express = require('express')
const connectDB = require('./config/db')
const path = require('path')
const dotenv = require('dotenv')
const moment = require('moment')

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
// connect to the MongoDB on heroku using MONGODB_URI below
let MONGODB_URI =
	process.env.MONGODB_URI ||
	`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`

// override to run Mongo Atlas in dev -- COMMENT OUT FOR DEPLOYMENT (unless dev testing to Atlas)
MONGODB_URI = `mongodb+srv://${process.env.DB_USER_ATLAS}:${process.env.DB_PASSWORD_ATLAS}@${process.env.DB_CLUSTER_ATLAS}/${process.env.DB_NAME_ATLAS}?retryWrites=true&w=majority`
console.log(MONGODB_URI)

// Connect to the Mongo DB
connectDB(MONGODB_URI)

///////////////////////
// configure Express
///////////////////////
const app = express()
app.use(express.json())

// sets the some express variables for info
app.set('port', process.env.PORT || 8080)
app.set('deployment', process.env.NODE_ENV || 'development') // will be set to production in Heroku

// body parsing middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use(cookieParser());

// serve static folders
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/public/assets/img'))

/////////////////
// handlebars
/////////////////
const exphbs = require('express-handlebars')

//Here you can pass helpers that you would normally define in registerHelpers
//and you can also define stuff like `defaultLayout` and `partialsDir`
const hbs = exphbs.create({
	helpers: {
		defaultLayout: 'main',
		layoutsDir: path.join(__dirname, '/views/layouts/'),
		partialsDir: path.join(__dirname, '/views/partials/'),
		sayHello: function () {
			alert('Hello World')
		},
		getStringifiedJson: function (value) {
			return JSON.stringify(value)
		},
		readableDate: function (date) {
			// return in utc to convert the date from the offset provided to UTC
			// these dates have no timezone
			return moment.utc(date).format('MM/DD/YYYY')
		},
	},
})

// handlebar configuration
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

// more handlebars helpers
require('handlebars-helpers')(['comparison'])

////////////////////////////////////////////////////////
// Import routes and give the server access to them.
////////////////////////////////////////////////////////
const routes = require('./controllers/routeController.js')
app.use(routes)

app.listen(app.get('port'), function () {
	console.log(
		`App now listening at localhost: ${app.get('port')} (${app.get(
			'deployment'
		)}) `
	)
})
