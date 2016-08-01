var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var routes = require('./routes/index');
var users = require('./routes/users');
var config = require('./config/config');
var jwt = require('jsonwebtoken');

var redis = require('redis');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.set('views', path.join(__dirname, 'views/src'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views/src')));

app.use('/', routes);
app.use('/users', users);

var redisClient = redis.createClient(6379,"localhost");

var sequelize = new Sequelize('stock','postgres','woailaopo777',{
  host : 'localhost',
  dialect : 'postgres',
  pool : {
    max : 100,
    min : 1,
    idle : 10000
  },
  timezone : '+08:00'
});

var SqlUtil = require('./util/SqlUtil');
var sqlUtil = new SqlUtil();

var log4js = require('log4js');
log4js.configure({
  appenders : [
    {type : 'console'},
    {
      type : 'file',
      filename : '../log/access.log',
      maxLogSize : 1024,
      backups : 3,
      category : 'normal'
    }
  ]
});

var logger = log4js.getLogger('normal');
logger.setLevel('INFO');

app.use(function(req,res,next){
  //前往登录页面的跳过验证
  //TODO 跳过的url应该要做配置
  console.log(req.originalUrl);
  if(req.originalUrl.toString().indexOf('login.do')>0||req.originalUrl.toString()==="/"||req.originalUrl.toString().indexOf('goToSignIn.do')>0){
    next();
  }else{
    //TODO 要从redis中把token取出，key为userId（？）
    var token = req.headers.token;
    if(token){
      //var token = req.param('token');
      var decode = jwt.verify(token, config.jwtTokenSecret);
      redisClient.get(decode.operatorInfoPkid,function(err,redisToken){
        redisClient.get(decode.operatorInfoPkid + 'timestamp',function(err,timestamp){
          console.log(redisToken);
          if(redisToken!==token){
            res.status(401);
            res.send({
              result : 'authError',
              errorMessage : '权限验证异常，请重新登录！'
            })
          }else{
            var loginMins = (new Date().getTime() - timestamp)/1000/60;
            if(loginMins > 30){
              res.status(401);
              res.send({
                result : 'timeOutError',
                errorMessage : '登入超时，请重新登入！'
              });
            }else{
              redisClient.set(decode.operatorInfoPkid + 'timestamp',new Date().getTime());
              next();
            }
          }
        })
      });
    }else{
      res.status(401);
      res.send({
        result : 'authError',
        errorMessage : '你没有访问该页面的权限！'
      })
    }
  }
});


require('./routes/login')(app,sequelize,redisClient);
require('./routes/operatorInforoute')(app,sequelize);
require('./routes/functionInforoute')(app,sequelize);
require('./routes/roleInforoute')(app,sequelize);
require('./routes/operatorRoleroute')(app,sequelize);
require('./routes/roleFunctionroute')(app,sequelize);
require('./routes/dictClsroute')(app,sequelize);
require('./routes/dictOptroute')(app,sequelize);
require('./routes/productInforoute')(app,sequelize);
require('./routes/shopInforoute')(app,sequelize);
require('./routes/shopProductInforoute')(app,sequelize);
require('./routes/stockInforoute')(app,sequelize);
require('./routes/stockProductroute')(app,sequelize);
require('./routes/orderInforoute')(app,sequelize);
require('./routes/orderProductroute')(app,sequelize);
require('./routes/patternInforoute')(app,sequelize);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
//  app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//      message: err.message,
//      error: err
//    });
//  });
//}
//
//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//    message: err.message,
//    error: {}
//  });
//});


module.exports = app;
