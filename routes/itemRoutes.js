var express = require('express');
var app = express();

// Set up routes
var itemRouter = express.Router();

// Register routes
itemRouter.route('/').get(function (req, res) {
    res.render('items');
});
itemRouter.route('/single').get(function (req, res) {
    res.render('singleItem');
})
itemRouter.route('/add').get(function (req, res) {
    res.render('addItem');
});

// Export itemRouter module
module.exports = itemRouter;