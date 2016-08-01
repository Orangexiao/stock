/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('PayDetailController',['$scope','$http','PayDetailService','gridService','createDialog','PageObjectService',function($scope,$http,PayDetailService,gridService,createDialog,PageObjectService){
    $scope.payDetailList = [];
    $scope.pageObj = PageObjectService.getPageObject();
    /**
    * 点击追加按钮
    */
    $scope.insPayDetail= function(){
        $scope.payDetail = {
            operator : '1'
        }
        $scope.open( $scope.payDetail);
    }

    /**
    * 点击修改按钮
    * @param grid grid对象
    * @param row 要修改的行
    */
    $scope.updPayDetail =  function(row){
        $scope.payDetail = row;
        $scope.payDetail.operator = '2';
        $scope.open($scope.payDetail);
    };

    /**
    * 点击删除按钮
    * @param grid grid对象
    * @param row 要删除的行
    */
    $scope.delPayDetail = function(row){
        createDialog({
            id : 'delDialog',
            type : '4',
            message : '确定删除吗？',
            success : {label:'确定',fn:function(){
                var t = PayDetailService.delete(row);
                t.then(function(data){
                    var inx = gridService.getRowIndex('payDetailPkid',row.payDetailPkid,$scope.payDetailList);
                    $scope.payDetailList.splice(inx,1);
                });
            }}
        });
    }

    /**
    * 获取品牌分页信息
    * @param pageObj
    */
    $scope.getPayDetailByPage = function(pageObj){
        var promise = PayDetailService.queryByPage(pageObj); // 同步调用，获得承诺接口
        promise.then(function(data) {  // 调用承诺API获取数据 .resolve

            $scope.payDetailList = data.rows;
            $scope.pageObj.setTotalItems(data.count);
        }, function(data) {  // 处理错误 .reject
            $scope.myData = {error: '用户不存在！'};
        });
    };

    /**
    * 初始化grid
    */
    $scope.getPayDetailByPage($scope.pageObj);

    /**
    * 弹出品牌信息弹出框
    */
    $scope.open = function (transData) {
        createDialog({
            id: 'payDetailDialog',
            templateUrl : 'tpl/payDetailPopup.html',
            title: '账户付款明细',
            backdrop: true,
            data : angular.copy(transData),
            success: {label: '确定', fn: function(scope) {
                //新增
                if(scope.transData.operator==='1'){
                //提交数据
                    var t = PayDetailService.insert(scope.transData);
                    //将提交成功的数据插入grid
                    t.then(function(data){
                        $scope.payDetailList.push(data);
                    });
                }
                //修改
                else{
                    var t = PayDetailService.update(scope.transData);
                    t.then(function(data){
                        var idx = gridService.getRowIndex('payDetailPkid',data.payDetailPkid,$scope.payDetailList);
                        $scope.payDetailList.splice(idx,1,data);
                    })
                }
            }},
            cancel : {label:'取消',fn:function(){

            }}
        });
    };
}]);

app.controller('PayDetailPopupCtrl',['$scope',function($scope){
    $scope.transData.payDate = new Date();

    $scope.status = {
        isPayDateOpened : false
    }

    $scope.openPayDate = function(){
        $scope.status.isPayDateOpened = true;
    }

}]);