const mongoose = require('../utils/mongooseutils');
// const { selectById } = require('./CategoryDAO');
const models = require('./Models');

const ProductDAO = {
    async selectAll() {
        const query = {};
        const products = await models.Product.find(query).exec();
        return products;
    },
    async insert(product) {
        const mongoose = require('mongoose');
        product._id = new mongoose.Types.ObjectId();
        const result = await models.Product.create(product);
        return result;
    },
    async selectById(_id) {
        const product = await models.Product.findById(_id).exec();
        return product;
    },
    async update(product) {
        const newValues = { name: product.name, price: product.price, image: product.image, category: product.category }
        const result = await models.Product.findByIdAndUpdate(product._id, newValues, { new: true});
        return result;
    },
    async delete(_id) {
        const result = await models.Product.findByIdAndRemove(_id);
        return result;
    },
    async selectTopNew(top) {
        const query = {};
        const mySort = { cdate: - 1 };
        const products = await models.Product.find(query).sort(mySort).limit(top).exec();
        return products;
    },
    async selectTopHot(top) {
        const items = await models.Order.aggregate([
            { $match: { status: 'APPROVED' }},
            { $unwind: '$items' },
            { $group: { _id: '$items.product._id', sum: { $sum: '$item.quantity' }}},
            { $sort: {sum: -1}},
            { $limit: top }
        ]).exec();
        var products = [];
        for (const item of items) {
            const product = await ProductDAO.selectById(item._id);
            products.push(product);
        }
        return products;
    },
    async selectByCatId(_cid) {
        const query = { 'category._id': _cid };
        const products = await models.Product.find(query).exec();
        return products;
    },
    async selectByKeyword(keyword) {
        const query = { name: { $regex: new RegExp(keyword, "i")}};
        const products = await models.Product.find(query).exec();
        return products;
    }
};
module.exports = ProductDAO;
