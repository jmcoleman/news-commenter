//////////////////////////
// dependencies
//////////////////////////
const mongoose = require('mongoose')
const express = require('express')
const session = require('express-session')
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

process.env.NODE_ENV === 'production'
	? console.log('in PROD')
	: console.log('in DEV')
// console.log("process env: " + JSON.stringify(process.env,null,'\t'));

/////////////////////////
// connect to Mongo DB
/////////////////////////
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
// connect to the MongoDB on heroku using MONGODB_URI below
const MONGODB_URI =
	process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines'

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
// mongoose.Promise = Promise
mongoose.connect(MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
})

///////////////////////
// configure Express
///////////////////////
const app = express()
app.use(express.json())

// sets the port info
app.set('port', process.env.PORT || 8080)

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
	defaultLayout: 'main',
})

// handlebar configuration
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

// more handlebars helpers
require('handlebars-helpers')(['comparison'])

/////////////////////
// Express Session
/////////////////////
// console.log("secret: " +  process.env.SECRET_KEY);
app.use(
	session({
		secret: process.env.SECRET_KEY, // put this in the heroku environment variables
		saveUninitialized: true,
		resave: true,
	})
)

////////////////////////////////////////////////////////
// Import routes and give the server access to them.
////////////////////////////////////////////////////////
const routes = require('./controllers/app_controller.js')
app.use(routes)

// let apiRoutes = require('./routes/article-api-routes')
// app.use('/api', apiRoutes)

app.listen(app.get('port'), function () {
	console.log('App now listening at localhost: ' + app.get('port'))
})
