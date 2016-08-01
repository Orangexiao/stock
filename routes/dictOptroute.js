/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(app,sequelize){
    var DictOpt = sequelize.import('../model/DictOpt');
    var UUID = require('uuid-js');
    /**
    * 跳转至品牌管理页面
    */
    app.get('/goToDictOpt.do',function(req,res){
        res.render('tpl/dictOpt.html');
    })
    //获取品牌信息
    app.post('/getDictOptByPage.do',function(req,res){
        var whereClause = req.body.whereClause;
        var pageObj = req.body.pageObj;
        DictOpt.findAndCountAll({limit:pageObj.pageSize,offset:pageObj.firstRow}).then(function(result){
            res.send(result);
        });
    });
    //插入品牌信息
    app.post('/insDictOpt.do',function(req,res){
        var dictOptObj = req.body.dictOptObj;
        if(dictOptObj){
            dictOptObj.dictOptPkid = UUID.create(4).toString().replace(/\-/g, '');
            DictOpt.create(dictOptObj).then(function(dictOpt){
                res.send(dictOpt);
            });
        }else{
            res.json({'error':'参数错误'});
        }
    });
    //更新品牌信息
    app.post('/updDictOpt.do',function(req,res){
    var dictOptObj = req.body.dictOptObj;
    if(dictOptObj){
        DictOpt.update(dictOptObj,{where:{dictOptPkid:dictOptObj.dictOptPkid}}).then(function(count){
        res.send(dictOptObj);
    });
    }else{
        res.json({'error':'参数错误'});
    }
    });
    //删除品牌信息
    app.post('/delDictOpt.do',function(req,res){
        var dictOptObj = req.body.dictOptObj;
        if(dictOptObj){
            DictOpt.findOne({where:{dict_opt_pkid:dictOptObj.dictOptPkid}}).then(function(dictOpt){
                if(dictOpt!==null){
                    dictOpt.destroy().then(function(){
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

    app.post('/getDictOptList.do',function(req,res){
        DictOpt.findAll().then(function(dictOpt){
            res.send(dictOpt);
        })
    })
}