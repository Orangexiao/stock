/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('DictOptController',['$scope','$http','DictOptService','gridService','createDialog',function($scope,$http,DictOptService,gridService,createDialog){
    $scope.topOffset = 245;
    $scope.gridHeight = gridService.resizeHeight() - $scope.topOffset;
    angular.element(window).bind('load resize',function(){
        $scope.gridHeight = gridService.resizeHeight() - $scope.topOffset;
    })
    //grid配置
    $scope.gridOptions = {
        paginationPageSizes: [20, 50, 100],
        paginationPageSize: 20,
        useExternalPagination: true,
        columnDefs: [
        { field : 'dictOptPkid', name:'字典项目表主键ID' ,visible:false},
        { field : 'dictClsPkid', name:'字典类别表主键ID' },
        { field : 'dictOptCode', name:'字典项目编码' },
        { field : 'dictOptValue', name:'字典项目值' },
        { name:'是否可用',
            cellTemplate : '<span>{{grid.appScope.transActiveFlag(grid,row)}}</span>'
        },
        { name: '操作',
            cellTemplate:'<button class="btn btn-sm btn-primary" ng-click="grid.appScope.updDictOpt(grid,row)">修改</button><button class="btn btn-sm btn-light" ng-click="grid.appScope.delDictOpt(grid,row)">删除</button>' }
        ],
        data : []
    };

    $scope.transActiveFlag = function(grid,row){
        var activeFlagCode = row.entity.activeFlag;
        return activeFlagCode === '0'?'可用':'不可用';
    };
    /**
    * 点击追加按钮
    */
    $scope.insDictOpt= function(){
        $scope.dictOpt = {
            operator : '1'
        }
        $scope.open( $scope.dictOpt);
    }

    /**
    * 点击修改按钮
    * @param grid grid对象
    * @param row 要修改的行
    */
    $scope.updDictOpt =  function(grid,row){
        $scope.dictOpt = row.entity;
        $scope.dictOpt.operator = '2';
        $scope.open($scope.dictOpt);
    };

    /**
    * 点击删除按钮
    * @param grid grid对象
    * @param row 要删除的行
    */
    $scope.delDictOpt = function(grid,row){
        createDialog({
            id : 'delDialog',
            type : '4',
            message : '确定删除吗？',
            success : {label:'确定',fn:function(){
                var t = DictOptService.delete(row.entity);
                t.then(function(data){
                    var inx = gridService.getRowIndex('dictOptPkid',row.entity.dictOptPkid,$scope.gridOptions.data);
                    $scope.gridOptions.data.splice(inx,1);
                });
            }}
        });
    }

    /**
    * 获取品牌分页信息
    * @param pageObj
    */
    $scope.getDictOptByPage = function(pageObj){
        var promise = DictOptService.queryByPage(pageObj); // 同步调用，获得承诺接口
        promise.then(function(data) {  // 调用承诺API获取数据 .resolve

        $scope.gridOptions.data = data.rows;
        $scope.gridOptions.totalItems = data.count;
        }, function(data) {  // 处理错误 .reject
            $scope.myData = {error: '用户不存在！'};
        });
    };
    /**
    * gird扩展方法
    * @param gridApi
    */
    $scope.gridOptions.onRegisterApi = function(gridApi){
        $scope.gridApi = gridApi;
        /**
        * 导航条变化时的处理
        */
        $scope.gridApi.pagination.on.paginationChanged( $scope, function( currentPage,pageSize,pageObj){
            $scope.getDictOptByPage(pageObj);
        });
    };


    /**
    * 初始化grid
    */
    $scope.getDictOptByPage({currentPage:1,pageSize:$scope.gridOptions.paginationPageSize,firstRow:0,lastRow:$scope.gridOptions.paginationPageSize});

    /**
    * 弹出品牌信息弹出框
    */
    $scope.open = function (transData) {
        createDialog({
            id: 'dictOptDialog',
            templateUrl : 'tpl/dictOptPopup.html',
            title: '字典项目表',
            backdrop: true,
            data : angular.copy(transData),
            success: {label: '确定', fn: function(scope) {
                //新增
                if(scope.transData.operator==='1'){
                //提交数据
                    var t = DictOptService.insert(scope.transData);
                    //将提交成功的数据插入grid
                    t.then(function(data){
                        $scope.gridOptions.data.push(data);
                    });
                }
                //修改
                else{
                    var t = DictOptService.update(scope.transData);
                    t.then(function(data){
                        var idx = gridService.getRowIndex('dictOptPkid',data.dictOptPkid,$scope.gridOptions.data);
                        $scope.gridOptions.data.splice(idx,1,data);
                    })
                }
            }},
            cancel : {label:'取消',fn:function(){

            }}
        });
    };
}]);

app.controller('DictOptPopupCtrl',['$scope','createDialog',function($scope,createDialog){

}]);