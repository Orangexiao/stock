/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('OrderInfoController',['$scope','$http','OrderInfoService','gridService','createDialog','PageObjectService',function($scope,$http,OrderInfoService,gridService,createDialog,PageObjectService){
    $scope.orderInfoList = [];
    $scope.pageObj = PageObjectService.getPageObject();
    /**
    * 点击追加按钮
    */
    $scope.insOrderInfo= function(){
        $scope.orderInfo = {
            operator : '1'
        }
        $scope.open( $scope.orderInfo);
    }

    /**
    * 点击修改按钮
    * @param grid grid对象
    * @param row 要修改的行
    */
    $scope.updOrderInfo =  function(row,idx){
        $scope.orderInfo = row;
        $scope.orderInfo.operator = '2';
        $scope.orderInfo.index = idx;
        $scope.open($scope.orderInfo);
    };

    /**
    * 点击删除按钮
    * @param grid grid对象
    * @param row 要删除的行
    */
    $scope.delOrderInfo = function(row,idx){
        createDialog({
            id : 'delDialog',
            type : '4',
            message : '确定删除吗？',
            success : {label:'确定',fn:function(){
                var t = OrderInfoService.delete(row);
                t.then(function(data){
                    $scope.orderInfoList.splice(idx,1);
                });
            }}
        });
    }

    $scope.onPageChange = function () {
        $scope.pageObj.recount();
        $scope.getOrderInfoByPage($scope.pageObj);
    }

    /**
    * 获取订单信息表分页信息
    * @param pageObj
    */
    $scope.getOrderInfoByPage = function(pageObj){
        var promise = OrderInfoService.queryByPage(pageObj); // 同步调用，获得承诺接口
        promise.then(function(data) {  // 调用承诺API获取数据 .resolve

            $scope.orderInfoList = data.rows;
            $scope.pageObj.setTotalItems(data.count);
        }, function(data) {  // 处理错误 .reject
            $scope.myData = {error: '用户不存在！'};
        });
    };

    /**
    * 初始化grid
    */
    $scope.getOrderInfoByPage($scope.pageObj);

    /**
    * 弹出订单信息表信息弹出框
    */
    $scope.open = function (transData) {
        createDialog({
            id: 'orderInfoDialog',
            templateUrl : 'tpl/orderInfoPopup.html',
            title: '订单信息表',
            backdrop: true,
            data : angular.copy(transData),
            success: {label: '确定', fn: function(scope) {
                //新增
                if(scope.transData.operator==='1'){
                //提交数据
                    var t = OrderInfoService.insert(scope.transData);
                    //将提交成功的数据插入grid
                    t.then(function(data){
                        $scope.orderInfoList.push(data);
                    });
                }
                //修改
                else{
                    var t = OrderInfoService.update(scope.transData);
                    t.then(function(data){
                        var idx = scope.transData.idx;
                        $scope.orderInfoList.splice(idx,1,data);
                    })
                }
            }},
            cancel : {label:'取消',fn:function(){

            }}
        });
    };
}]);

app.controller('OrderInfoPopupCtrl',['$scope',function($scope){

}]);