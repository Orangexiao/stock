/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('PaymentInfoController',['$scope','$http','PaymentInfoService','gridService','createDialog',function($scope,$http,PaymentInfoService,gridService,createDialog){
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
        
        
        { field : 'paymentInfoPkid', name:'收款信息表主键ID' ,visible:false},
        
        { field : 'orderInfoPkid', name:'订单信息表主键ID' },
        
        { field : 'payTypeCode', name:'收款方式编码' },
        
        { field : 'payType', name:'收款方式' },
        
        { field : 'payAmount', name:'收款金额' },
        
        { field : 'payNo', name:'收款号' },
        
        
        { name: '操作',
            cellTemplate:'<button class="btn btn-sm btn-primary" ng-click="grid.appScope.updPaymentInfo(grid,row)">修改</button><button class="btn btn-sm btn-light" ng-click="grid.appScope.delPaymentInfo(grid,row)">删除</button>' }
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
    $scope.insPaymentInfo= function(){
        $scope.paymentInfo = {
            operator : '1'
        }
        $scope.open( $scope.paymentInfo);
    }

    /**
    * 点击修改按钮
    * @param grid grid对象
    * @param row 要修改的行
    */
    $scope.updPaymentInfo =  function(grid,row){
        $scope.paymentInfo = row.entity;
        $scope.paymentInfo.operator = '2';
        $scope.open($scope.paymentInfo);
    };

    /**
    * 点击删除按钮
    * @param grid grid对象
    * @param row 要删除的行
    */
    $scope.delPaymentInfo = function(row){
        createDialog({
            id : 'delDialog',
            type : '4',
            message : '确定删除吗？',
            success : {label:'确定',fn:function(){
                var t = PaymentInfoService.delete(row);
                t.then(function(data){
                    var inx = gridService.getRowIndex('paymentInfoPkid',row.entity.paymentInfoPkid,$scope.gridOptions.data);
                    $scope.gridOptions.data.splice(inx,1);
                });
            }}
        });
    }

    /**
    * 获取品牌分页信息
    * @param pageObj
    */
    $scope.getPaymentInfoByPage = function(pageObj){
        var promise = PaymentInfoService.queryByPage(pageObj); // 同步调用，获得承诺接口
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
            $scope.getPaymentInfoByPage(pageObj);
        });
    };


    /**
    * 初始化grid
    */
    $scope.getPaymentInfoByPage({currentPage:1,pageSize:$scope.gridOptions.paginationPageSize,firstRow:0,lastRow:$scope.gridOptions.paginationPageSize});

    /**
    * 弹出品牌信息弹出框
    */
    $scope.open = function (transData) {
        createDialog({
            id: 'paymentInfoDialog',
            templateUrl : 'tpl/paymentInfoPopup.html',
            title: '收款信息表',
            backdrop: true,
            data : angular.copy(transData),
            success: {label: '确定', fn: function(scope) {
                //新增
                if(scope.transData.operator==='1'){
                //提交数据
                    var t = PaymentInfoService.insert(scope.transData);
                    //将提交成功的数据插入grid
                    t.then(function(data){
                        $scope.gridOptions.data.push(data);
                    });
                }
                //修改
                else{
                    var t = PaymentInfoService.update(scope.transData);
                    t.then(function(data){
                        var idx = gridService.getRowIndex('pkid',data.pkid,$scope.gridOptions.data);
                        $scope.gridOptions.data.splice(idx,1,data);
                    })
                }
            }},
            cancel : {label:'取消',fn:function(){

            }}
        });
    };
}]);

app.controller('PaymentInfoPopupCtrl',['$scope','createDialog','DictClsService','OperatorInfoService',function($scope,createDialog,DictClsService,OperatorInfoService){
    $scope.status = {
        payDateOpen : false
    }

    $scope.employerList = [];

    $scope.getEmployerList = function(){
        OperatorInfoService.query().then(function(data){
            $scope.employerList = data;
        })
    }();

    $scope.payTypeList = [];
    var payTypePromise =  DictClsService.getOptsByClsCode('05');
    payTypePromise.then(function(data){
        $scope.payTypeList = data[0].dict_opts;
    });

    $scope.selectPayType = function(model){
        $scope.transData.payType = model.dictOptValue;
    }

    $scope.setPayDateOpen = function($event){
        $scope.status.payDateOpen = true;
    }

    $scope.selectReceiver = function(item){
        $scope.transData.receiver = item.operatorName;
    }
}]);