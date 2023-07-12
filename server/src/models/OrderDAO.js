const mongooseutils = require('../utils/MongooseUtils');
const models = require('./models');

const OrderDAO = {
    async insert(order) {
        const mongoose = require('mongoose');
        order._id = new mongoose.Types.ObjectId();
        const result = await models.Order.create(order);
        return result;
    },
    async selectByCustId(_cid) {
        const query = { 'customer._id': _cid };
        const orders = await models.Order.find(query).exec();
        return orders;
    },
    async selectAll() {
        const query = {};
        const mysort = { cdate: -1 };
        const orders = await models.Order.find(query).sort(mysort).exec();
        return orders;
    },
    async update(_id, newStatus) {
        const newvalues = { status: newStatus };
        const result = await models.Order.findByIdAndUpdate(_id, newvalues, {new: true});
        return result;
    }
};
module.exports = OrderDAO;