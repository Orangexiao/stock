/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('AddressInfoController',['$scope','$http','AddressInfoService','gridService','createDialog',function($scope,$http,AddressInfoService,gridService,createDialog){
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
        
        
        { field : 'addressInfoPkid', name:'收货地址信息表主键ID' ,visible:false},
        
        { field : 'userInfoPkid', name:'用户信息表主键ID' },
        
        { field : 'address', name:'收货地址' },
        
        { field : 'city', name:'市' },
        
        { field : 'area', name:'区' },
        
        
        { name:'是否可用',
            cellTemplate : '<span>{{grid.appScope.transActiveFlag(grid,row)}}</span>'
        },
        { name: '操作',
            cellTemplate:'<button class="btn btn-sm btn-primary" ng-click="grid.appScope.updAddressInfo(grid,row)">修改</button><button class="btn btn-sm btn-light" ng-click="grid.appScope.delAddressInfo(grid,row)">删除</button>' }
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
    $scope.insAddressInfo= function(){
        $scope.addressInfo = {
            operator : '1'
        }
        $scope.open( $scope.addressInfo);
    }

    /**
    * 点击修改按钮
    * @param grid grid对象
    * @param row 要修改的行
    */
    $scope.updAddressInfo =  function(grid,row){
        $scope.addressInfo = row.entity;
        $scope.addressInfo.operator = '2';
        $scope.open($scope.addressInfo);
    };

    /**
    * 点击删除按钮
    * @param grid grid对象
    * @param row 要删除的行
    */
    $scope.delAddressInfo = function(grid,row){
        createDialog({
            id : 'delDialog',
            type : '4',
            message : '确定删除吗？',
            success : {label:'确定',fn:function(){
                var t = AddressInfoService.delete(row.entity);
                t.then(function(data){
                    var inx = gridService.getRowIndex('addressInfoPkid',row.entity.addressInfoPkid,$scope.gridOptions.data);
                    $scope.gridOptions.data.splice(inx,1);
                });
            }}
        });
    }

    /**
    * 获取品牌分页信息
    * @param pageObj
    */
    $scope.getAddressInfoByPage = function(pageObj){
        var promise = AddressInfoService.queryByPage(pageObj); // 同步调用，获得承诺接口
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
            $scope.getAddressInfoByPage(pageObj);
        });
    };


    /**
    * 初始化grid
    */
    $scope.getAddressInfoByPage({currentPage:1,pageSize:$scope.gridOptions.paginationPageSize,firstRow:0,lastRow:$scope.gridOptions.paginationPageSize});

    /**
    * 弹出品牌信息弹出框
    */
    $scope.open = function (transData) {
        createDialog({
            id: 'addressInfoDialog',
            templateUrl : 'tpl/addressInfoPopup.html',
            title: '收货地址管理表',
            backdrop: true,
            data : angular.copy(transData),
            success: {label: '确定', fn: function(scope) {
                //新增
                if(scope.transData.operator==='1'){
                //提交数据
                    var t = AddressInfoService.insert(scope.transData);
                    //将提交成功的数据插入grid
                    t.then(function(data){
                        $scope.gridOptions.data.push(data);
                    });
                }
                //修改
                else{
                    var t = AddressInfoService.update(scope.transData);
                    t.then(function(data){
                        var idx = gridService.getRowIndex('addressInfoPkid',data.addressInfoPkid,$scope.gridOptions.data);
                        $scope.gridOptions.data.splice(idx,1,data);
                    })
                }
            }},
            cancel : {label:'取消',fn:function(){

            }}
        });
    };
}]);

app.controller('AddressInfoPopupCtrl',['$scope','createDialog','RegionInfoService',function($scope,createDialog,RegionInfoService){
    $scope.region = {
        provinceList : [],
        cityList : [],
        districtList : []
    }

    var promise = RegionInfoService.getByParentId('1');
    promise.then(function(provinceList){
        $scope.region.provinceList = provinceList;
    });

    $scope.onProvinceChange = function(item,model){
        console.log();
        $scope.transData.province = item.regionName;
        $scope.getRegionList(model,'cityList');
    }

    $scope.onCityChange = function(item,model){
        $scope.transData.city = item.regionName;
        $scope.getRegionList(model,'districtList');
    }

    $scope.onDistrictChange = function(item,model){
        $scope.transData.district = item.regionName;
    }

    $scope.getRegionList = function(parentId,regionLevel){
        var promise = RegionInfoService.getByParentId(parentId);
        promise.then(function(list){
            $scope.region[regionLevel] = list;
        })
    }

    $scope.init = function(){
        if($scope.transData.operator === '2'){
            $scope.getRegionList($scope.transData.provinceId,'cityList');
            $scope.getRegionList($scope.transData.cityId,'districtList');
        }
    }

    $scope.init();

}]);