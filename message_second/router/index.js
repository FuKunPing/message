const { user } = require('../../router/index.js');

module.exports={
    message:require('./message.js'),
    user:require('./user.js'),
    checkLogin:require('./checkLogin.js')
}