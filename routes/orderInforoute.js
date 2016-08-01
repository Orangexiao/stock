/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(app,sequelize){
    var OrderInfo = sequelize.import('../model/OrderInfo');
    var UUID = require('uuid-js');
    /**
    * 跳转至订单信息表管理页面
    */
    app.get('/goToOrderInfo.do',function(req,res){
        res.render('tpl/orderInfo.html');
    })
    //获取订单信息表信息
    app.post('/getOrderInfoByPage.do',function(req,res){
        var whereClause = req.body.whereClause;
        var pageObj = req.body.pageObj;
        OrderInfo.findAndCountAll({limit:pageObj.pageSize,offset:pageObj.firstRow}).then(function(result){
            res.send(result);
        });
    });
    //插入订单信息表信息
    app.post('/insOrderInfo.do',function(req,res){
        var orderInfoObj = req.body.orderInfoObj;
        if(orderInfoObj){
            orderInfoObj.orderInfoPkid = UUID.create(4).toString().replace(/\-/g, '');
            OrderInfo.create(orderInfoObj).then(function(orderInfo){
                res.send(orderInfo);
            });
        }else{
            res.json({'error':'参数错误'});
        }
    });
    //更新订单信息表信息
    app.post('/updOrderInfo.do',function(req,res){
    var orderInfoObj = req.body.orderInfoObj;
    if(orderInfoObj){
        OrderInfo.update(orderInfoObj,{where:{orderInfoPkid:orderInfoObj.orderInfoPkid}}).then(function(count){
        res.send(orderInfoObj);
    });
    }else{
        res.json({'error':'参数错误'});
    }
    });
    //删除订单信息表信息
    app.post('/delOrderInfo.do',function(req,res){
        var orderInfoObj = req.body.orderInfoObj;
        if(orderInfoObj){
            OrderInfo.findOne({where:{order_info_pkid:orderInfoObj.orderInfoPkid}}).then(function(orderInfo){
                if(orderInfo!==null){
                    orderInfo.destroy().then(function(){
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

    app.post('/getOrderInfoList.do',function(req,res){
        OrderInfo.findAll().then(function(orderInfo){
            res.send(orderInfo);
        })
    })
}