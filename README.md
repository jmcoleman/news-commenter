# News Article Commenter

The News Article Scraper and Commenter is a web application that lets users view and leave comments on the most recent articles that have been scraped from a site.

**Problem it solves:** \
Provide a means for users to see the latest news and leave comments that are visible to others on the site. \

**How solved:** \
Scrape current news articles from a news site and present that such that comments can be entered and persisted to a data store or cleared and reset. \

**Technical approach:** \
Use cheerio to scrape content from a news site. Store the results in MongoDB using Mongoose. Allow users to view the articles and comment on them. Persist the comments to MongoDB.

## Prerequisites

This project requires Node v14.15.4 or higher. Install Node using nvm.

## Environment Variables

Create an .env file at the root of the project and populate with connection info and/or desired logging. Example below.

```
# Local Mongo DB
DB_HOST="127.0.0.1"
DB_NAME="newsDB"

# verbose logs
#DEBUG=* node server.js
#DEBUG=express:router* node server.js
```

## Getting Started

Install the requisite Node modules and start the app.

```
npm install
npm run start
```

Open http://localhost:8080

## Deployment

Deployed to Heroku at https://news-commenter.herokuapp.com

## Built With

Express, Express-Handlebars, Mongoose, Cheerio, MongoDB, HTML5, CSS3, Bootstrap 5, Font Awesome 5

## License

Project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for specifics
