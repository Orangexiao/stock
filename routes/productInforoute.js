/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(app,sequelize){
    var ProductInfo = sequelize.import('../model/ProductInfo');
    var UUID = require('uuid-js');
    var q = require('q');
    var superAgent = require('superagent-charset');
    var cheerio = require('cheerio');
    var QueryUtil = require('../util/QueryUtil')
    var queryUtil = new QueryUtil(sequelize);
    var SqlUtil = require('../util/SqlUtil');
    var sqlUtil = new SqlUtil();
    var PatternInfo = sequelize.import('../model/PatternInfo');
    /**
    * 跳转至商品信息表管理页面
    */
    app.get('/goToProductInfo.do',function(req,res){
        res.render('tpl/productInfo.html');
    })
    //获取商品信息表信息
    app.post('/getProductInfoByPage.do',function(req,res){
        var whereClause = '%' + (req.body.whereClause||'') + '%';
        var pageObj = req.body.pageObj;
        //ProductInfo.findAndCountAll({limit:pageObj.pageSize,offset:pageObj.firstRow}).then(function(result){
        //    res.send(result);
        //});
        queryUtil.queryByPage
        (
            sqlUtil.getSql(0002),
            {
                replacements:
                {
                    keyword: whereClause,
                    limit:pageObj.pageSize,
                    offset:pageObj.firstRow
                },
                type: sequelize.QueryTypes.SELECT
            }
        ).then(function(result){
                res.send(result);
            })
    });
    /**
     * 插入新商品
     */
    app.post('/insProductInfo.do',function(req,res){
        var productInfoObj = req.body.productInfoObj;
        console.log(productInfoObj);
        if(productInfoObj){
            productInfoObj.productInfoPkid = UUID.create(4).toString().replace(/\-/g, '');
            ProductInfo.create(productInfoObj).then(function(productInfo){
                res.send(productInfo);
            });
        }else{
            res.json({'error':'参数错误'});
        }
    });
    //更新商品信息表信息
    app.post('/updProductInfo.do',function(req,res){
    var productInfoObj = req.body.productInfoObj;
    if(productInfoObj){
        ProductInfo.update(productInfoObj,{where:{productInfoPkid:productInfoObj.productInfoPkid}}).then(function(count){
        res.send(productInfoObj);
    });
    }else{
        res.json({'error':'参数错误'});
    }
    });
    //删除商品信息表信息
    app.post('/delProductInfo.do',function(req,res){
        var productInfoObj = req.body.productInfoObj;
        //if(productInfoObj){
        //    ProductInfo.findOne({where:{product_info_pkid:productInfoObj.productInfoPkid}}).then(function(productInfo){
        //        if(productInfo!==null){
        //            productInfo.destroy().then(function(){
        //                res.json({'result':true});
        //            })
        //        }else{
        //            res.json({'error':'该数据已被删除'});
        //         }
        //    });
        //}else{
        //    res.json({'error':'参数错误'});
        //}
        return sequelize.transaction(function(t){
            return sequelize.query(sqlUtil.getSql('productinfo-0002'),{
                replacements : {
                    productInfoPkid : productInfoObj.productInfoPkid
                },
                type : sequelize.QueryTypes.DELETE,
                transaction : t
            }).then(function(){
                return sequelize.query(sqlUtil.getSql('productinfo-0003'),{
                    replacements : {
                        productInfoPkid : productInfoObj.productInfoPkid
                    },
                    type : sequelize.QueryTypes.DELETE,
                    transaction : t
                })
            }).then(function(){
                res.json({'result' : true});
            }).catch(function(err){
                res.json({
                    result : 'error',
                    errorMessage : '删除失败'
                });
            })
        })
    });
    //获取商品列表
    app.post('/getProductInfoList.do',function(req,res){
        ProductInfo.findAll().then(function(productInfo){
            res.send(productInfo);
        })
    });
    //导入商品
    app.post('/importProduct.do',function(req,res){
        var platformCode = req.body.platformCode;
        var url = req.body.url;
        processProduct(url).then(function(productObj){
            res.send(productObj);
        }).catch(function(error){
            res.json({
                result : 'error',
                errorMessage : '获取页面信息失败'
            });
        })
    });

    app.post('/procProduct.do',function(req,res){
        var productInfoObj = req.body.productInfoObj;
        var operator = productInfoObj.operator;
        var patternList = productInfoObj.patternInfoList;
        return sequelize.transaction(function(t){
            return processProductInfo(productInfoObj,t).then(function(productInfo){
                return processPatternList(patternList,t,productInfo);
            }).then(function(){})
        })
        //    .catch(function(e){
        //    res.json({
        //        result : 'error',
        //        errorMessage : '后台异常'
        //    })
        //});
    });
    /**
     * 处理商品信息
     */
    function processProductInfo(productInfoObj,t){
        //新规
        if(productInfoObj.operator==='1'){
            productInfoObj.productInfoPkid = UUID.create(4).toString().replace(/\-/g, '');
            ProductInfo.create(productInfoObj,{transaction:t});
        }else{
            ProductInfo.update(productInfoObj,{where:{productInfoPkid : productInfoObj.productInfoObj.productInfoPkid}})
        }
        return q.fcall(function(){
            return productInfoObj;
        })
    }

    function processPatternList(patternList,t,productInfo){
        console.log(productInfo);
        if(patternList){
            return q.all(patternList.map(function(patternObj){
                return processPattern(patternObj,t,productInfo);
            })).then(function(result){
                return q.fcall(function(){
                    return productInfo;
                })
            })
        }else{
            return q.fcall(function(){
                return null;
            });
        }

    }

    function processPattern(patternObj,t,productInfo){
        //新规
        if(patternObj.operator==='1'){
            patternObj.patternInfoPkid = UUID.create(4).toString().replace(/\-/g, '');
            patternObj.productInfoPkid = productInfo.productInfoPkid;
            return PatternInfo.create(patternObj)
        }else
        //修改
        if(patternObj.operator==='2'){
            return PatternInfo.update(patternObj,{where : {pattern_info_pkid : patternObj.patternInfoPkid},transaction:t})
        }else
        //删除
        if(patternObj.operator==='3'||patternObj.patternInfoPkid){
            return PatternInfo.findOne({where : {pattern_info_pkid : patternObj.patternInfoPkid}})
                .then(function(patternInfo){
                    return patternInfo.destroy({transaction : t})
                })
        }else{
            return q.fcall(function(){
                return null;
            });
        }
    }



    function processProduct(url){
        return getProductContent(url).then(function(pageContent){
            return processProductContent(pageContent,url);
        })
    }

    function getProductContent(url){
        var defer = q.defer();
        var req = superAgent.get(url)
            .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
            .set('Accept-Encoding', 'gzip, deflate')
            .set('Accept-Language', 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3')
            .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:41.0) Gecko/20100101 Firefox/41.0')
            .charset('EUC-JP')
        //req.timeout(5000);
        req.end(function (err, res) {
            if (err) {
                //logger.error('=========================获取商品页面信息失败===========================');
                defer.resolve({
                    result : 'error',
                    errorMessage : '获取商品页面信息失败'
                });
            } else {
                defer.resolve(res.text);
            }
        })
        return defer.promise;
    }

    function processProductContent(pageContent,url){
        return q.fcall(function(){
            var $ = cheerio.load(pageContent);
            var productObj = {
                productId : getProductId(url),
                productUrl : url,
                productTitle : $('.item_name').text(),
                productKey : $('.catch_copy').text(),
                productPrice : processNo($('.price2').text())
            }
            return productObj;
        })
    }

    /**
     * 从URL中解析出商品ID
     * @param url 商品页面的URL
     * @returns result
     */
    function getProductId(url) {
        var result = url.substring(0, url.lastIndexOf('/'));
        result = result.substring(result.lastIndexOf('/') + 1, result.length);
        return result;
    }

    function processNo(str) {
        try {
            var result = str.replace(',', '');
            result = result.match(/[0-9]+/)[0];
        } catch (e) {
            logger.error("==================" + str + "=====================");
            return 0;
        }
        return parseFloat(result);
    }
}