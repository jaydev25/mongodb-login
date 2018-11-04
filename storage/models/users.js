const mongoose = require('mongoose');
const config = require('../../api/config/development');
mongoose.connect(config.dbURI);
const userSchema = new mongoose.Schema({
    email: String,
    firstName: String,
    lastName: String,
    contact: String,
    password: String,
    createdBy: String,
    updatedBy: String,
    createdAt: String,
    updatedAt: String
});
const userModel = mongoose.model('testuser', userSchema);
// const Schema = mongoose.Schema;
//
// const ProductSchema = new Schema({}, { strict: false });
// const Product = mongoose.model('Product', ProductSchema, 'products');

module.exports = { userModel };
