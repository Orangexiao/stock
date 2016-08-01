/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(app,sequelize){
    var StockProduct = sequelize.import('../model/StockProduct');
    var UUID = require('uuid-js');
    /**
    * 跳转至进货商品信息表管理页面
    */
    app.get('/goToStockProduct.do',function(req,res){
        res.render('tpl/stockProduct.html');
    })
    //获取进货商品信息表信息
    app.post('/getStockProductByPage.do',function(req,res){
        var whereClause = req.body.whereClause;
        var pageObj = req.body.pageObj;
        StockProduct.findAndCountAll({limit:pageObj.pageSize,offset:pageObj.firstRow}).then(function(result){
            res.send(result);
        });
    });
    //插入进货商品信息表信息
    app.post('/insStockProduct.do',function(req,res){
        var stockProductObj = req.body.stockProductObj;
        if(stockProductObj){
            stockProductObj.stockProductPkid = UUID.create(4).toString().replace(/\-/g, '');
            StockProduct.create(stockProductObj).then(function(stockProduct){
                res.send(stockProduct);
            });
        }else{
            res.json({'error':'参数错误'});
        }
    });
    //更新进货商品信息表信息
    app.post('/updStockProduct.do',function(req,res){
    var stockProductObj = req.body.stockProductObj;
    if(stockProductObj){
        StockProduct.update(stockProductObj,{where:{stockProductPkid:stockProductObj.stockProductPkid}}).then(function(count){
        res.send(stockProductObj);
    });
    }else{
        res.json({'error':'参数错误'});
    }
    });
    //删除进货商品信息表信息
    app.post('/delStockProduct.do',function(req,res){
        var stockProductObj = req.body.stockProductObj;
        if(stockProductObj){
            StockProduct.findOne({where:{stock_product_pkid:stockProductObj.stockProductPkid}}).then(function(stockProduct){
                if(stockProduct!==null){
                    stockProduct.destroy().then(function(){
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

    app.post('/getStockProductList.do',function(req,res){
        StockProduct.findAll().then(function(stockProduct){
            res.send(stockProduct);
        })
    })
}