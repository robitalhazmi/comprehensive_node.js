var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Define Schema
var Item = new Schema({
    // Define item object
    item: {
        type: String
    }
},
{
    // Define collection name
    collection: 'items'
});
// Export Item model
module.exports = mongoose.model('Item', Item);