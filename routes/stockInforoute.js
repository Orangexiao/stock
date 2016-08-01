/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(app,sequelize){
    var StockInfo = sequelize.import('../model/StockInfo');
    var UUID = require('uuid-js');
    /**
    * 跳转至进货信息表管理页面
    */
    app.get('/goToStockInfo.do',function(req,res){
        res.render('tpl/stockInfo.html');
    })
    //获取进货信息表信息
    app.post('/getStockInfoByPage.do',function(req,res){
        var whereClause = req.body.whereClause;
        var pageObj = req.body.pageObj;
        StockInfo.findAndCountAll({limit:pageObj.pageSize,offset:pageObj.firstRow}).then(function(result){
            res.send(result);
        });
    });
    //插入进货信息表信息
    app.post('/insStockInfo.do',function(req,res){
        var stockInfoObj = req.body.stockInfoObj;
        if(stockInfoObj){
            stockInfoObj.stockInfoPkid = UUID.create(4).toString().replace(/\-/g, '');
            StockInfo.create(stockInfoObj).then(function(stockInfo){
                res.send(stockInfo);
            });
        }else{
            res.json({'error':'参数错误'});
        }
    });
    //更新进货信息表信息
    app.post('/updStockInfo.do',function(req,res){
    var stockInfoObj = req.body.stockInfoObj;
    if(stockInfoObj){
        StockInfo.update(stockInfoObj,{where:{stockInfoPkid:stockInfoObj.stockInfoPkid}}).then(function(count){
        res.send(stockInfoObj);
    });
    }else{
        res.json({'error':'参数错误'});
    }
    });
    //删除进货信息表信息
    app.post('/delStockInfo.do',function(req,res){
        var stockInfoObj = req.body.stockInfoObj;
        if(stockInfoObj){
            StockInfo.findOne({where:{stock_info_pkid:stockInfoObj.stockInfoPkid}}).then(function(stockInfo){
                if(stockInfo!==null){
                    stockInfo.destroy().then(function(){
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

    app.post('/getStockInfoList.do',function(req,res){
        StockInfo.findAll().then(function(stockInfo){
            res.send(stockInfo);
        })
    })
}