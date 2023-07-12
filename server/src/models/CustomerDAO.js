const mongoose = require('../utils/MongooseUtils');
const models = require('./models');

const CustomerDAO = {
    async selectByUsernameOrEmail(username, email) {
        const query = { $or: [{ username: username }, { email: email }]};
        const customer = await models.Customer.findOne(query);
        return customer;
    },
    async insert(customer) {
        const mongoose = require('mongoose');
        customer._id = new mongoose.Types.ObjectId();
        const result = await models.Customer.create(customer);
        return result;
    },
    async active(_id, token, active) {
        const query = { _id: _id, token: token };
        const newvalues = { active: active };
        const result = await models.Customer.findOneAndUpdate(query, newvalues, { new: true });
        return result;
    },
    async selectByUsernameAndPassword(username, password) {
        const query = { username: username, password: password };
        const customer = await models.Customer.findOne(query);
        return customer;
    },
    async update(customer) {
        const newvalues = { username: customer.username, password: customer.password, name: customer.name, phone: customer.phone, email: customer.email };
        const result = await models.Customer.findByIdAndUpdate(customer._id, newvalues, { new: true });
        return result;
    },
    async selectAll() {
        const query = {};
        const customers = await models.Customer.find(query).exec();
        return customers;
    },
    async selectById(_id) {
        const customer = await models.Customer.findById(_id).exec();
        return customer;
    }
};
module.exports = CustomerDAO;