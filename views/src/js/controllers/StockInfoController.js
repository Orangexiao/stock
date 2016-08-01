/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('StockInfoController',['$scope','$http','StockInfoService','gridService','createDialog','PageObjectService',function($scope,$http,StockInfoService,gridService,createDialog,PageObjectService){
    $scope.stockInfoList = [];
    $scope.pageObj = PageObjectService.getPageObject();
    /**
    * 点击追加按钮
    */
    $scope.insStockInfo= function(){
        $scope.stockInfo = {
            operator : '1'
        }
        $scope.open( $scope.stockInfo);
    }

    /**
    * 点击修改按钮
    * @param grid grid对象
    * @param row 要修改的行
    */
    $scope.updStockInfo =  function(row,idx){
        $scope.stockInfo = row;
        $scope.stockInfo.operator = '2';
        $scope.stockInfo.index = idx;
        $scope.open($scope.stockInfo);
    };

    /**
    * 点击删除按钮
    * @param grid grid对象
    * @param row 要删除的行
    */
    $scope.delStockInfo = function(row,idx){
        createDialog({
            id : 'delDialog',
            type : '4',
            message : '确定删除吗？',
            success : {label:'确定',fn:function(){
                var t = StockInfoService.delete(row);
                t.then(function(data){
                    $scope.stockInfoList.splice(idx,1);
                });
            }}
        });
    }

    $scope.onPageChange = function () {
        $scope.pageObj.recount();
        $scope.getStockInfoByPage($scope.pageObj);
    }

    /**
    * 获取进货信息表分页信息
    * @param pageObj
    */
    $scope.getStockInfoByPage = function(pageObj){
        var promise = StockInfoService.queryByPage(pageObj); // 同步调用，获得承诺接口
        promise.then(function(data) {  // 调用承诺API获取数据 .resolve

            $scope.stockInfoList = data.rows;
            $scope.pageObj.setTotalItems(data.count);
        }, function(data) {  // 处理错误 .reject
            $scope.myData = {error: '用户不存在！'};
        });
    };

    /**
    * 初始化grid
    */
    $scope.getStockInfoByPage($scope.pageObj);

    /**
    * 弹出进货信息表信息弹出框
    */
    $scope.open = function (transData) {
        createDialog({
            id: 'stockInfoDialog',
            templateUrl : 'tpl/stockInfoPopup.html',
            title: '进货信息表',
            backdrop: true,
            data : angular.copy(transData),
            success: {label: '确定', fn: function(scope) {
                //新增
                if(scope.transData.operator==='1'){
                //提交数据
                    var t = StockInfoService.insert(scope.transData);
                    //将提交成功的数据插入grid
                    t.then(function(data){
                        $scope.stockInfoList.push(data);
                    });
                }
                //修改
                else{
                    var t = StockInfoService.update(scope.transData);
                    t.then(function(data){
                        var idx = scope.transData.idx;
                        $scope.stockInfoList.splice(idx,1,data);
                    })
                }
            }},
            cancel : {label:'取消',fn:function(){

            }}
        });
    };
}]);

app.controller('StockInfoPopupCtrl',['$scope',function($scope){

}]);