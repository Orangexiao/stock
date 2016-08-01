/**
 * Created by Orangexiao on 2015/5/13.
 */
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var moment = require('moment');
module.exports = function (app, sequelize, redisClient) {
    var operatorInfo = sequelize.import('../model/OperatorInfo');
    app.post('/login.do', function (req, res, next) {
        operatorInfo
            .findOne({
                where: {
                    operatorCode: req.body.userName
                },
                attributes: {
                    exclude: ['password','salt']
                }
            })
            .then(function (operator) {
                if (operator) {
                    var token = jwt.sign(operator, config.jwtTokenSecret);
                    redisClient.set(operator.operatorInfoPkid, token);
                    redisClient.set(operator.operatorInfoPkid + 'timestamp',new Date().getTime());
                    redisClient.get(operator.operatorInfoPkid + 'timestamp',function(err,responseGet){
                        console.log(responseGet);
                    });
                    res.json({
                        result: 'success',
                        token: token,
                        operator: operator
                    })
                } else {
                    res.json({
                        result: 'error',
                        message: '用户名或密码不正确'
                    });
                }
            })
    })
}