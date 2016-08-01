/**
 * Created by xiaohongju on 15/9/9.
 */
app.controller('operatorManageController',['$scope','$window','operatorInfoService','gridService','createDialog',function($scope,$window,operatorInfoService,gridService,createDialog ){
    $scope.topOffset = 250;
    $scope.gridHeight = gridService.resizeHeight() - $scope.topOffset;
    angular.element(window).bind('load resize',function(){
        $scope.gridHeight = gridService.resizeHeight() - $scope.topOffset;
    })

    $scope.animationsEnabled = true;
    //插入数据
    $scope.insData = function(){
        $scope.func =  {
            operate : '1'
        }
        $scope.open();
    }

    //打开模态窗口
    $scope.open = function () {
        createDialog({
            id: 'simpleDialog',
            templateUrl : 'tpl/operatorManage.html',
            title:'员工信息',
            backdrop: true,
            data : angular.copy($scope.func),
            success: {label: '确定', fn: function(scope) {
                if($scope.func.operate==='1'){
                    //提交数据
                    var t = operatorInfoService.insert(scope.transData);
                    //将提交成功的数据插入grid
                    t.then(function(data){
                        $scope.gridOptions.data.push(data);
                    })
                } else{
                    var t = operatorInfoService.update(scope.transData);
                    t.then(function(data){
                        var idx = gridService.getRowIndex('pkid',data.pkid,$scope.gridOptions.data);
                        $scope.gridOptions.data.splice(idx,1,data);
                    })
                }
            }
            },
            cancel : {label:'取消',fn:function(){

            }}
        });
    };
    //
    $scope.gridOptions = {
        paginationPageSizes: [20, 50, 100],
        paginationPageSize: 20,
        useExternalPagination: true,
        autoHeight : true,
        columnDefs: [
            { field : 'pkid', name:'pkid',visible:false },
            { field : 'operatorCode',name:'管理员编码' },
            { field : 'salt', name:'密码盐' },
            { field : 'activeFlag', name:'可用标识'},
            { field : 'operatorName', name: '管理员姓名'},
            { field :　'operatorPhone', name : '管理员电话'},
            { name: '操作',
                cellTemplate:'<button class="btn-sm btn-primary" ng-click="grid.appScope.updateRow(grid,row)">修改</button><button class="btn-sm btn-light" ng-click="grid.appScope.deleteRow(grid,row)">删除</button>',
                width:'100'
            }
        ],
        data : []
    };

    $scope.getOperatorByPage = function(pageObj){
        var promise = operatorInfoService.queryByPage(pageObj); // 同步调用，获得承诺接口
        promise.then(function(data) {  // 调用承诺API获取数据 .resolve
            $scope.gridOptions.data = data.rows;
            $scope.gridOptions.totalItems = data.count;
        }, function(data) {  // 处理错误 .reject
            $scope.myData = {error: '用户不存在！'};
        });
    }

    $scope.getOperatorByPage({currentPage:1,pageSize:$scope.gridOptions.paginationPageSize,firstRow:0,lastRow:$scope.gridOptions.paginationPageSize});
    //获取gridAPI
    $scope.gridOptions.onRegisterApi = function(gridApi){
        $scope.gridApi = gridApi;
        $scope.gridApi.pagination.on.paginationChanged( $scope, function( currentPage,pageSize,pageObj){
            $scope.getFuncByPage(pageObj);
        });
    };
    //更新数据
    $scope.updateRow = function(grid,row){
        row.entity.operate = '2';
        $scope.func = row.entity;
        $scope.open();
    }

    $scope.deleteRow = function(grid,row){
        createDialog({
            id : 'delDialog',
            type : '4',
            message : '确定删除吗？',
            success : {label:'确定',fn:function(){
                var t = operatorInfoService.delete(row.entity);
                t.then(function(data){
                    var inx = gridService.getRowIndex('pkid',row.entity.pkid,$scope.gridOptions.data);
                    $scope.gridOptions.data.splice(inx,1);
                });
            }}
        });
    }
}]);