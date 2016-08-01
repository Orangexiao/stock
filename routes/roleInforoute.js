/**
 * Created by Orangexiao on 2015/5/13.
 */
module.exports = function (app, sequelize) {
    var RoleInfo = sequelize.import('../model/RoleInfo');
    var RoleFunction = sequelize.import('../model/RoleFunction');
    var FunctionInfo = sequelize.import('../model/FunctionInfo');
    var UUID = require('uuid-js');
    var q = require('q');
    RoleInfo.belongsToMany(FunctionInfo, {
        through: RoleFunction,
        foreignKey: 'role_info_pkid',
        targetKey: 'role_info_pkid'
    });

    FunctionInfo.belongsToMany(RoleInfo, {
        through: RoleFunction,
        foreignKey: 'function_info_pkid',
        targetKey: 'function_info_pkid'
    });
    /**
     * 跳转至品牌管理页面
     */
    app.get('/goToRoleInfo.do', function (req, res) {
        res.render('tpl/roleInfo.html');
    })
    //获取品牌信息
    app.post('/getRoleInfoByPage.do', function (req, res) {
        var whereClause = req.body.whereClause;
        var pageObj = req.body.pageObj;
        RoleInfo.findAndCountAll({
            limit: pageObj.pageSize,
            offset: pageObj.firstRow,
            include: [{model: FunctionInfo}]
        }).then(function (result) {
            res.send(result);
        }).catch(function (err) {
            console.log(err);
            res.send({
                'result': 'error',
                'errorMessage': '数据库异常，请联系管理员！'
            })
        });
    });
    //插入品牌信息
    app.post('/insRoleInfo.do', function (req, res) {
        var roleInfoObj = req.body.roleInfoObj;
        if (roleInfoObj) {
            roleInfoObj.roleInfoPkid = UUID.create(4).toString().replace(/\-/g, '');
            RoleInfo.create(roleInfoObj).then(function (roleInfo) {
                var funcList = roleInfoObj.functionList;
                return q.all(
                    funcList.map(function (ele) {
                        var roleFuncObj = {
                            roleFunctionPkid: UUID.create(4).toString().replace(/\-/g, ''),
                            roleInfoPkid: roleInfo.roleInfoPkid,
                            functionInfoPkid: ele.functionInfoPkid
                        }
                        return RoleFunction.create(roleFuncObj)
                    }))
            }).then(function (data) {
                return RoleInfo.findOne({
                    where: {role_info_pkid: roleInfoObj.roleInfoPkid},
                    include: [{model: FunctionInfo}]
                })
            }).then(function (roleInfo) {
                res.send(roleInfo);
            }).catch(function (err) {
                console.log(err);
                res.send({
                    'result': 'error',
                    'errorMessage': '数据库异常，请与管理员联系！'
                });
            })
        } else {
            res.json({'error': '参数错误'});
        }
    });


    //更新品牌信息
    app.post('/updRoleInfo.do', function (req, res) {
        var roleInfoObj = req.body.roleInfoObj;
        if (roleInfoObj) {
            updateRoleInfo(roleInfoObj)
                .then(function () {
                    RoleInfo
                        .findOne({
                            where: {role_info_pkid: roleInfoObj.roleInfoPkid}
                        })
                        .then(function (roleInfo) {
                            res.send(roleInfo);
                        }).catch(function (err) {
                            console.log(err);
                            throw err;
                        })
                })
        } else {
            res.json({'error': '参数错误'});
        }
    });
    //删除品牌信息
    app.post('/delRoleInfo.do', function (req, res) {
        var roleInfoObj = req.body.roleInfoObj;
        if (roleInfoObj) {
            delRoleInfo(roleInfoObj).then(function () {
                res.send({
                    result: 'success',
                    message: '删除成功'
                })
            }).catch(function (err) {
                console.log(err);
                res.send({
                    result: 'error',
                    errorMessage: '数据删除异常，请与管理员联系'
                });
            })
        } else {
            res.json({'error': '参数错误'});
        }
    });

    app.post('/getRoleInfoList.do', function (req, res) {
        RoleInfo.findAll().then(function (roleInfo) {
            res.send(roleInfo);
        })
    })

    app.post('/queryByRoleId.do', function (req, res) {
        var roleInfoPkid = req.body.roleInfoPkid;
        RoleInfo.findOne({
            where: {role_info_pkid: roleInfoPkid},
            include: [{model: FunctionInfo}]
        }).then(function (roleInfo) {
            res.send(roleInfo);
        }).catch(function (err) {
            console.log(err);
            throw err;
        })
    })

    function updateRoleInfo(roleInfoObj) {
        return sequelize.transaction(
            function (t) {
                return RoleInfo
                    .update(roleInfoObj,
                    {
                        where: {
                            role_info_pkid: roleInfoObj.roleInfoPkid
                        }
                        , transaction: t
                    }).then(function () {
                        //删除关联表中对应角色的数据
                        return RoleFunction.destroy({where: {role_info_pkid: roleInfoObj.roleInfoPkid}, transaction: t})
                    }).then(function () {
                        return q.all(roleInfoObj.functionList.map(function (ele) {
                            return RoleFunction.create({
                                roleFunctionPkid: UUID.create(4).toString().replace(/\-/g, ''),
                                roleInfoPkid: roleInfoObj.roleInfoPkid,
                                functionInfoPkid: ele
                            }, {transaction: t})
                        }))
                    })
            })
    }

    function delRoleInfo(roleInfoObj) {
        return sequelize.transaction(
            function (t) {
                return RoleFunction.destroy({
                    where: {
                        role_info_pkid: roleInfoObj.roleInfoPkid
                    }, transaction: t
                }).then(function () {
                    return RoleInfo.destroy({
                        where: {
                            role_info_pkid: roleInfoObj.roleInfoPkid
                        },
                        transaction: t
                    })
                })
            }
        )
    }
}