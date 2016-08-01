/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('ShopProductInfoController',['$scope','$http','ShopProductInfoService','gridService','createDialog','PageObjectService',function($scope,$http,ShopProductInfoService,gridService,createDialog,PageObjectService){
    $scope.shopProductInfoList = [];
    $scope.pageObj = PageObjectService.getPageObject();
    /**
    * 点击追加按钮
    */
    $scope.insShopProductInfo= function(){
        $scope.shopProductInfo = {
            operator : '1'
        }
        $scope.open( $scope.shopProductInfo);
    }

    /**
    * 点击修改按钮
    * @param grid grid对象
    * @param row 要修改的行
    */
    $scope.updShopProductInfo =  function(row,idx){
        $scope.shopProductInfo = row;
        $scope.shopProductInfo.operator = '2';
        $scope.shopProductInfo.index = idx;
        $scope.open($scope.shopProductInfo);
    };

    /**
    * 点击删除按钮
    * @param grid grid对象
    * @param row 要删除的行
    */
    $scope.delShopProductInfo = function(row,idx){
        createDialog({
            id : 'delDialog',
            type : '4',
            message : '确定删除吗？',
            success : {label:'确定',fn:function(){
                var t = ShopProductInfoService.delete(row);
                t.then(function(data){
                    $scope.shopProductInfoList.splice(idx,1);
                });
            }}
        });
    }

    $scope.onPageChange = function () {
        $scope.pageObj.recount();
        $scope.getShopProductInfoByPage($scope.pageObj);
    }

    /**
    * 获取店铺商品信息表分页信息
    * @param pageObj
    */
    $scope.getShopProductInfoByPage = function(pageObj){
        var promise = ShopProductInfoService.queryByPage(pageObj); // 同步调用，获得承诺接口
        promise.then(function(data) {  // 调用承诺API获取数据 .resolve

            $scope.shopProductInfoList = data.rows;
            $scope.pageObj.setTotalItems(data.count);
        }, function(data) {  // 处理错误 .reject
            $scope.myData = {error: '用户不存在！'};
        });
    };

    /**
    * 初始化grid
    */
    $scope.getShopProductInfoByPage($scope.pageObj);

    /**
    * 弹出店铺商品信息表信息弹出框
    */
    $scope.open = function (transData) {
        createDialog({
            id: 'shopProductInfoDialog',
            templateUrl : 'tpl/shopProductInfoPopup.html',
            title: '店铺商品信息表',
            backdrop: true,
            data : angular.copy(transData),
            success: {label: '确定', fn: function(scope) {
                //新增
                if(scope.transData.operator==='1'){
                //提交数据
                    var t = ShopProductInfoService.insert(scope.transData);
                    //将提交成功的数据插入grid
                    t.then(function(data){
                        $scope.shopProductInfoList.push(data);
                    });
                }
                //修改
                else{
                    var t = ShopProductInfoService.update(scope.transData);
                    t.then(function(data){
                        var idx = scope.transData.idx;
                        $scope.shopProductInfoList.splice(idx,1,data);
                    })
                }
            }},
            cancel : {label:'取消',fn:function(){

            }}
        });
    };
}]);

app.controller('ShopProductInfoPopupCtrl',['$scope',function($scope){

}]);