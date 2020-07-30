const express=require("express");
const app=express();
const {message}=require("./router");

app.listen(4000);
// 设置post请求方式
app.use(express.urlencoded({extended:true}));
// 设置根目录
app.use(express.static("./public"));
// 设置视图模板
app.set("view engine",'ejs');

// 访问/请求
app.get("/",function(req,res){
    res.redirect("/message?page=1");
});

// 处理/message开头的请求
app.use("/message",message);



