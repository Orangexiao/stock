/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('ProductInfoController',['$scope','$http','ProductInfoService','gridService','createDialog','PageObjectService','toaster',function($scope,$http,ProductInfoService,gridService,createDialog,PageObjectService,toaster){
    $scope.whereClause = '';

    $scope.productInfoList = [];
    $scope.pageObj = PageObjectService.getPageObject();
    /**
    * 点击追加按钮
    */
    $scope.insProductInfo= function(){
        $scope.productInfo = {
            operator : '1'
        }
        $scope.open( $scope.productInfo);
    }

    /**
    * 点击修改按钮
    * @param grid grid对象
    * @param row 要修改的行
    */
    $scope.updProductInfo =  function(row,idx){
        $scope.productInfo = row;
        $scope.productInfo.operator = '2';
        $scope.productInfo.index = idx;
        $scope.open($scope.productInfo);
    };

    /**
    * 点击删除按钮
    * @param grid grid对象
    * @param row 要删除的行
    */
    $scope.delProductInfo = function(row,idx){
        createDialog({
            id : 'delDialog',
            type : '4',
            message : '确定删除吗？',
            success : {label:'确定',fn:function(){
                var t = ProductInfoService.delete(row);
                t.then(function(data){
                    $scope.productInfoList.splice(idx,1);
                    toaster.pop('success','商品信息删除成功');
                });
            }}
        });
    }

    $scope.onPageChange = function () {
        $scope.pageObj.recount();
        $scope.getProductInfoByPage($scope.pageObj);
    }

    $scope.queryByOpt = function(){
        var p = ProductInfoService.queryByPage($scope.pageObj,$scope.whereClause);
        p.then(function(data) {  // 调用承诺API获取数据 .resolve
            $scope.productInfoList = data.rows;
            $scope.pageObj.setTotalItems(data.count);
        }, function(data) {  // 处理错误 .reject
            toaster.pop('error','没有找到对应的商品信息');
        });
    }

    /**
    * 获取商品信息表分页信息
    * @param pageObj
    */
    $scope.getProductInfoByPage = function(pageObj){
        var promise = ProductInfoService.queryByPage(pageObj); // 同步调用，获得承诺接口
        promise.then(function(data) {  // 调用承诺API获取数据 .resolve
            $scope.productInfoList = data.rows;
            $scope.pageObj.setTotalItems(data.count);

        }, function(data) {  // 处理错误 .reject
            toaster.pop('error','没有找到对应的商品信息');
        });
    };

    /**
    * 初始化grid
    */
    $scope.getProductInfoByPage($scope.pageObj);

    /**
    * 弹出商品信息表信息弹出框
    */
    $scope.open = function (transData) {
        createDialog({
            id: 'productInfoDialog',
            templateUrl : 'tpl/productInfoPopup.html',
            title: '商品信息表',
            backdrop: true,
            data : angular.copy(transData),
            success: {label: '确定', fn: function(scope) {
                //新增
                if(scope.transData.operator==='1'){
                //提交数据
                //    var t = ProductInfoService.insert(scope.transData);
                    var t = ProductInfoService.procProduct(scope.transData);
                    //将提交成功的数据插入grid
                    t.then(function(data){
                        $scope.productInfoList.push(data);
                        toaster.pop('success','商品信息追加成功');
                    });
                }
                //修改
                else{
                    var t = ProductInfoService.update(scope.transData);
                    t.then(function(data){
                        var idx = scope.transData.idx;
                        $scope.productInfoList.splice(idx,1,data);
                        toaster.pop('success','商品信息修改成功');
                    })
                }
            }},
            cancel : {label:'取消',fn:function(){

            }}
        });
    };
}]);

app.controller('ProductInfoPopupController',['$scope','DictClsService','createDialog','ProductInfoService','PatternInfoService','editableOptions','$filter',function($scope,DictClsService,createDialog,ProductInfoService,PatternInfoService,editableOptions,$filter){
    editableOptions.theme = 'bs3';
    $scope.patternInfoList = [];
    $scope.platFormList = [];

    //$scope.popupForm.testForm.$show();
    var platFormListPromise = DictClsService.getOptsByClsCode('03');
    platFormListPromise.then(function(result){
        $scope.platFormList = result;
        //$scope.platFormList = $filter('filter')($scope.platFormList,{operator:3});
    })
    if($scope.transData.operator !== '1'){
        var patternPromise = PatternInfoService.queryByProductPkid($scope.transData.productInfoPkid)
            patternPromise.then(function(result){
                $scope.patternInfoList = result;
        })
    }

    $scope.save = function(){

        $scope.popupForm.testForm.$submit();
        $scope.transData.patternInfoList = $scope.patternInfoList;
    }

    $scope.addPattern = function(){
        $scope.patternInfo = {
            'patternId' : '',
            'patternName' : '',
            'operator' : '1'
        }
        $scope.popupForm.testForm.$show();
        $scope.patternInfoList.push($scope.patternInfo);
    }

    $scope.importProduct = function () {
        createDialog({
            id: 'productImportDialog',
            templateUrl : 'tpl/importProduct.html',
            title: '商品导入',
            backdrop: true,
            success: {label: '导入', fn: function(scope) {
                var t = ProductInfoService.importProudct(scope.transData.platformCode,scope.transData.productUrl);
                t.then(function(productObj){
                    angular.extend($scope.transData,productObj);
                })
            }},
            cancel : {label:'取消',fn:function(){

            }}
        });
    };
    $scope.openPatternWin = function(transData){
        //createDialog({
        //    id : 'patternDialog',
        //    templateUrl : 'tpl/patternInfoPopup.html',
        //    title : '商品规格',
        //    backdrop : true,
        //    data : angular.copy(transData),
        //    success : {
        //        label : '确定' , fn : function(scope){
        //            $scope.patternInfoList.push()
        //        }
        //    }
        //})
    }

    $scope.patternFilter = function(e){
        return e.operator !== '3';
    }

    $scope.removePattern = function(row,index){
        console.log($scope.patternInfoList)
        if(row.patternInfoPkid){
            row.operator = '3';
        }else{
            var idx = $scope.patternInfoList.indexOf(row);
            $scope.patternInfoList.splice(idx,1);
        }
    }
}]);

app.controller('ProductImportCtrl',['$scope','DictClsService',function($scope,DictClsService){

    $scope.platFormList = [];
    var platFormListPromise = DictClsService.getOptsByClsCode('05');
    platFormListPromise.then(function(result){
        $scope.platFormList = result[0].dict_opts;
    })
}])