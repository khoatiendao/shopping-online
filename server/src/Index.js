const express = require('express');
const cors = require('cors');
const http = require('http');
const morgan =  require('morgan');
const mongooseutils = require('./utils/MongooseUtils');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 8000;


app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});

app.use(morgan('combined'));


app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, OPTIONS, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type,x-access-token");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("optionsSucessStatus", 200)
    next()
});

app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-access-token'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// const corsOptions = {
//     origin: 'http://localhost:3000/active',
//     methods: 'POST',
//     allowedHeaders: 'Content-Type,Authorization,x-access-token'
// };

// app.use(cors(corsOptions));

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({extended:true, limit:'10mb'}));


app.get('/hello', (req, res) => {
    res.json({ message: 'hello from server!' });
});

// app.get('/database', (req, res) => {
//     res.json(mongooseutils);
// });

app.use('/api/admin', require('./api/admin.js'));

app.use('/api/customer', require('./api/customer.js'));


// Deployment
const path = require('path');

app.use('/admin', express.static(path.resolve(__dirname, '../client-admin/client-admin-react/build')));

app.get('admin/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client-admin/client-admin-react/build', 'index.html'))
});

app.use('/', express.static(path.resolve(__dirname, '../client-customer/client-customer-react/build')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client-customer/client-customer-react/build', 'index.html'));
});