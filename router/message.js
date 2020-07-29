// 处理留言的路由
const express=require("express");
const Route=express.Router();
const db=require("../model");
const Message=db.Message;


// /message请求
Route.get("/",function(req,res){
    // 查询数据库中的数据，传递给index页面解析
    db.find(Message,function(err,docs){
        if(err){
            console.log(err);
            res.render("error",{errMsg:"网络错误，稍后再试"});
            return ;
        }
        // 取到数据，传递给页面
        res.render("index",{msg:docs});
    });
});

// post /message/tijiao
Route.post("/tijiao",function(req,res){
    var query=req.body;
    // var username=query.username;
    // var message=query.message;
    db.add(Message,query,function(err){
        if(err){
            console.log(err);
            res.render("error",{errMsg:"提交留言失败"});
            return ;
        }
        // 提交成功 回到首页
        res.redirect('/');
    });
});











// 暴露出去
module.exports=Route;