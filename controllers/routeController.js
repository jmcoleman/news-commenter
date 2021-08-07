var express = require('express')
var router = express.Router()

// =============================================================
// Routes
// =============================================================
router.use('/comments', require('../routes/article-comment-routes.js'))
router.use('/api', require('../routes/article-routes.js'))
router.use('/', require('../routes/general-routes.js'))

module.exports = router
