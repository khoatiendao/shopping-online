const express = require('express');
const router = express.Router();
const EmailUtil = require('../utils/email');
const jwtUtil = require('../utils/jwtutils');

const AdminDAO = require('../models/AdminDAO');

const OrderDAO = require('../models/OrderDAO');
const CustomerDAO = require('../models/CustomerDAO');

router.post('/login', async function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    if(username && password) {
        const admin = await AdminDAO.selectByUsernameAndPassword(username, password);
        if(admin) {
            const token = jwtUtil.genToken();
            res.json({ success: true, message: 'Authentication successful', token: token });
        }else {
            res.json({ success: false, message: 'Incorrect username or password' });
        }
    }else {
        res.json({ success: false, message: 'Please input username and password' });
    }
});
router.get('/token', jwtUtil.checkToken ,function(req, res){
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    res.json({ success: true, message: 'Token is Valid', token: token });
});

// DAOS
const CategoryDAO = require('../models/CategoryDAO');

// Categories
router.get('/categories', jwtUtil.checkToken, async function(req, res) {
    const categories = await CategoryDAO.selectAll();
    res.json(categories);
});

router.post('/categories', jwtUtil.checkToken, async function(req, res) {
    const name = req.body.name;
    const category = { name: name };
    const result = await CategoryDAO.insert(category);
    res.json(result);
});
router.put('/categories/:id', jwtUtil.checkToken, async function(req, res) {
    const _id = req.params.id;
    const name = req.body.name;
    const category = { _id: _id, name: name };
    const result = await CategoryDAO.update(category);
    res.json(result);
});
router.delete('/categories/:id', jwtUtil.checkToken, async function(req, res) {
    const _id = req.params.id;
    const result = await CategoryDAO.delete(_id);
    res.json(result);
});

// Products

const ProductDAO = require('../models/ProductDAO');
const JwtUtil = require('../utils/jwtutils');
// const OrderDAO = require('../models/OrderDAO');

router.get('/products', jwtUtil.checkToken, async function(req, res) {
    var products = await ProductDAO.selectAll();
    const sizePage = 4;
    const noPage = Math.ceil(products.length / sizePage);
    var curPage = 1;
    if (req.query.page) curPage = parseInt(req.query.page);
    const offSet = (curPage - 1) * sizePage;
    products = products.slice(offSet, offSet + sizePage);

    const result = { products: products, noPage: noPage, curPage: curPage };
    res.json(result);
});

router.post('/products', jwtUtil.checkToken, async function(req, res) {
    const name = req.body.name;
    const price = req.body.price;
    const cid = req.body.category;
    const image = req.body.image;
    const now = new Date().getTime();
    const category = await CategoryDAO.selectById(cid);
    const product = { name: name, price: price, image: image, cdate: now, category: category };
    const result = await ProductDAO.insert(product);
    res.json(result);
});

router.put('/products/:id', jwtUtil.checkToken, async function(req, res) {
    const _id = req.params.id;
    const name = req.body.name;
    const price = req.body.price;
    const cid = req.body.category;
    const image = req.body.image;
    const now = new Date().getTime();
    const category = await CategoryDAO.selectById(cid);
    const product = { _id: _id, name: name, price: price, image: image, cdate: now, category: category  };
    const result = await ProductDAO.update(product);
    res.json(result);
});

router.delete('/products/:id', jwtUtil.checkToken, async function(req, res) {
    const _id = req.params.id;
    const result = await ProductDAO.delete(_id);
    res.json(result);
});

router.get('/orders', jwtUtil.checkToken, async function(req, res) {
    const orders = await OrderDAO.selectAll();
    res.json(orders);
});

router.put('/orders/status/:id', JwtUtil.checkToken, async function(req, res) {
    const _id = req.params.id;
    const newStatus = req.body.status;
    const result = await OrderDAO.update(_id, newStatus);
    res.json(result);
});

router.get('/list/customers', jwtUtil.checkToken, async function(req, res) {
    const customers = await CustomerDAO.selectAll();
    res.json(customers);
});

router.get('/orders/list/customer/:cid', jwtUtil.checkToken, async function(req, res) {
    const _cid = req.params.cid;
    const orders = await OrderDAO.selectByCustId(_cid);
    res.json(orders);
});

router.put('/customers/deactive/:id', jwtUtil.checkToken, async function(req, res) {
    const _id = req.params.id;
    const token = req.body.token;
    const result = await CustomerDAO.active(_id, token, 0);
    res.json(result);
});

router.get('/customer/sendmail/:id', jwtUtil.checkToken, async function(req, res) {
    const _id = req.params.id;
    const cust = await CustomerDAO.selectById(_id);
    if(cust) {
        const send = await EmailUtil.send(cust.email, cust._id, cust.token);
        if(send) {
            res.json({ success: true, message: 'Please check email' });
        }else {
            res.json({ success: false, message: 'Email failure' });
        }
    }else {
        res.json({ success: false, message: 'Not exists customer' });
    }
});
module.exports = router;