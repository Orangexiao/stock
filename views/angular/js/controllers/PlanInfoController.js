/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('PlanInfoController',['$scope','$http','PlanInfoService','gridService','createDialog','PageObjectService',function($scope,$http,PlanInfoService,gridService,createDialog,PageObjectService){
    $scope.planInfoList = [];
    $scope.pageObj = PageObjectService.getPageObject();
    /**
    * 点击追加按钮
    */
    $scope.insPlanInfo= function(){
        $scope.planInfo = {
            operator : '1'
        }
        $scope.open( $scope.planInfo);
    }

    /**
    * 点击修改按钮
    * @param grid grid对象
    * @param row 要修改的行
    */
    $scope.updPlanInfo =  function(row){
        $scope.planInfo = row;
        $scope.planInfo.operator = '2';
        $scope.open($scope.planInfo);
    };

    /**
    * 点击删除按钮
    * @param grid grid对象
    * @param row 要删除的行
    */
    $scope.delPlanInfo = function(row){
        createDialog({
            id : 'delDialog',
            type : '4',
            message : '确定删除吗？',
            success : {label:'确定',fn:function(){
                var t = PlanInfoService.delete(row);
                t.then(function(data){
                    var inx = gridService.getRowIndex('planInfoPkid',row.planInfoPkid,$scope.planInfoList);
                    $scope.planInfoList.splice(inx,1);
                });
            }}
        });
    }

    /**
    * 获取品牌分页信息
    * @param pageObj
    */
    $scope.getPlanInfoByPage = function(pageObj){
        var promise = PlanInfoService.queryByPage(pageObj); // 同步调用，获得承诺接口
        promise.then(function(data) {  // 调用承诺API获取数据 .resolve
            $scope.planInfoList = data.rows;
        $scope.pageObj.setTotalItems(data.count);
        }, function(data) {  // 处理错误 .reject
            $scope.myData = {error: '用户不存在！'};
        });
    };


    /**
    * 初始化grid
    */
    $scope.getPlanInfoByPage($scope.pageObj);

    /**
    * 弹出品牌信息弹出框
    */
    $scope.open = function (transData) {
        createDialog({
            id: 'planInfoDialog',
            templateUrl : 'tpl/planInfoPopup.html',
            title: '套餐信息表',
            backdrop: true,
            controller : 'PlanInfoPopupCtrl',
            data : angular.copy(transData),
            success: {label: '确定', fn: function(scope) {
                console.log(scope);
                //新增
                if(scope.transData.operator==='1'){
                //提交数据
                    var t = PlanInfoService.insert(scope.transData);
                    //将提交成功的数据插入grid
                    t.then(function(data){
                        $scope.planInfoList.push(data);
                    });
                    return false;
                }
                //修改
                else{
                    var t = PlanInfoService.update(scope.transData);
                    t.then(function(data){
                        var idx = gridService.getRowIndex('planInfoPkid',data.planInfoPkid,$scope.planInfoList);
                        $scope.planInfoList.splice(idx,1,data);
                    })
                    return false;
                }
            }},
            cancel : {label:'取消',fn:function(){

            }}
        });
    };
}]);

app.controller('PlanInfoPopupCtrl',['$scope','createDialog',function($scope,createDialog){
    $scope.$parent.$modalCancelLabel='cancel';
    console.log($scope);
}]);