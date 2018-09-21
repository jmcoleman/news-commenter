var express = require("express");
var router = express.Router();

// =============================================================
// Routes
// =============================================================
require("../public/assets/routes/general-routes.js")(router);
require("../public/assets/routes/article-api-routes.js")(router);

module.exports = router;