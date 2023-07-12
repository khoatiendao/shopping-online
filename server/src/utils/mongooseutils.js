const mongoose = require('mongoose');
const myconstants = require('./myconstant');
const urlDB = 'mongodb+srv://' + myconstants.DB_USER + ':' + myconstants.DB_PASSWORD + '@' + myconstants.DB_SERVER 
              + '/' + myconstants.DB_DATABASE;
mongoose.connect(urlDB, { useNewUrlParser: true }).then(() => {
    console.log('Connected to ' + myconstants.DB_SERVER + '/' + myconstants.DB_DATABASE);

}).catch((err) => {
    console.error('Connected failed' + err);
}); 