/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('OrderProductController',['$scope','$http','OrderProductService','gridService','createDialog','PageObjectService',function($scope,$http,OrderProductService,gridService,createDialog,PageObjectService){
    $scope.orderProductList = [];
    $scope.pageObj = PageObjectService.getPageObject();
    /**
    * 点击追加按钮
    */
    $scope.insOrderProduct= function(){
        $scope.orderProduct = {
            operator : '1'
        }
        $scope.open( $scope.orderProduct);
    }

    /**
    * 点击修改按钮
    * @param grid grid对象
    * @param row 要修改的行
    */
    $scope.updOrderProduct =  function(row,idx){
        $scope.orderProduct = row;
        $scope.orderProduct.operator = '2';
        $scope.orderProduct.index = idx;
        $scope.open($scope.orderProduct);
    };

    /**
    * 点击删除按钮
    * @param grid grid对象
    * @param row 要删除的行
    */
    $scope.delOrderProduct = function(row,idx){
        createDialog({
            id : 'delDialog',
            type : '4',
            message : '确定删除吗？',
            success : {label:'确定',fn:function(){
                var t = OrderProductService.delete(row);
                t.then(function(data){
                    $scope.orderProductList.splice(idx,1);
                });
            }}
        });
    }

    $scope.onPageChange = function () {
        $scope.pageObj.recount();
        $scope.getOrderProductByPage($scope.pageObj);
    }

    /**
    * 获取订单商品信息表分页信息
    * @param pageObj
    */
    $scope.getOrderProductByPage = function(pageObj){
        var promise = OrderProductService.queryByPage(pageObj); // 同步调用，获得承诺接口
        promise.then(function(data) {  // 调用承诺API获取数据 .resolve

            $scope.orderProductList = data.rows;
            $scope.pageObj.setTotalItems(data.count);
        }, function(data) {  // 处理错误 .reject
            $scope.myData = {error: '用户不存在！'};
        });
    };

    /**
    * 初始化grid
    */
    $scope.getOrderProductByPage($scope.pageObj);

    /**
    * 弹出订单商品信息表信息弹出框
    */
    $scope.open = function (transData) {
        createDialog({
            id: 'orderProductDialog',
            templateUrl : 'tpl/orderProductPopup.html',
            title: '订单商品信息表',
            backdrop: true,
            data : angular.copy(transData),
            success: {label: '确定', fn: function(scope) {
                //新增
                if(scope.transData.operator==='1'){
                //提交数据
                    var t = OrderProductService.insert(scope.transData);
                    //将提交成功的数据插入grid
                    t.then(function(data){
                        $scope.orderProductList.push(data);
                    });
                }
                //修改
                else{
                    var t = OrderProductService.update(scope.transData);
                    t.then(function(data){
                        var idx = scope.transData.idx;
                        $scope.orderProductList.splice(idx,1,data);
                    })
                }
            }},
            cancel : {label:'取消',fn:function(){

            }}
        });
    };
}]);

app.controller('OrderProductPopupCtrl',['$scope',function($scope){

}]);