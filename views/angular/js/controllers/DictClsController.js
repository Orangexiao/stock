/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('DictClsController',['$scope','$http','DictClsService','gridService','createDialog',function($scope,$http,DictClsService,gridService,createDialog){
    $scope.whereClause = {};
    $scope.topOffset = 245;
    $scope.gridHeight = gridService.resizeHeight() - $scope.topOffset;
    angular.element(window).bind('load resize',function(){
        $scope.gridHeight = gridService.resizeHeight() - $scope.topOffset;
    })

    $scope.getDictClsByOpt = function(){
        var promise = DictClsService.getOptsByClsCode('01');
        promise.then(function(data){
            $scope.dictOpts = data.dict_opts;
        });
    }
    //grid配置
    $scope.gridOptions = {
        paginationPageSizes: [20, 50, 100],
        paginationPageSize: 20,
        useExternalPagination: true,
        columnDefs: [
        { field : 'dictClsPkid', name:'字典类别表主键ID' ,visible:false},
        { field : 'dictClsCode', name:'字典项目编码' },
        { field : 'dictClsName', name:'字典项目名' },
        { name: '操作',
            cellTemplate:'<button class="btn btn-sm btn-primary" ng-click="grid.appScope.updDictCls(grid,row)">修改</button><button class="btn btn-sm btn-light" ng-click="grid.appScope.delDictCls(grid,row)">删除</button>' }
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
    $scope.insDictCls= function(){
        $scope.dictCls = {
            operator : '1'
        }
        $scope.open( $scope.dictCls);
    }

    /**
    * 点击修改按钮
    * @param grid grid对象
    * @param row 要修改的行
    */
    $scope.updDictCls =  function(grid,row){
        $scope.dictCls = row.entity;
        $scope.dictCls.operator = '2';
        $scope.open($scope.dictCls);
    };

    $scope.openDictOpt = function(grid,row){
        $scope.dictClsPkid = row.entity.dictClsPkid;

    }

    /**
    * 点击删除按钮
    * @param grid grid对象
    * @param row 要删除的行
    */
    $scope.delDictCls = function(grid,row){
        createDialog({
            id : 'delDialog',
            type : '4',
            message : '确定删除吗？',
            success : {label:'确定',fn:function(){
                var t = DictClsService.delete(row.entity);
                t.then(function(data){
                    var inx = gridService.getRowIndex('dictClsPkid',row.entity.dictClsPkid,$scope.gridOptions.data);
                    $scope.gridOptions.data.splice(inx,1);
                });
            }}
        });
    }

    /**
    * 获取品牌分页信息
    * @param pageObj
    */
    $scope.getDictClsByPage = function(pageObj){
        var promise = DictClsService.queryByPage(pageObj); // 同步调用，获得承诺接口
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
            $scope.getDictClsByPage(pageObj);
        });
    };


    /**
    * 初始化grid
    */
    $scope.getDictClsByPage({currentPage:1,pageSize:$scope.gridOptions.paginationPageSize,firstRow:0,lastRow:$scope.gridOptions.paginationPageSize});

    /**
    * 弹出品牌信息弹出框
    */
    $scope.open = function (transData) {
        createDialog({
            id: 'dictClsDialog',
            templateUrl : 'tpl/dictClsPopup.html',
            title: '字典类别表',
            backdrop: true,
            data : angular.copy(transData),
            success: {label: '确定', fn: function(scope) {
                //新增
                if(scope.transData.operator==='1'){
                //提交数据
                    var t = DictClsService.insert(scope.transData);
                    //将提交成功的数据插入grid
                    t.then(function(data){
                        $scope.gridOptions.data.push(data);
                    });
                }
                //修改
                else{
                    var t = DictClsService.update(scope.transData);
                    t.then(function(data){
                        var idx = gridService.getRowIndex('dictClsPkid',data.dictClsPkid,$scope.gridOptions.data);
                        $scope.gridOptions.data.splice(idx,1,data);
                    })
                }
            }},
            cancel : {label:'取消',fn:function(){

            }}
        });
    };
}]);

app.controller('DictClsPopupCtrl',['$scope','createDialog','gridService','DictClsService','DictOptService',function($scope,createDialog,gridService,DictClsService,DictOptService){

    $scope.isDictOptVisible = ($scope.transData.operator==='1'?false:true);
    console.log($scope.transData);
    $scope.getDictOpts = function(){
        var promise = DictClsService.getOptsByClsCode($scope.transData.dictClsCode);
        promise.then(function(data) {
            $scope.gridOptions.data = data[0].dict_opts
        }, function(data) {  // 处理错误 .reject
            //$scope.myData = {error: '用户不存在！'};
        });
    }();
    //grid配置
    $scope.gridOptions = {
        paginationPageSizes: [20, 50, 100],
        paginationPageSize: 20,
        useExternalPagination: true,
        columnDefs: [
            { field : 'dictOptCode', name:'字典项目编码' },
            { field : 'dictOptValue', name:'字典项目值' },
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
            operator : '1',
            dictClsPkid : $scope.transData.dictClsPkid
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
        //$scope.gridApi.pagination.on.paginationChanged( $scope, function( currentPage,pageSize,pageObj){
        //    $scope.getDictOptByPage(pageObj);
        //});
    };


    /**
     * 初始化grid
     */
    //$scope.getDictOptByPage({currentPage:1,pageSize:$scope.gridOptions.paginationPageSize,firstRow:0,lastRow:$scope.gridOptions.paginationPageSize});

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
                        var idx = gridService.getRowIndex('dict_opt_pkid',data.pkid,$scope.gridOptions.data);
                        $scope.gridOptions.data.splice(idx,1,data);
                    })
                }
            }},
            cancel : {label:'取消',fn:function(){

            }}
        });
    };
}]);