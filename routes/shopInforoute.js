/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(app,sequelize){
    var ShopInfo = sequelize.import('../model/ShopInfo');
    var UUID = require('uuid-js');
    /**
    * 跳转至店铺信息表管理页面
    */
    app.get('/goToShopInfo.do',function(req,res){
        res.render('tpl/shopInfo.html');
    })
    //获取店铺信息表信息
    app.post('/getShopInfoByPage.do',function(req,res){
        var whereClause = req.body.whereClause;
        var pageObj = req.body.pageObj;
        ShopInfo.findAndCountAll({limit:pageObj.pageSize,offset:pageObj.firstRow}).then(function(result){
            res.send(result);
        });
    });
    //插入店铺信息表信息
    app.post('/insShopInfo.do',function(req,res){
        var shopInfoObj = req.body.shopInfoObj;
        if(shopInfoObj){
            shopInfoObj.shopInfoPkid = UUID.create(4).toString().replace(/\-/g, '');
            ShopInfo.create(shopInfoObj).then(function(shopInfo){
                res.send(shopInfo);
            });
        }else{
            res.json({'error':'参数错误'});
        }
    });
    //更新店铺信息表信息
    app.post('/updShopInfo.do',function(req,res){
    var shopInfoObj = req.body.shopInfoObj;
    if(shopInfoObj){
        ShopInfo.update(shopInfoObj,{where:{shopInfoPkid:shopInfoObj.shopInfoPkid}}).then(function(count){
        res.send(shopInfoObj);
    });
    }else{
        res.json({'error':'参数错误'});
    }
    });
    //删除店铺信息表信息
    app.post('/delShopInfo.do',function(req,res){
        var shopInfoObj = req.body.shopInfoObj;
        if(shopInfoObj){
            ShopInfo.findOne({where:{shop_info_pkid:shopInfoObj.shopInfoPkid}}).then(function(shopInfo){
                if(shopInfo!==null){
                    shopInfo.destroy().then(function(){
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

    app.post('/getShopInfoList.do',function(req,res){
        ShopInfo.findAll().then(function(shopInfo){
            res.send(shopInfo);
        })
    })
}