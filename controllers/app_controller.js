var express = require("express");
var router = express.Router();

// =============================================================
// Routes
// =============================================================
require("../public/assets/routes/html-routes.js")(router);
require("../public/assets/routes/api-routes.js")(router);

module.exports = router;