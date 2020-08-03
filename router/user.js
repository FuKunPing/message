const { user } = require(".");
const db=require("../model");
const User=db.User;
const router=require("express").Router();
const { encrypt } =require("../model/myMd5.js");

// /user请求,跳转到登录页面
router.get('/',function(req,res){
    res.redirect("/user/login");
});

//  get方式的/user/login,显示登录页面
router.get("/login",function(req,res){
    res.render("login");
});

// post方式的/user/login，处理登录请求
router.post('/login',function(req,res){
    var body=req.body;
    var username=body.username;
    var password=body.password;
    var remember=body.remember;
    // console.log(username,password,remember);//张三 123 on
    var filter={
        username:username,
        password:encrypt(password)
    };
    // 到数据库中查询
    db.find(User,filter,function(err,result){
        if(err){
            console.log(err);
            res.render('error',{errMsg:"网络波动,稍后再试"});
            return ;
        }
        if(result.length==0){
            // 没有结果，用户名密码错误
            res.send("<h1>用户名或密码错误，点击<a href='/user/login'>返回</a></h1>")
        }
        // 用户名密码正确，登录成功
        req.session.username=username;
        if(remember){
            req.session.cookie.maxAge=30*24*60*60*1000;
        }
        //登录成功，跳转到留言板页面
        res.redirect("/");
    });
});


// get方式的/user/regist，跳转注册页面
router.get("/regist",function(req,res){
    res.render("regist");
});

// post /user/check，检查用户名是否存在(Ajax的请求)
router.post('/check',function(req,res){
    var username = req.body.username;
    // 检查
    db.find(User,{username:username},function(err,result){
      if(err){
        console.log(err);
        res.send({status:1,msg:"网络错误"});
        return ;
      }
      if(result.length>0){
        res.send({status:1,msg:"用户名已存在"});
      }else{
        res.send({status:0,msg:"用户名可用"})
      }
    })
  })


//  post /user/regist注册请求
router.post("/regist",function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    //====用户名重复的验证===
    var data={
        username:username,
        password:encrypt(password),
        nickname:username//昵称
    };
    db.add(User,data,function(err){
        if(err){
            console.log(err);
            res.render("error",{errMsg:"网络错误，注册失败"});
            return ;
        }
        // 注册成功，设置登录状态
        req.session.username=username;
        // 跳转到首页
        res.redirect("/");
    })
});

// get  /user/logout，退出登录
router.get("/logout",function(req,res){
    // 退出登录实际上就是删除保存的登录信息
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.render("error",{msg:"退出失败"});
            return ;
        }
        res.redirect('/');
    });
});

// get  /user/center  跳转到个人中心页面
router.get('/center',function(req,res){
    // 登录的用户名
    var username=req.session.username;
    // 根据用户名获取登录用户的信息
    var filter={username:username};//查询的条件
    var fields='username nickname avatar';//要获取的属性
    User.find(filter,fields,function(err,user){
        if(err){
            console.log(err);
            res.render("error",{errMsg:"获取数据错误"})
        }
        if(user.length==0){
            res.render("error",{errMsg:"获取数据错误"});
            return ;
        }
        res.render("center",{user:user[0]});
    })   
});

// get /user/changePwd,跳转到修改密码的页面
router.get('/changePwd',function(req,res){
    res.render('changePwd');
});


// get /user/checkPwd(ajax),验证原密码是否正确
router.get('/checkPwd',function(req,res){
    var username=req.session.username;
    // 获取输入的密码
    var password=req.query.password;
    // 查询的条件： 加密后的密码
    var filter={
        username:username,
        password:encrypt(password)
    };
    // 查询密码是否存在
    db.find(User,filter,function(err,users){
        if(err){
            console.log(err);
            res.send({status:1,msg:"验证失败"});
            return ;
        }
        if(users.length==0){
            // 没有查到数据，密码错误
            res.send({status:1,msg:"原密码错误"});
            return ;
        }
        res.send({status:0,msg:"原密码正确"});
    })
});

//  post /user/changePwd,修改数据库中的密码
router.post('/changePwd',function(req,res){
    // 获取 当前登录的用户的信息
    var username=req.session.username;
    // 获取修改的新密码
    var password=req.body.password;
    // 修改条件
    var filter={
        username:username
    };
    // 修改的数据
    var data={
        password:encrypt(password)
    };
    db.modify(User,filter,data,function(err,result){
        if(err){
            console.log(err);
            res.render('error',{errMsg:"修改失败"});
            return ;
        }
        if(result.nModified==0){
            // 修改的数据为0条
            res.render("error",{errMsg:"新密码与旧密码相同"});
            return ;
        }
        // 修改成功后，重新登录
        req.session.destroy(function(err){
            if(err){
                console.log(err);
                res.render("error",{errMsg:"请退出，重新登录"});
                return ;
            }
            res.redirect('/');
        })
        // 修改成功，回到个人中心
        // res.redirect('/user/center');
    })
});

// get /user/changeNick,修改昵称
router.get('/changeNick',function(req,res){
    // 获取登录的用户名
    var username=req.session.username;
    // 获取新昵称
    var nickname=req.query.nickname;
    var filter={
        username:username
    }
    var data={
        nickname:nickname
    };
    // 修改
    db.modify(User,filter,data,function(err,result){
        if(err){
            console.log(err);
            res.send({status:1,msg:"修改失败"});
            return ;
        }
        if(result.nModified==0){
            res.send({status:1,msg:"修改失败"});
            return ;
        }
        res.send({status:0,msg:"修改成功"});
    })
})





module.exports=router;