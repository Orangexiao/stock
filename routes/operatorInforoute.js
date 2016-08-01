/**
 * Created by Orangexiao on 2015/5/13.
 */
module.exports = function (app, sequelize) {
    var OperatorInfo = sequelize.import('../model/OperatorInfo');
    var RoleInfo = sequelize.import('../model/RoleInfo');
    var OperatorRole = sequelize.import('../model/OperatorRole');
    var UUID = require('uuid-js');
    var q = require('q');
    OperatorInfo.belongsToMany(RoleInfo, {
        through: OperatorRole,
        foreignKey: 'operator_info_pkid',
        targetKey: 'operator_info_pkid'
    });
    RoleInfo.belongsToMany(OperatorInfo, {
        through: OperatorRole,
        foreignKey: 'role_info_pkid',
        targetKey: 'role_info_pkid'
    });
    /**
     * 跳转至品牌管理页面
     */
    app.get('/goToOperatorInfo.do', function (req, res) {
        res.render('tpl/operatorInfo.html');
    })

    app.post('/queryOpByOpt.do', function (req, res) {
        var whereClause = req.body.whereClause;
        console.log(whereClause);
        var pageObj = req.body.pageObj;
        console.log(whereClause);
        OperatorInfo.findAndCountAll({
            where: {
                $or: [
                    {
                        operator_code: {
                            $like: '%' + whereClause[0].content + '%'
                        }
                    },
                    {
                        operator_name: {
                            $like: '%' + whereClause[0].content + '%'
                        }
                    },
                    {
                        operator_phone: {
                            $like: '%' + whereClause[0].content + '%'
                        }
                    }
                ]

            },
            order: [
                ['operator_code', 'desc']
            ],
            limit: pageObj.pageSize,
            offset: pageObj.firstRow
        }).then(function (result) {
            res.send(result);
        }).catch(function (err) {
            console.log(err);
            throw Error('数据库异常')
        });
    })
    //获取品牌信息
    app.post('/getOperatorInfoByPage.do', function (req, res) {
        var whereClause = req.body.whereClause;
        var pageObj = req.body.pageObj;
        OperatorInfo.findAndCountAll({
            order: [
                ['operator_code', 'desc']
            ],
            limit: pageObj.pageSize,
            offset: pageObj.firstRow
        }).then(function (result) {
            res.send(result);
        });
    });
    //插入品牌信息
    app.post('/insOperatorInfo.do', function (req, res) {
        var operatorInfoObj = req.body.operatorInfoObj;
        console.log(operatorInfoObj);
        if (operatorInfoObj) {
            insOperatorInfo(operatorInfoObj).then(function () {
                OperatorInfo.findOne({where: {operator_info_pkid: operatorInfoObj.operatorInfoPkid}})
                    .then(function (operatorInfo) {
                        return res.send(operatorInfo);
                    })
            }).catch(function (err) {
                console.log(err);
                res.send({
                    'result': 'error',
                    'errorMessage': '数据插入异常，请与管理员联系'
                });
            });
        } else {
            res.json({'error': '参数错误'});
        }
    });
    //更新品牌信息
    app.post('/updOperatorInfo.do', function (req, res) {
        var operatorInfoObj = req.body.operatorInfoObj;
        if (operatorInfoObj) {
            updateOperatorInfo(operatorInfoObj).then(function () {
                OperatorInfo.findOne({where: {operator_info_pkid: operatorInfoObj.operatorInfoPkid}})
                    .then(function (operatorInfo) {
                        res.send(operatorInfo)
                    })
            }).catch(function (err) {
                console.log(err);
                res.send({
                    'result': 'error',
                    'errorMessage': '数据插入异常，请与管理员联系'
                });
            })
        } else {
            res.json({'error': '参数错误'});
        }
    });
    //删除员工信息
    app.post('/delOperatorInfo.do', function (req, res) {
        var operatorInfoObj = req.body.operatorInfoObj;
        if (operatorInfoObj) {
            delOperator(operatorInfoObj).then(function(){
                res.json({
                    result : 'success',
                    message : '删除成功'
                })
            }).catch(function(err){
                console.log(err);
                res.status(500);
                res.send({
                    result : 'error',
                    errorMessage : '数据删除异常，请与管理员联系'
                })
            });
        } else {
            res.json({'error': '参数错误'});
        }
    });

    app.post('/getOperatorInfoList.do', function (req, res) {
        OperatorInfo.findAll().then(function (operatorInfo) {
            res.send(operatorInfo);
        })
    })

    app.post('/getOperatorInfoById.do', function (req, res) {
        var operatorInfoPkid = req.body.operatorInfoPkid;
        OperatorInfo.findOne({where: {operator_info_pkid: operatorInfoPkid}, include: [{model: RoleInfo}]})
            .then(function (operatorInfo) {
                res.send(operatorInfo);
            })
    })

    function insOperatorInfo(operatorInfoObj) {
        return sequelize.transaction(
            function (t) {
                operatorInfoObj.operatorInfoPkid = UUID.create(4).toString().replace(/\-/g, '');
                return OperatorInfo.create(operatorInfoObj, {transaction: t})
                    .then(function (operatorInfo) {
                            return q.all(operatorInfoObj.operatorRoleList.map(function (ele) {
                                return OperatorRole.create({
                                    roleOperatorPkid: UUID.create(4).toString().replace(/\-/g, ''),
                                    operatorInfoPkid: operatorInfoObj.operatorInfoPkid,
                                    roleInfoPkid: ele
                                }, {transaction: t})
                            }))
                    })
            })

    }

    function updateOperatorInfo(operatorInfoObj) {
        return sequelize.transaction(
            function (t) {
                return OperatorInfo.update(
                    operatorInfoObj,
                    {
                        where: {
                            operator_info_pkid: operatorInfoObj.operatorInfoPkid
                        }
                    })
                    .then(function () {
                        return OperatorRole.destroy({
                            where: {operator_info_pkid: operatorInfoObj.operatorInfoPkid},
                            transaction: t
                        })
                    })
                    .then(function () {
                        return q.all(operatorInfoObj.operatorRoleList.map(function (ele) {
                            return OperatorRole.create({
                                roleOperatorPkid: UUID.create(4).toString().replace(/\-/g, ''),
                                operatorInfoPkid: operatorInfoObj.operatorInfoPkid,
                                roleInfoPkid: ele
                            }, {transaction: t})
                        }))
                    })
            }
        )
    }

    function delOperator(operatorInfoObj){
        return sequelize.transaction(
            function(t){
                return OperatorRole.destroy({
                    where : {
                        operator_info_pkid : operatorInfoObj.operatorInfoPkid
                    },transaction : t
                }).then(function(){
                    return OperatorInfo.destroy({
                        where : {
                            operator_info_pkid : operatorInfoObj.operatorInfoPkid
                        },transaction : t
                    })
                })

            }
        )
    }

}