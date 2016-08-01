/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('StockProductController',['$scope','$http','StockProductService','gridService','createDialog','PageObjectService',function($scope,$http,StockProductService,gridService,createDialog,PageObjectService){
    $scope.stockProductList = [];
    $scope.pageObj = PageObjectService.getPageObject();
    /**
    * 点击追加按钮
    */
    $scope.insStockProduct= function(){
        $scope.stockProduct = {
            operator : '1'
        }
        $scope.open( $scope.stockProduct);
    }

    /**
    * 点击修改按钮
    * @param grid grid对象
    * @param row 要修改的行
    */
    $scope.updStockProduct =  function(row,idx){
        $scope.stockProduct = row;
        $scope.stockProduct.operator = '2';
        $scope.stockProduct.index = idx;
        $scope.open($scope.stockProduct);
    };

    /**
    * 点击删除按钮
    * @param grid grid对象
    * @param row 要删除的行
    */
    $scope.delStockProduct = function(row,idx){
        createDialog({
            id : 'delDialog',
            type : '4',
            message : '确定删除吗？',
            success : {label:'确定',fn:function(){
                var t = StockProductService.delete(row);
                t.then(function(data){
                    $scope.stockProductList.splice(idx,1);
                });
            }}
        });
    }

    $scope.onPageChange = function () {
        $scope.pageObj.recount();
        $scope.getStockProductByPage($scope.pageObj);
    }

    /**
    * 获取进货商品信息表分页信息
    * @param pageObj
    */
    $scope.getStockProductByPage = function(pageObj){
        var promise = StockProductService.queryByPage(pageObj); // 同步调用，获得承诺接口
        promise.then(function(data) {  // 调用承诺API获取数据 .resolve

            $scope.stockProductList = data.rows;
            $scope.pageObj.setTotalItems(data.count);
        }, function(data) {  // 处理错误 .reject
            $scope.myData = {error: '用户不存在！'};
        });
    };

    /**
    * 初始化grid
    */
    $scope.getStockProductByPage($scope.pageObj);

    /**
    * 弹出进货商品信息表信息弹出框
    */
    $scope.open = function (transData) {
        createDialog({
            id: 'stockProductDialog',
            templateUrl : 'tpl/stockProductPopup.html',
            title: '进货商品信息表',
            backdrop: true,
            data : angular.copy(transData),
            success: {label: '确定', fn: function(scope) {
                //新增
                if(scope.transData.operator==='1'){
                //提交数据
                    var t = StockProductService.insert(scope.transData);
                    //将提交成功的数据插入grid
                    t.then(function(data){
                        $scope.stockProductList.push(data);
                    });
                }
                //修改
                else{
                    var t = StockProductService.update(scope.transData);
                    t.then(function(data){
                        var idx = scope.transData.idx;
                        $scope.stockProductList.splice(idx,1,data);
                    })
                }
            }},
            cancel : {label:'取消',fn:function(){

            }}
        });
    };
}]);

app.controller('StockProductPopupCtrl',['$scope',function($scope){

}]);