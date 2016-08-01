/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('ShopInfoController',['$scope','$http','ShopInfoService','gridService','createDialog','PageObjectService',function($scope,$http,ShopInfoService,gridService,createDialog,PageObjectService){
    $scope.shopInfoList = [];
    $scope.pageObj = PageObjectService.getPageObject();
    /**
    * 点击追加按钮
    */
    $scope.insShopInfo= function(){
        $scope.shopInfo = {
            operator : '1'
        }
        $scope.open( $scope.shopInfo);
    }

    /**
    * 点击修改按钮
    * @param grid grid对象
    * @param row 要修改的行
    */
    $scope.updShopInfo =  function(row,idx){
        $scope.shopInfo = row;
        $scope.shopInfo.operator = '2';
        $scope.shopInfo.index = idx;
        $scope.open($scope.shopInfo);
    };

    /**
    * 点击删除按钮
    * @param grid grid对象
    * @param row 要删除的行
    */
    $scope.delShopInfo = function(row,idx){
        createDialog({
            id : 'delDialog',
            type : '4',
            message : '确定删除吗？',
            success : {label:'确定',fn:function(){
                var t = ShopInfoService.delete(row);
                t.then(function(data){
                    $scope.shopInfoList.splice(idx,1);
                });
            }}
        });
    }

    $scope.onPageChange = function () {
        $scope.pageObj.recount();
        $scope.getShopInfoByPage($scope.pageObj);
    }

    /**
    * 获取店铺信息表分页信息
    * @param pageObj
    */
    $scope.getShopInfoByPage = function(pageObj){
        var promise = ShopInfoService.queryByPage(pageObj); // 同步调用，获得承诺接口
        promise.then(function(data) {  // 调用承诺API获取数据 .resolve

            $scope.shopInfoList = data.rows;
            $scope.pageObj.setTotalItems(data.count);
        }, function(data) {  // 处理错误 .reject
            $scope.myData = {error: '用户不存在！'};
        });
    };

    /**
    * 初始化grid
    */
    $scope.getShopInfoByPage($scope.pageObj);

    /**
    * 弹出店铺信息表信息弹出框
    */
    $scope.open = function (transData) {
        createDialog({
            id: 'shopInfoDialog',
            templateUrl : 'tpl/shopInfoPopup.html',
            title: '店铺信息表',
            backdrop: true,
            data : angular.copy(transData),
            success: {label: '确定', fn: function(scope) {
                //新增
                if(scope.transData.operator==='1'){

                //提交数据
                    var t = ShopInfoService.insert(scope.transData);
                    //将提交成功的数据插入grid
                    t.then(function(data){
                        $scope.shopInfoList.push(data);
                    });
                }
                //修改
                else{
                    var t = ShopInfoService.update(scope.transData);
                    t.then(function(data){
                        var idx = scope.transData.idx;
                        $scope.shopInfoList.splice(idx,1,data);
                    })
                }
            }},
            cancel : {label:'取消',fn:function(scope){
                console.log(scope);
            }}
        });
    };
}]);

app.controller('ShopInfoPopupCtrl',['$scope',function($scope){

}]);