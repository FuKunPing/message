const express=require("express");
const app=express();
const {message, checkIslogin, user}=require("./router");
const session=require("express-session");

app.listen(4000);
// 设置post请求方式
app.use(express.urlencoded({extended:true}));
// 设置根目录
app.use(express.static("./public"));
app.use(express.static('./temp'));
app.use(express.static('./avatars'));
// 设置视图模板
app.set("view engine",'ejs');

app.use(session({
    secret:"aaa",
    resave:false,
    saveUninitialized:true
}));

// 访问/请求
app.get("/",function(req,res){
    res.redirect("/message?page=1");
});

// 验证是否已经登录
app.use(checkIslogin);

// 处理/message开头的请求
app.use("/message",message);

// 处理/user开头的请求地址
app.use('/user',user);

/* 
不需要登录验证的请求
    登录请求
    注册请求
*/
