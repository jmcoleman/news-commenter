# news-commenter

News commenter is a web application that lets users view and leave comments on the recent articles. The articles are captured by scraping the content from another site.

**Problem it solves:** \
Provide a means for users to see the latest news and leave comments that are visible to others on the site. \
**How solved:** \
Scrape current news articles from a news site and present that such that comments can be entered and persisted to a data store. \
**Technical approach:** \
Use cheerio to scrape content from a news site. Store the results in MongoDB using Mongoose. Allow users to view the articles and comment on them. Persist the comments to MongoDB.

## Getting Started

### Prerequisites

Node, NPM and a command line tool such as GitBash.

### Installing

To get a development environment up and running, clone the repository locally.

From the command line, run 'npm init' to setup the project with the below dependencies or by running each of the below directly:

```
$ npm install express
$ npm install express-handlebars
$ npm install handlebars-helpers
$ npm install mongoose
$ npm install cheerio
$ npm install axios
$ npm install path
$ npm install dotenv
$ npm install moment
```

Create an .env file at the root of the project and populate with the sensitive connection info and/or desired logging.

```
# Local Mongo DB
DB_HOST="127.0.0.1"
DB_NAME="newsDB"

# verbose logs
#DEBUG=* node server.js
#DEBUG=express:router* node server.js

```

## Running tests

N/A - No automated tests in place.

Manual unit testing was done to add scraped articles, add new articles after scraping, add and remove comments.

## Deployment

The project is **no longer deployed** to Heroku pages at https://news-commenter.herokuapp.com

## Built With

Express, Express-Handlebars, Mongoose, Cheerio, MongoDB, JQuery, HTML5, CSS3, Bootstrap, Font Awesome

## Contributing

N/A

## Versioning

This is version 1.0

## Authors

- **Jenni Coleman** - _Development and Testing_

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

N/A
