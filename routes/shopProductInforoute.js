/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(app,sequelize){
    var ShopProductInfo = sequelize.import('../model/ShopProductInfo');
    var UUID = require('uuid-js');
    /**
    * 跳转至店铺商品信息表管理页面
    */
    app.get('/goToShopProductInfo.do',function(req,res){
        res.render('tpl/shopProductInfo.html');
    })
    //获取店铺商品信息表信息
    app.post('/getShopProductInfoByPage.do',function(req,res){
        var whereClause = req.body.whereClause;
        var pageObj = req.body.pageObj;
        ShopProductInfo.findAndCountAll({limit:pageObj.pageSize,offset:pageObj.firstRow}).then(function(result){
            res.send(result);
        });
    });
    //插入店铺商品信息表信息
    app.post('/insShopProductInfo.do',function(req,res){
        var shopProductInfoObj = req.body.shopProductInfoObj;
        if(shopProductInfoObj){
            shopProductInfoObj.shopProductInfoPkid = UUID.create(4).toString().replace(/\-/g, '');
            ShopProductInfo.create(shopProductInfoObj).then(function(shopProductInfo){
                res.send(shopProductInfo);
            });
        }else{
            res.json({'error':'参数错误'});
        }
    });
    //更新店铺商品信息表信息
    app.post('/updShopProductInfo.do',function(req,res){
    var shopProductInfoObj = req.body.shopProductInfoObj;
    if(shopProductInfoObj){
        ShopProductInfo.update(shopProductInfoObj,{where:{shopProductInfoPkid:shopProductInfoObj.shopProductInfoPkid}}).then(function(count){
        res.send(shopProductInfoObj);
    });
    }else{
        res.json({'error':'参数错误'});
    }
    });
    //删除店铺商品信息表信息
    app.post('/delShopProductInfo.do',function(req,res){
        var shopProductInfoObj = req.body.shopProductInfoObj;
        if(shopProductInfoObj){
            ShopProductInfo.findOne({where:{shop_product_info_pkid:shopProductInfoObj.shopProductInfoPkid}}).then(function(shopProductInfo){
                if(shopProductInfo!==null){
                    shopProductInfo.destroy().then(function(){
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

    app.post('/getShopProductInfoList.do',function(req,res){
        ShopProductInfo.findAll().then(function(shopProductInfo){
            res.send(shopProductInfo);
        })
    })
}