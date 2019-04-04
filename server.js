const mongoose = require("mongoose");

/////////////////////////////////////////////////////////
// handle environment variables
/////////////////////////////////////////////////////////

// use dotenv to read .env vars into Node but silence the Heroku log error for production as no .env will exist
require("dotenv").config({ silent: process.env.NODE_ENV === "production" });

// process.env.NODE_ENV is set by heroku with a default value of production
if (process.env.NODE_ENV === "production") {
	console.log("in PROD");
	// connect to the MongoDB on heroku using MONGODB_URI below
} else {
	console.log("in DEV");
	// use the connection info from the .env file otherwise
	require("dotenv").load();
}
// console.log("process env: " + JSON.stringify(process.env,null,'\t'));

//////////////////////////
// dependencies
//////////////////////////
var express = require("express");
var session = require("express-session");
var path = require("path");
var bodyParser = require("body-parser");
var moment = require("moment");

///////////////////////
// configure Express
///////////////////////
var app = express();
app.use(express.json());

// sets the port info
app.set("port", process.env.PORT || 8080);

// body parsing middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(cookieParser());

// serve static folders
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/public/assets/img"));

/////////////////////////
// connect to Mongo DB
/////////////////////////
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.set("useCreateIndex", true);

/////////////////
// handlebars
/////////////////
var exphbs = require("express-handlebars");

//Here you can pass helpers that you would normally define in registerHelpers
//and you can also define stuff like `defaultLayout` and `partialsDir`
var hbs = exphbs.create({
	helpers: {
		sayHello: function() {
			alert("Hello World");
		},
		getStringifiedJson: function(value) {
			return JSON.stringify(value);
		},
		readableDate: function(date) {
			// return in utc to convert the date from the offset provided to UTC
			// these dates have no timezone
			return moment.utc(date).format("MM/DD/YYYY");
		}
	},
	defaultLayout: "main"
});

// handlebar configuration
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// more handlebars helpers
require("handlebars-helpers")(["comparison"]);

/////////////////////
// Expess Session
/////////////////////
// console.log("secret: " +  process.env.SECRET_KEY);
app.use(
	session({
		secret: process.env.SECRET_KEY, // put this in the heroku environment variables
		saveUninitialized: true,
		resave: true
	})
);

////////////////////////////////////////////////////////
// Import routes and give the server access to them.
////////////////////////////////////////////////////////
var routes = require("./controllers/app_controller.js");
app.use(routes);

app.listen(app.get("port"), function() {
	console.log("App now listening at localhost: " + app.get("port"));
});
