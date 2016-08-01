/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('RoleFunctionController',['$scope','$http','RoleFunctionService','gridService','createDialog','PageObjectService',function($scope,$http,RoleFunctionService,gridService,createDialog,PageObjectService){
    $scope.roleFunctionList = [];
    $scope.pageObj = PageObjectService.getPageObject();
    /**
    * 点击追加按钮
    */
    $scope.insRoleFunction= function(){
        $scope.roleFunction = {
            operator : '1'
        }
        $scope.open( $scope.roleFunction);
    }

    /**
    * 点击修改按钮
    * @param grid grid对象
    * @param row 要修改的行
    */
    $scope.updRoleFunction =  function(row,idx){
        $scope.roleFunction = row;
        $scope.roleFunction.operator = '2';
        $scope.roleFunction.index = idx;
        $scope.open($scope.roleFunction);
    };

    /**
    * 点击删除按钮
    * @param grid grid对象
    * @param row 要删除的行
    */
    $scope.delRoleFunction = function(row,idx){
        createDialog({
            id : 'delDialog',
            type : '4',
            message : '确定删除吗？',
            success : {label:'确定',fn:function(){
                var t = RoleFunctionService.delete(row);
                t.then(function(data){
                    $scope.roleFunctionList.splice(idx,1);
                });
            }}
        });
    }

    $scope.onPageChange = function () {
        $scope.pageObj.recount();
        $scope.getRoleFunctionByPage($scope.pageObj);
    }

    /**
    * 获取角色功能对应表分页信息
    * @param pageObj
    */
    $scope.getRoleFunctionByPage = function(pageObj){
        var promise = RoleFunctionService.queryByPage(pageObj); // 同步调用，获得承诺接口
        promise.then(function(data) {  // 调用承诺API获取数据 .resolve

            $scope.roleFunctionList = data.rows;
            $scope.pageObj.setTotalItems(data.count);
        }, function(data) {  // 处理错误 .reject
            $scope.myData = {error: '用户不存在！'};
        });
    };

    /**
    * 初始化grid
    */
    $scope.getRoleFunctionByPage($scope.pageObj);

    /**
    * 弹出角色功能对应表信息弹出框
    */
    $scope.open = function (transData) {
        createDialog({
            id: 'roleFunctionDialog',
            templateUrl : 'tpl/roleFunctionPopup.html',
            title: '角色功能对应表',
            backdrop: true,
            data : angular.copy(transData),
            success: {label: '确定', fn: function(scope) {
                //新增
                if(scope.transData.operator==='1'){
                //提交数据
                    var t = RoleFunctionService.insert(scope.transData);
                    //将提交成功的数据插入grid
                    t.then(function(data){
                        $scope.roleFunctionList.push(data);
                    });
                }
                //修改
                else{
                    var t = RoleFunctionService.update(scope.transData);
                    t.then(function(data){
                        var idx = scope.transData.idx;
                        $scope.roleFunctionList.splice(idx,1,data);
                    })
                }
            }},
            cancel : {label:'取消',fn:function(){

            }}
        });
    };
}]);

app.controller('RoleFunctionPopupCtrl',['$scope',function($scope){

}]);