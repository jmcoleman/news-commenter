# news-commenter

News commenter is a web application that lets users view and leave comments on the latest news.  The articles are captured by scraping the content from another site.

**Problem it solves:** \
Provide a means for users to see the latest news and leave comments that are visible to others. \
**How solved:** \
Scrape current news articles from a news site and present that such that comments can be entered and persisted to a data store. \
**Technical approach:** \
Use cheerio and mongoose to scrape content from a news site.  Store the results in MongoDB.  Allow users to view the articles and comment on them.  Persist the comments to MongoDB.

## Getting Started
 
### Prerequisites

Node, NPM and a command line tool such as GitBash.

### Installing

To get a development environment up and running, clone the repository locally.

From the command line, execute the below to setup the project or by running 'npm init':

```

$ npm install express --save
$ npm install express-session --save
$ npm install express-handlebars --save
$ npm install handlebars-helpers --save
$ npm install mongoose --save
$ npm install body-parser --save
$ npm install cheerio --save
$ npm install request --save

$ npm install path --save
$ npm install dotenv --save
$ npm install moment --save


```
Create an .env file at the root of the project and populate with any sensitive connection info and/or desired logging.

```
# express session
SECRET_KEY=ENTER_SECRET_HERE

# verbose logs
#DEBUG=* node server.js
#DEBUG=express:router* node server.js   

```

## Running tests

Unit testing was done to TBD

## Deployment

The project is deployed to Heroku pages at TBD

## Built With

Express, Express-Handlebars, Mongoose, Cheerio, MongoDB, JQuery, HTML5, CSS3, Bootstrap, Font Awesome

## Contributing

N/A

## Versioning

This is version 0.1

## Authors

* **Jenni Coleman** - *Initial development*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

N/A