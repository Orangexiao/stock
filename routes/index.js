var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/goToSignIn.do',function(req,res,next){
  console.log('test');
  res.render('tpl/page_signin.html');
})
//获取主页
router.get('/common/goToIndex.do',function(req,res){
  res.render('tpl/app_dashboard_v1.html');
});
//获取框架主页
router.get('/common/goToApp.do',function(req,res){
  console.log('test');
  res.render('tpl/app.html');
});

//获取设置页
router.get('/common/goToSettings.do',function(req,res){
  res.render('tpl/blocks/settings.html');
})
//获取头部
router.get('/common/goToHeader.do',function(req,res){
  res.render('tpl/blocks/header.html');
});
//获取左边
router.get('/common/goToAside.do',function(req,res){
  res.render('tpl/blocks/aside.html');
});
//获取导航页
router.get('/common/goToNav.do',function(req,res){
  res.render('tpl/blocks/nav.html');
});
//获取右边栏
router.get('/common/goToAsideRight.do',function(req,res){
  res.render('tpl/blocks/aside.right.html');
});


module.exports = router;
