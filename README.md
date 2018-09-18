# news-commenter

News commenter is a web application that lets users view and leave comments on the latest news.  The articles are captured by scraping the content from another site.

**Problem it solves:** \
Provide a means for users to see the latest news and leave comments that are visible to others. \
**How solved:** \
Use cheerio and mongoose to scrape content from a news site and present that such that comments can be entered and persisted. \
**Technical approach:** \
TBD

## Getting Started
 
### Prerequisites

Node, NPM and a command line tool such as GitBash.

### Installing

To get a development environment up and running, clone the repository locally.

From the command line, execute the below to setup the project or by running 'npm init':

```

$ npm install express --save
$ npm install express-handlebars --save
$ npm install mongoose --save
$ npm install body-parser --save
$ npm install cheerio --save
$ npm install request --save

$ npm install path --save
$ npm install dotenv --save
$ npm install moment --save


```
Create an .env file at the root of the project and populate with connection info.

```
# Local DB

DB_DEV_USERNAME="ENTER_DB_USER_NAME_HERE"
DB_DEV_PASSWORD="ENTER_PASSWORD_HERE"
DB_DEV_DATABASE="ENTER_DB_NAME_HERE"
DB_DEV_HOST="127.0.0.1"
DB_DEV_PORT=ENTER_PORT_NAME_HERE

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