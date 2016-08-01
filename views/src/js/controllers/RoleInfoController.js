/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('RoleInfoController',['$scope','$http','RoleInfoService','gridService','createDialog','PageObjectService','toaster',function($scope,$http,RoleInfoService,gridService,createDialog,PageObjectService,toaster){
    $scope.roleInfoList = [];
    $scope.pageObj = PageObjectService.getPageObject();
    /**
    * 点击追加按钮
    */
    $scope.insRoleInfo= function(){
        $scope.roleInfo = {
            operator : '1'
        }
        $scope.open( $scope.roleInfo);
    }

    /**
    * 点击修改按钮
    * @param grid grid对象
    * @param row 要修改的行
    */
    $scope.updRoleInfo =  function(row){
        $scope.roleInfo = row;
        $scope.roleInfo.operator = '2';
        $scope.open($scope.roleInfo);
    };

    /**
    * 点击删除按钮
    * @param grid grid对象
    * @param row 要删除的行
    */
    $scope.delRoleInfo = function(row){
        createDialog({
            id : 'delDialog',
            type : '4',
            message : '确定删除吗？',
            success : {label:'确定',fn:function(){
                var t = RoleInfoService.delete(row);
                t.then(function(data){
                    var inx = gridService.getRowIndex('roleInfoPkid',row.roleInfoPkid,$scope.roleInfoList);
                    $scope.roleInfoList.splice(inx,1);
                    toaster.pop('success','删除成功')

                });
            }}
        });
    }

    /**
    * 获取品牌分页信息
    * @param pageObj
    */
    $scope.getRoleInfoByPage = function(pageObj){
        var promise = RoleInfoService.queryByPage(pageObj); // 同步调用，获得承诺接口
        promise.then(function(data) {  // 调用承诺API获取数据 .resolve
            if(data.rows && data.rows === 0){
                toaster.pop('warning','没有查询到相关数据');
            }
            $scope.roleInfoList = data.rows;
            $scope.pageObj.setTotalItems(data.count);
        }, function(data) {  // 处理错误 .reject
            $scope.myData = {error: '用户不存在！'};
        });
    };

    /**
    * 初始化grid
    */
    $scope.getRoleInfoByPage($scope.pageObj);

    /**
    * 弹出品牌信息弹出框
    */
    $scope.open = function (transData) {
        createDialog({
            id: 'roleInfoDialog',
            templateUrl : 'tpl/roleInfoPopup.html',
            title: '角色信息表',
            backdrop: true,
            data : angular.copy(transData),
            success: {label: '确定', fn: function(scope) {
                //新增
                if(scope.transData.operator==='1'){
                //提交数据
                    var t = RoleInfoService.insert(scope.transData);
                    //将提交成功的数据插入grid
                    t.then(function(data){
                        $scope.roleInfoList.push(data);
                        toaster.pop('success','新增角色信息成功');
                    });
                }
                //修改
                else{
                    var t = RoleInfoService.update(scope.transData);
                    t.then(function(data){
                        var idx = gridService.getRowIndex('roleInfoPkid',data.roleInfoPkid,$scope.roleInfoList);
                        $scope.roleInfoList.splice(idx,1,data);
                        toaster.pop('success','修改角色信息成功');
                    })
                }
            }},
            cancel : {label:'取消',fn:function(){

            }}
        });
    };
}]);

app.controller('RoleInfoPopupCtrl',['$scope','DictClsService','FunctionInfoService','RoleInfoService','$q',function($scope,DictClsService,FunctionInfoService,RoleInfoService,$q){
    $scope.transData.functionList = [];
    (function(){
        if($scope.transData.operator === '2'){
            var roleInfoPromise = RoleInfoService.queryByRoleId($scope.transData.roleInfoPkid);
            roleInfoPromise.then(function(roleInfo){
                angular.extend($scope.transData,roleInfo);
                var functionInfos = roleInfo.function_infos;
                for(var i= 0;i<functionInfos.length;i++){
                    $scope.transData.functionList.push(functionInfos[i].functionInfoPkid);
                }
            })
        }
    })();

    $scope.activeFlagList = [];
    var activeFlagPromise = DictClsService.getOptsByClsCode('01');
    activeFlagPromise.then(function(dataList){
        $scope.activeFlagList = dataList[0].dict_opts;
    });

    $scope.functionInfoList = [];
    var funcInfoPromise = FunctionInfoService.query();
    funcInfoPromise.then(function(dataList){
        $scope.functionInfoList = dataList;
    });


    $scope.onActiveFlagChange = function(item){
        $scope.transData.activeFlag = item.dictOptValue;
    }

}]);