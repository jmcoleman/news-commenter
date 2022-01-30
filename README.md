# News Article Commenter

The News Article Scraper and Commenter is a web application that lets users view and leave comments on the most recent articles that have been scraped from a site.

**Problem it solves:**\
Allows users to view the latest Smashing Magazine news and leave comments that are visible to others on a shared site.

**How solved:**\
Scrape current news articles and present that such that comments can be entered and persisted to a data store or cleared and reset.

**Technical approach:**\
Use cheerio to scrape content from a news site. Store the results in MongoDB using Mongoose. Allow users to view the articles and comment on them. Persist the comments to MongoDB.

## Prerequisites

This project uses Node v16.13.2 or higher. Install Node using nvm.

## Getting Started

### Environment Variables

Rename .env.example to .env at the root of the project and populate with connection info for the desired values.

```
# Local Mongo DB
DB_HOST="127.0.0.1"
DB_NAME="newsDB"
...
```

### Usage

Install the requisite Node modules and start the app.

```
npm install
npm run start
```

From a browser open http://localhost:8080

### Debugging

At the command line prepend with DEBUG=_ or DEBUG=express:router_ for verbose logs from express.

```
DEBUG=* node server.js
DEBUG=express:router* node server.js
```

## Deployment

Deployed to Heroku at https://news-commenter.herokuapp.com

## Built With

Express, Express-Handlebars, Mongoose, Cheerio, MongoDB, HTML5, CSS3, Bootstrap 5, Font Awesome 5

## License

Project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for specifics
