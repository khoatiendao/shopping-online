const express = require('express');
const router = express.Router();
const cors = require('cors')
// daos
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const CustomerDAO = require('../models/CustomerDAO');
const CryptoUtil = require('../utils/crypto');
const EmailUtil = require('../utils/email');
const JwtUtil = require('../utils/jwtutils');
const OrderDAO = require('../models/OrderDAO');


// router


// category customer
router.get('/categories', async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});
// product new customer
router.get('/products/new', async function (req, res) {
  const products = await ProductDAO.selectTopNew(3);
  res.json(products);
});

// product hot customer
router.get('/products/hot', async function (req, res) {
  const products = await ProductDAO.selectTopHot(3);
  res.json(products);
});

// category products customer
router.get('/products/category/:cid', async function(req, res) {
    const _cid = req.params.cid;
    const products = await ProductDAO.selectByCatId(_cid);
    res.json(products);
});

// products search customer
router.get('/products/search/:keyword', async function(req, res) {
    const keyword = req.params.keyword;
    const products = await ProductDAO.selectByKeyword(keyword);
    res.json(products);
});

// products detail customer
router.get('/products/:id', async function (req, res) {
    const _id = req.params.id;
    const products = await ProductDAO.selectById(_id);
    res.json(products);
});

// signup customer
router.post('/signup', async function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);
  if (dbCust) {
    res.json({ success: false, message: 'Exists username or email' });
  } else {
    const now = new Date().getTime();
    const token = CryptoUtil.md5(now.toString());
    const newCust = { username: username, password: password, name: name, phone: phone, email: email, active: 0, token: token };
    const result = await CustomerDAO.insert(newCust);
    if (result) {
      const send = await EmailUtil.send(email, result._id, token);
      if (send) {
        res.json({ success: true, message: 'Please check your email' })
      }else {
        res.json({ success: false, message: 'Email failure' })
      }
    }else {
      res.json({ success: false, message: 'Insert failure' })
    }
  }
});

// active customer
router.post('/active', async function(req, res) {
  const _id = req.body.id;
  const token = req.body.token;
  const result = await CustomerDAO.active(_id, token, 1);
  res.json(result);
});

// login - logout customer
router.post('/login', async function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    const customer = await CustomerDAO.selectByUsernameAndPassword(username, password);
    if (customer) {
      if (customer.active === 1) {
        const token = JwtUtil.genToken();
        res.json({ success: true, message: 'Authentication successful', token: token, customer: customer });
      } else {
        res.json({ success: false, message: 'Account is decactive' });
      }
    } else {
      res.json({ success: false, message: 'Incorrect username or password' });
    }
  } else {
    res.json({ success: false, message: 'Please input username or password' });
  }
});

router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  res.json({ success: true, message: 'Token is valid', token: token });
});

// update profile customer
router.put('/profile/:id', JwtUtil.checkToken, async function(req, res) {
  const _id = req.params.id;
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const customer = { _id: _id, username: username, password: password, name: name, phone: phone, email: email };
  const result = await CustomerDAO.update(customer);
  res.json(result);
});
module.exports = router;

// Order products
router.post('/checkout', JwtUtil.checkToken, async function(req, res) {
  const now = new Date().getTime();
  const total = req.body.total;
  const items = req.body.items;
  const customer = req.body.customer;
  const order = { cdate: now, total: total, status: 'PENDING', customer: customer, items: items };
  const result = await OrderDAO.insert(order);
  res.json(result);
});

// order customer
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function(req, res) {
  const _cid = req.params.cid;
  const orders = await OrderDAO.selectByCustId(_cid);
  res.json(orders);
});