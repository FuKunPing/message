const express=require("express");
const {message, user, checkLogin}=require("./router");
const app=express();

app.listen(4000);
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static('../public'));

// 访问/请求
app.get('/',function(req,res){
    res.render('/message?page=1');
});

// 验证是否已经登录
app.use(checkLogin);


// 处理/message开头的请求
app.use('/message',message);




