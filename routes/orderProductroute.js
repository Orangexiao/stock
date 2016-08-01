/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(app,sequelize){
    var OrderProduct = sequelize.import('../model/OrderProduct');
    var UUID = require('uuid-js');
    var q = require('q');
    /**
    * 跳转至订单商品信息表管理页面
    */
    app.get('/goToOrderProduct.do',function(req,res){
        res.render('tpl/orderProduct.html');
    })
    //获取订单商品信息表信息
    app.post('/getOrderProductByPage.do',function(req,res){
        var whereClause = req.body.whereClause;
        var pageObj = req.body.pageObj;
        OrderProduct.findAndCountAll({limit:pageObj.pageSize,offset:pageObj.firstRow}).then(function(result){
            res.send(result);
        });
    });
    //插入订单商品信息表信息
    app.post('/insOrderProduct.do',function(req,res){
        var orderProductObj = req.body.orderProductObj;
        if(orderProductObj){
            orderProductObj.orderProductPkid = UUID.create(4).toString().replace(/\-/g, '');
            OrderProduct.create(orderProductObj).then(function(orderProduct){
                res.send(orderProduct);
            });
        }else{
            res.json({'error':'参数错误'});
        }
    });
    //更新订单商品信息表信息
    app.post('/updOrderProduct.do',function(req,res){
    var orderProductObj = req.body.orderProductObj;
    if(orderProductObj){
        OrderProduct.update(orderProductObj,{where:{orderProductPkid:orderProductObj.orderProductPkid}}).then(function(count){
        res.send(orderProductObj);
    });
    }else{
        res.json({'error':'参数错误'});
    }
    });
    //删除订单商品信息表信息
    app.post('/delOrderProduct.do',function(req,res){
        var orderProductObj = req.body.orderProductObj;
        if(orderProductObj){
            OrderProduct.findOne({where:{order_product_pkid:orderProductObj.orderProductPkid}}).then(function(orderProduct){
                if(orderProduct!==null){
                    orderProduct.destroy().then(function(){
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

    app.post('/getOrderProductList.do',function(req,res){
        OrderProduct.findAll().then(function(orderProduct){
            res.send(orderProduct);
        })
    })


}