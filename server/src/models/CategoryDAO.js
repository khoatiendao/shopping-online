const mongooseutils = require('../utils/mongooseutils');
const models = require('../models/Models');

const CategoryDAO = {
    async selectAll() {
        const query = {};
        const categories = await models.Category.find(query).exec();
        return categories;
    },
    async insert(category) {
        const mongoose = require('mongoose');
        category._id = new mongoose.Types.ObjectId();
        const result = await models.Category.create(category);
        return result;
    },
    async update(category) {
        const newvalues = { name: category.name };
        const result = await models.Category.findByIdAndUpdate(category._id, newvalues, { new: true });
        return result; 
    },
    async delete(_id) {
        const result = await models.Category.findByIdAndRemove(_id);
        return result;
    },
    async selectById(_id) {
        const category = await models.Category.findById(_id).exec();
        return category;
    }
};
module.exports = CategoryDAO;
