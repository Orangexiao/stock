/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(app,sequelize){
    var RoleFunction = sequelize.import('../model/RoleFunction');
    var UUID = require('uuid-js');
    /**
    * 跳转至角色功能对应表管理页面
    */
    app.get('/goToRoleFunction.do',function(req,res){
        res.render('tpl/roleFunction.html');
    })
    //获取角色功能对应表信息
    app.post('/getRoleFunctionByPage.do',function(req,res){
        var whereClause = req.body.whereClause;
        var pageObj = req.body.pageObj;
        RoleFunction.findAndCountAll({limit:pageObj.pageSize,offset:pageObj.firstRow}).then(function(result){
            res.send(result);
        });
    });
    //插入角色功能对应表信息
    app.post('/insRoleFunction.do',function(req,res){
        var roleFunctionObj = req.body.roleFunctionObj;
        if(roleFunctionObj){
            roleFunctionObj.roleFunctionPkid = UUID.create(4).toString().replace(/\-/g, '');
            RoleFunction.create(roleFunctionObj).then(function(roleFunction){
                res.send(roleFunction);
            });
        }else{
            res.json({'error':'参数错误'});
        }
    });
    //更新角色功能对应表信息
    app.post('/updRoleFunction.do',function(req,res){
    var roleFunctionObj = req.body.roleFunctionObj;
    if(roleFunctionObj){
        RoleFunction.update(roleFunctionObj,{where:{roleFunctionPkid:roleFunctionObj.roleFunctionPkid}}).then(function(count){
        res.send(roleFunctionObj);
    });
    }else{
        res.json({'error':'参数错误'});
    }
    });
    //删除角色功能对应表信息
    app.post('/delRoleFunction.do',function(req,res){
        var roleFunctionObj = req.body.roleFunctionObj;
        if(roleFunctionObj){
            RoleFunction.findOne({where:{role_function_pkid:roleFunctionObj.roleFunctionPkid}}).then(function(roleFunction){
                if(roleFunction!==null){
                    roleFunction.destroy().then(function(){
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

    app.post('/getRoleFunctionList.do',function(req,res){
        RoleFunction.findAll().then(function(roleFunction){
            res.send(roleFunction);
        })
    })
}