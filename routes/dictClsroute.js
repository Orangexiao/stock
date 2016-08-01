/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(app,sequelize){
    var DictCls = sequelize.import('../model/DictCls');
    var DictOpt = sequelize.import('../model/DictOpt');
    DictCls.hasMany(DictOpt,{foreignKey:'dict_cls_pkid'});
    var UUID = require('uuid-js');
    /**
    * 跳转至品牌管理页面
    */
    app.get('/goToDictCls.do',function(req,res){
        res.render('tpl/dictCls.html');
    })

    app.post('/getDictClsByPage.do',function(req,res){
        var whereClause = req.body.whereClause;
        var pageObj = req.body.pageObj;
        DictCls.findAndCountAll({limit:pageObj.pageSize,offset:pageObj.firstRow}).then(function(result){
            res.send(result);
        });
    });

    app.post('/getOptsByClsCode.do',function(req,res){
        var clsCode = req.body.clsCode;
        DictCls.findAll({where:{dict_cls_code : clsCode},include:[{model:DictOpt}]})
            .then(function(result){
                res.send(result);
            })
    })
    //插入品牌信息
    app.post('/insDictCls.do',function(req,res){
        var dictClsObj = req.body.dictClsObj;
        if(dictClsObj){
            dictClsObj.dictClsPkid = UUID.create(4).toString().replace(/\-/g, '');
            DictCls.create(dictClsObj).then(function(dictCls){
                res.send(dictCls);
            });
        }else{
            res.json({'error':'参数错误'});
        }
    });
    //更新品牌信息
    app.post('/updDictCls.do',function(req,res){
    var dictClsObj = req.body.dictClsObj;
    if(dictClsObj){
        DictCls.update(dictClsObj,{where:{dictClsPkid:dictClsObj.dictClsPkid}}).then(function(count){
        res.send(dictClsObj);
    });
    }else{
        res.json({'error':'参数错误'});
    }
    });
    //删除品牌信息
    app.post('/delDictCls.do',function(req,res){
        var dictClsObj = req.body.dictClsObj;
        if(dictClsObj){
            DictCls.findOne({where:{dict_cls_pkid:dictClsObj.dictClsPkid}}).then(function(dictCls){
                if(dictCls!==null){
                    dictCls.destroy().then(function(){
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

    app.post('/getDictClsList.do',function(req,res){
        DictCls.findAll().then(function(dictCls){
            res.send(dictCls);
        })
    })
}