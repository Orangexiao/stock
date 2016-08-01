/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(app,sequelize){
    var OperatorRole = sequelize.import('../model/OperatorRole');
    var UUID = require('uuid-js');
    /**
    * 跳转至管理员角色对应表管理页面
    */
    app.get('/goToOperatorRole.do',function(req,res){
        res.render('tpl/operatorRole.html');
    })
    //获取管理员角色对应表信息
    app.post('/getOperatorRoleByPage.do',function(req,res){
        var whereClause = req.body.whereClause;
        var pageObj = req.body.pageObj;
        OperatorRole.findAndCountAll({limit:pageObj.pageSize,offset:pageObj.firstRow}).then(function(result){
            res.send(result);
        });
    });
    //插入管理员角色对应表信息
    app.post('/insOperatorRole.do',function(req,res){
        var operatorRoleObj = req.body.operatorRoleObj;
        if(operatorRoleObj){
            operatorRoleObj.operatorRolePkid = UUID.create(4).toString().replace(/\-/g, '');
            OperatorRole.create(operatorRoleObj).then(function(operatorRole){
                res.send(operatorRole);
            });
        }else{
            res.json({'error':'参数错误'});
        }
    });
    //更新管理员角色对应表信息
    app.post('/updOperatorRole.do',function(req,res){
    var operatorRoleObj = req.body.operatorRoleObj;
    if(operatorRoleObj){
        OperatorRole.update(operatorRoleObj,{where:{operatorRolePkid:operatorRoleObj.operatorRolePkid}}).then(function(count){
        res.send(operatorRoleObj);
    });
    }else{
        res.json({'error':'参数错误'});
    }
    });
    //删除管理员角色对应表信息
    app.post('/delOperatorRole.do',function(req,res){
        var operatorRoleObj = req.body.operatorRoleObj;
        if(operatorRoleObj){
            OperatorRole.findOne({where:{operator_role_pkid:operatorRoleObj.operatorRolePkid}}).then(function(operatorRole){
                if(operatorRole!==null){
                    operatorRole.destroy().then(function(){
                        res.json({'result':true});
                    })
                }else{
                    res.json({'error':'该数据已被删除'});
                 }
            });
        }else{
            res.json({'error':'参数错误'});
        }
    });

    app.post('/getOperatorRoleList.do',function(req,res){
        OperatorRole.findAll().then(function(operatorRole){
            res.send(operatorRole);
        })
    })
}