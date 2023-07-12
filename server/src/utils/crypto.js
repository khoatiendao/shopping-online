const CryptoUtils = {
    md5(input) {
        const crypto = require('crypto');
        const hash = crypto.createHash('md5').update(input).digest('hex');
        return hash;
    }
};
module.exports = CryptoUtils;

