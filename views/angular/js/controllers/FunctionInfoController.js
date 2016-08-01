/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('FunctionInfoController',['$scope','$http','FunctionInfoService','gridService','createDialog','PageObjectService','toaster',function($scope,$http,FunctionInfoService,gridService,createDialog,PageObjectService,toaster){
    $scope.functionInfoList = [];
    $scope.pageObj = PageObjectService.getPageObject();
    /**
    * 点击追加按钮
    */
    $scope.insFunctionInfo= function(){
        $scope.functionInfo = {
            operator : '1'
        }
        $scope.open( $scope.functionInfo);
    }

    /**
    * 点击修改按钮
    * @param grid grid对象
    * @param row 要修改的行
    */
    $scope.updFunctionInfo =  function(row){
        $scope.functionInfo = row;
        $scope.functionInfo.operator = '2';
        $scope.open($scope.functionInfo);
    };

    /**
    * 点击删除按钮
    * @param grid grid对象
    * @param row 要删除的行
    */
    $scope.delFunctionInfo = function(row){
        createDialog({
            id : 'delDialog',
            type : '4',
            message : '确定删除吗？',
            success : {label:'确定',fn:function(){
                var t = FunctionInfoService.delete(row);
                t.then(function(data){
                    var inx = gridService.getRowIndex('functionInfoPkid',row.functionInfoPkid,$scope.functionInfoList);
                    $scope.functionInfoList.splice(inx,1);
                    toaster.pop('success','功能删除成功');
                });
            }}
        });
    }

    /**
    * 获取品牌分页信息
    * @param pageObj
    */
    $scope.getFunctionInfoByPage = function(pageObj){
        var promise = FunctionInfoService.queryByPage(pageObj); // 同步调用，获得承诺接口
        promise.then(function(data) {  // 调用承诺API获取数据 .resolve

            $scope.functionInfoList = data.rows;
            $scope.pageObj.setTotalItems(data.count);
        }, function(data) {  // 处理错误 .reject
            $scope.myData = {error: '用户不存在！'};
        });
    };

    /**
    * 初始化grid
    */
    $scope.getFunctionInfoByPage($scope.pageObj);

    /**
    * 弹出品牌信息弹出框
    */
    $scope.open = function (transData) {
        createDialog({
            id: 'functionInfoDialog',
            templateUrl : 'tpl/functionInfoPopup.html',
            title: '功能信息表',
            backdrop: true,
            data : angular.copy(transData),
            success: {label: '确定', fn: function(scope) {
                //新增
                if(scope.transData.operator==='1'){
                //提交数据
                    var t = FunctionInfoService.insert(scope.transData);
                    //将提交成功的数据插入grid
                    t.then(function(data){
                        $scope.functionInfoList.push(data);
                        toaster.pop('success','功能信息追加成功');
                    });
                }
                //修改
                else{
                    var t = FunctionInfoService.update(scope.transData);
                    t.then(function(data){
                        var idx = gridService.getRowIndex('functionInfoPkid',data.functionInfoPkid,$scope.functionInfoList);
                        $scope.functionInfoList.splice(idx,1,data);
                        toaster.pop('success','功能信息修改成功');
                    })
                }
            }},
            cancel : {label:'取消',fn:function(){

            }}
        });
    };
}]);

app.controller('FunctionInfoPopupCtrl',['$scope','DictClsService',function($scope,DictClsService){
    //功能类型列表
    $scope.funcTypeList = [];

    var funcTypePromise = DictClsService.getOptsByClsCode('08');
    funcTypePromise.then(function(dataList){
        $scope.funcTypeList = dataList[0].dict_opts;
    });

    $scope.activeFlagList = [];
    var activeFlagPromise = DictClsService.getOptsByClsCode('01');
    activeFlagPromise.then(function(dataList){
        $scope.activeFlagList = dataList[0].dict_opts;
    });

    $scope.onFuncTypeChange = function(item){
        $scope.transData.functionType = item.dictOptValue;
    }

    $scope.onActiveFlagChange = function(item){
        $scope.transData.activeFlag = item.dictOptValue;
    }
}]);