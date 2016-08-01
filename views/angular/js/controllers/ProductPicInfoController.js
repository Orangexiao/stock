/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('ProductPicInfoController',['$scope','$http','ProductPicInfoService','gridService','createDialog',function($scope,$http,ProductPicInfoService,gridService,createDialog){
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
        
        
        { field : 'productPicPkid', name:'产品图片信息表主键ID' },
        
        { field : 'productInfoPkid', name:'产品信息表主键ID' },
        
        { field : 'picPath', name:'图片地址' },
        
        { field : 'picComment', name:'图片说明' },
        
        { field : 'displayOrder', name:'显示顺序' },
        
        { field : 'activeFlag', name:'可用标识' },
        
        
        { name:'是否可用',
            cellTemplate : '<span>{{grid.appScope.transActiveFlag(grid,row)}}</span>'
        },
        { name: '操作',
            cellTemplate:'<button class="btn btn-sm btn-primary" ng-click="grid.appScope.updProductPicInfo(grid,row)">修改</button><button class="btn btn-sm btn-light" ng-click="grid.appScope.delProductPicInfo(grid,row)">删除</button>' }
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
    $scope.insProductPicInfo= function(){
        $scope.productPicInfo = {
            operator : '1'
        }
        $scope.open( $scope.productPicInfo);
    }

    /**
    * 点击修改按钮
    * @param grid grid对象
    * @param row 要修改的行
    */
    $scope.updProductPicInfo =  function(grid,row){
        $scope.productPicInfo = row.entity;
        $scope.productPicInfo.operator = '2';
        $scope.open($scope.productPicInfo);
    };

    /**
    * 点击删除按钮
    * @param grid grid对象
    * @param row 要删除的行
    */
    $scope.delProductPicInfo = function(grid,row){
        createDialog({
            id : 'delDialog',
            type : '4',
            message : '确定删除吗？',
            success : {label:'确定',fn:function(){
                var t = ProductPicInfoService.delete(row.entity);
                t.then(function(data){
                    var inx = gridService.getRowIndex('productPicInfoPkid',row.entity.productPicInfoPkid,$scope.gridOptions.data);
                    $scope.gridOptions.data.splice(inx,1);
                });
            }}
        });
    }

    /**
    * 获取品牌分页信息
    * @param pageObj
    */
    $scope.getProductPicInfoByPage = function(pageObj){
        var promise = ProductPicInfoService.queryByPage(pageObj); // 同步调用，获得承诺接口
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
            $scope.getProductPicInfoByPage(pageObj);
        });
    };


    /**
    * 初始化grid
    */
    $scope.getProductPicInfoByPage({currentPage:1,pageSize:$scope.gridOptions.paginationPageSize,firstRow:0,lastRow:$scope.gridOptions.paginationPageSize});

    /**
    * 弹出品牌信息弹出框
    */
    $scope.open = function (transData) {
        createDialog({
            id: 'productPicInfoDialog',
            templateUrl : 'tpl/productPicInfoPopup.html',
            title: '产品图片信息表',
            backdrop: true,
            data : angular.copy(transData),
            success: {label: '确定', fn: function(scope) {
                //新增
                if(scope.transData.operator==='1'){
                //提交数据
                    var t = ProductPicInfoService.insert(scope.transData);
                    //将提交成功的数据插入grid
                    t.then(function(data){
                        $scope.gridOptions.data.push(data);
                    });
                }
                //修改
                else{
                    var t = ProductPicInfoService.update(scope.transData);
                    t.then(function(data){
                        var idx = gridService.getRowIndex('productPicInfoPkid',data.productPicInfoPkid,$scope.gridOptions.data);
                        $scope.gridOptions.data.splice(idx,1,data);
                    })
                }
            }},
            cancel : {label:'取消',fn:function(){

            }}
        });
    };
}]);

app.controller('ProductPicInfoPopupCtrl',['$scope','createDialog',function($scope,createDialog){

}]);