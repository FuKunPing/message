// 封装加密模块
const crypto=require("crypto");

/**
 * 
 * @param {String}  str  加密的明文
 * @returns {String} pass 返回的密文 
 */
exports.encrypt=function(str){
    // 第一次加密
    var pass=crypto.createHash('md5').update(str).digest("base64");
    //  对第一次加密得到的明文做处理
    pass=pass.substring(18)+pass.substring(6,12);
    pass='hello,'+pass+',welcome!';
    return crypto.createHash('md5').update(pass).digest("base64");

}


