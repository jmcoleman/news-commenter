var express = require('express')
var router = express.Router()

// =============================================================
// Routes
// =============================================================
require('../routes/general-routes.js')(router)
require('../routes/article-api-routes.js')(router)
require('../routes/article-comment-routes.js')(router)

module.exports = router
