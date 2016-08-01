/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(app,sequelize){
    var PatternInfo = sequelize.import('../model/PatternInfo');
    var UUID = require('uuid-js');
    var SqlUtil = require('../util/SqlUtil');
    var sqlUtil = new SqlUtil();
    /**
    * 跳转至商品规格信息表管理页面
    */
    app.get('/goToPatternInfo.do',function(req,res){
        res.render('tpl/patternInfo.html');
    })
    //获取商品规格信息表信息
    app.post('/getPatternInfoByPage.do',function(req,res){
        var whereClause = req.body.whereClause;
        var pageObj = req.body.pageObj;
        PatternInfo.findAndCountAll({limit:pageObj.pageSize,offset:pageObj.firstRow}).then(function(result){
            res.send(result);
        });
    });
    //插入商品规格信息表信息
    app.post('/insPatternInfo.do',function(req,res){
        var patternInfoObj = req.body.patternInfoObj;
        if(patternInfoObj){
            patternInfoObj.patternInfoPkid = UUID.create(4).toString().replace(/\-/g, '');
            PatternInfo.create(patternInfoObj).then(function(patternInfo){
                res.send(patternInfo);
            });
        }else{
            res.json({'error':'参数错误'});
        }
    });
    //更新商品规格信息表信息
    app.post('/updPatternInfo.do',function(req,res){
    var patternInfoObj = req.body.patternInfoObj;
    if(patternInfoObj){
        PatternInfo.update(patternInfoObj,{where:{patternInfoPkid:patternInfoObj.patternInfoPkid}}).then(function(count){
        res.send(patternInfoObj);
    });
    }else{
        res.json({'error':'参数错误'});
    }
    });
    //删除商品规格信息表信息
    app.post('/delPatternInfo.do',function(req,res){
        var patternInfoObj = req.body.patternInfoObj;
        if(patternInfoObj){
            PatternInfo.findOne({where:{pattern_info_pkid:patternInfoObj.patternInfoPkid}}).then(function(patternInfo){
                if(patternInfo!==null){
                    patternInfo.destroy().then(function(){
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
    //根据商品信息表主键ID获取规格列表
    app.post('/getPatternByProductPkid.do',function(req,res){
        var productInfoPkid = req.body.productInfoPkid;
        sequelize.query(
            sqlUtil.getSql('productinfo-0001'),
            {
                replacements: {
                    productInfoPkid: productInfoPkid
                },
                type: sequelize.QueryTypes.SELECT
            }
        ).then(function(result){
                res.send(result);
            })
    })
    //获取所有规格列表
    app.post('/getPatternInfoList.do',function(req,res){
        PatternInfo.findAll().then(function(patternInfo){
            res.send(patternInfo);
        })
    })
}