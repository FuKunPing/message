// 创建message对应的Model对象
const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const msgSchema = new Schema({
    username:String,
    message:String,
    date:String
},{
    collection:"message" //指定集合名称
});

module.exports={
    Message:mongoose.model("msg",msgSchema)
}