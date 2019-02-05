var express = require('express');
var app = express();
// Set up routes
var itemRouter = express.Router();
// Require model
var Item = require('../models/Item');

// Register routes
itemRouter.route('/').get(function (req, res) {
    Item.find(function (err, itms){
        if(err){
          console.log(err);
        }
        else {
          res.render('items', {itms: itms});
        }
      });
});
itemRouter.route('/single').get(function (req, res) {
    res.render('singleItem');
})
itemRouter.route('/add').get(function (req, res) {
    res.render('addItem');
});
// Post route
itemRouter.route('/add/post').post(function (req, res) {
    var item = new Item(req.body);
    item.save()
    .then(item => {
        res.redirect('/items');
    })
    .catch(err => {
        res.status(400).send("unable to save to database");
    });
});
// Edit route
itemRouter.route('/edit/:id').get(function (req, res) {
    var id = req.params.id;
    Item.findById(id, function (err, item) {
        res.render('editItem', { item: item });
    })
});
// Register update route
itemRouter.route('/update/:id').post(function (req, res) {
    Item.findById(req.params.id, function (err, item) {
        if (!item) {
            return next(new Error('Could not load document'));
        }
        else {
            item.item = req.body.item;
            item.save()
            .then(item => {
                res.redirect('/items');
            })
            .catch(err => {
                res.status(400).send("unable to update the database");
            });
        }
    });
});
// Remove
itemRouter.route('/delete/:id').get(function (req, res) {
    Item.findByIdAndRemove({ _id: req.params.id },
        function (err, item) {
            if (err) {
                res.json(err);
            }
            else {
                res.redirect('/items');
            }
        }    
    );
});

// Export itemRouter module
module.exports = itemRouter;