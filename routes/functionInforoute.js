/**
 * Created by Orangexiao on 2015/5/13.
 */
module.exports = function (app, sequelize) {
    var FunctionInfo = sequelize.import('../model/FunctionInfo');
    var UUID = require('uuid-js');
    var RoleFunction = sequelize.import('../model/RoleFunction');
    var jwt = require('jsonwebtoken');
    var config = require('../config/config');
    var SqlUtil = require('../util/SqlUtil');
    var sqlUtil = new SqlUtil();
    /**
     * 跳转至品牌管理页面
     */
    app.get('/goToFunctionInfo.do', function (req, res) {
        res.render('tpl/functionInfo.html');
    })
    //获取品牌信息
    app.post('/getFunctionInfoByPage.do', function (req, res) {
        var whereClause = req.body.whereClause;
        var pageObj = req.body.pageObj;
        FunctionInfo.findAndCountAll({
            limit: pageObj.pageSize,
            offset: pageObj.firstRow,
            order: 'display_order asc'
        }).then(function (result) {
            res.send(result);
        });
    });
    //插入品牌信息
    app.post('/insFunctionInfo.do', function (req, res) {
        var functionInfoObj = req.body.functionInfoObj;
        if (functionInfoObj) {
            functionInfoObj.functionInfoPkid = UUID.create(4).toString().replace(/\-/g, '');
            FunctionInfo.create(functionInfoObj).then(function (functionInfo) {
                res.send(functionInfo);
            });
        } else {
            res.json({'error': '参数错误'});
        }
    });
    //更新品牌信息
    app.post('/updFunctionInfo.do', function (req, res) {
        var functionInfoObj = req.body.functionInfoObj;
        if (functionInfoObj) {
            FunctionInfo.update(functionInfoObj, {where: {functionInfoPkid: functionInfoObj.functionInfoPkid}}).then(function (count) {
                res.send(functionInfoObj);
            });
        } else {
            res.json({'error': '参数错误'});
        }
    });
    //删除品牌信息
    app.post('/delFunctionInfo.do', function (req, res) {
        var functionInfoObj = req.body.functionInfoObj;
        if (functionInfoObj) {
            FunctionInfo.findOne({where: {function_info_pkid: functionInfoObj.functionInfoPkid}}).then(function (functionInfo) {
                if (functionInfo !== null) {
                    functionInfo.destroy().then(function () {
                        res.json({'result': true});
                    })
                } else {
                    res.json({'error': '该数据已被删除'});
                }
            });
        } else {
            res.json({'error': '参数错误'});
        }
    });

    app.post('/getFunctionInfoList.do', function (req, res) {
        FunctionInfo.findAll().then(function (functionInfo) {
            res.send(functionInfo);
        })
    })

    app.post('/getAvailFunctions.do', function (req, res) {
        var token = req.headers.token;
        var operatorInfo = jwt.verify(token, config.jwtTokenSecret);
        sequelize.query(
            sqlUtil.getSql('0001'),
            {
                type:sequelize.QueryTypes.SELECT,
                replacements :[
                    operatorInfo.operatorInfoPkid
                ]
            })
            .then(function(result){
                res.send(result);
            });
    })
}