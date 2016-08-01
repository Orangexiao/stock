/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('OperatorRoleController',['$scope','$http','OperatorRoleService','gridService','createDialog','PageObjectService',function($scope,$http,OperatorRoleService,gridService,createDialog,PageObjectService){
    $scope.operatorRoleList = [];
    $scope.pageObj = PageObjectService.getPageObject();
    /**
    * 点击追加按钮
    */
    $scope.insOperatorRole= function(){
        $scope.operatorRole = {
            operator : '1'
        }
        $scope.open( $scope.operatorRole);
    }

    /**
    * 点击修改按钮
    * @param grid grid对象
    * @param row 要修改的行
    */
    $scope.updOperatorRole =  function(row,idx){
        $scope.operatorRole = row;
        $scope.operatorRole.operator = '2';
        $scope.operatorRole.index = idx;
        $scope.open($scope.operatorRole);
    };

    /**
    * 点击删除按钮
    * @param grid grid对象
    * @param row 要删除的行
    */
    $scope.delOperatorRole = function(row,idx){
        createDialog({
            id : 'delDialog',
            type : '4',
            message : '确定删除吗？',
            success : {label:'确定',fn:function(){
                var t = OperatorRoleService.delete(row);
                t.then(function(data){
                    $scope.operatorRoleList.splice(idx,1);
                });
            }}
        });
    }

    $scope.onPageChange = function () {
        $scope.pageObj.recount();
        $scope.getOperatorRoleByPage($scope.pageObj);
    }

    /**
    * 获取管理员角色对应表分页信息
    * @param pageObj
    */
    $scope.getOperatorRoleByPage = function(pageObj){
        var promise = OperatorRoleService.queryByPage(pageObj); // 同步调用，获得承诺接口
        promise.then(function(data) {  // 调用承诺API获取数据 .resolve

            $scope.operatorRoleList = data.rows;
            $scope.pageObj.setTotalItems(data.count);
        }, function(data) {  // 处理错误 .reject
            $scope.myData = {error: '用户不存在！'};
        });
    };

    /**
    * 初始化grid
    */
    $scope.getOperatorRoleByPage($scope.pageObj);

    /**
    * 弹出管理员角色对应表信息弹出框
    */
    $scope.open = function (transData) {
        createDialog({
            id: 'operatorRoleDialog',
            templateUrl : 'tpl/operatorRolePopup.html',
            title: '管理员角色对应表',
            backdrop: true,
            data : angular.copy(transData),
            success: {label: '确定', fn: function(scope) {
                //新增
                if(scope.transData.operator==='1'){
                //提交数据
                    var t = OperatorRoleService.insert(scope.transData);
                    //将提交成功的数据插入grid
                    t.then(function(data){
                        $scope.operatorRoleList.push(data);
                    });
                }
                //修改
                else{
                    var t = OperatorRoleService.update(scope.transData);
                    t.then(function(data){
                        var idx = scope.transData.idx;
                        $scope.operatorRoleList.splice(idx,1,data);
                    })
                }
            }},
            cancel : {label:'取消',fn:function(){

            }}
        });
    };
}]);

app.controller('OperatorRolePopupCtrl',['$scope',function($scope){

}]);