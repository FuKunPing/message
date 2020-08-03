// 创建message对应的Model对象
const mongoose=require("mongoose");
const Schema=mongoose.Schema;

// 创建message的schema
const msgSchema = new Schema({
    username:String,
    message:String,
    date:String
},{collection:"message"});

// 创建user的schema
const userSchema=new Schema({
    username:String,
    password:String,
    nickname:String,
    avatar:{type:String,default:"/imgs/avatar.jpg"}
})

module.exports={
    Message:mongoose.model('msg',msgSchema),
    User:mongoose.model('user',userSchema)
}







