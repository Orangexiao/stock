/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('OrderInfoController', ['$scope', '$http', 'OrderInfoService', 'gridService', 'createDialog', 'PageObjectService', 'toaster', function ($scope, $http, OrderInfoService, gridService, createDialog, PageObjectService, toaster) {
    $scope.opened = false;
    $scope.dt = new Date();
    $scope.pageObj = PageObjectService.getPageObject();
    $scope.selectDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    }
    $scope.orderInfoList = [];
    /**
     * 点击追加按钮
     */
    $scope.insOrderInfo = function () {
        $scope.orderInfo = {
            operator: '1'
        }
        $scope.open($scope.orderInfo);
    }

    /**
     * 点击修改按钮
     * @param grid grid对象
     * @param row 要修改的行
     */
    $scope.updOrderInfo = function (row) {
        $scope.orderInfo = row;
        $scope.orderInfo.operator = '2';
        $scope.open($scope.orderInfo);
    };

    /**
     * 点击删除按钮
     * @param grid grid对象
     * @param row 要删除的行
     */
    $scope.delOrderInfo = function (row) {
        createDialog({
            id: 'delDialog',
            type: '4',
            message: '确定删除吗？',
            success: {
                label: '确定', fn: function () {
                    var t = OrderInfoService.delete(row);
                    t.then(function (data) {
                        var inx = gridService.getRowIndex('orderInfoPkid', row.orderInfoPkid, $scope.orderInfoList);
                        $scope.orderInfoList.splice(inx, 1);
                        toaster.pop('success','订单删除成功');
                    });
                }
            }
        });
    }

    /**
     * 获取品牌分页信息
     * @param pageObj
     */
    $scope.getOrderInfoByPage = function (pageObj) {
        var promise = OrderInfoService.queryByPage(pageObj); // 同步调用，获得承诺接口
        promise.then(function (data) {  // 调用承诺API获取数据 .resolve
            $scope.orderInfoList = data.rows;
            $scope.pageObj.setTotalItems(data.count);
        }, function (data) {  // 处理错误 .reject
            $scope.myData = {error: '用户不存在！'};
        });
    };


    /**
     * 初始化grid
     */
    $scope.getOrderInfoByPage($scope.pageObj);

    /**
     * 弹出品牌信息弹出框
     */
    $scope.open = function (transData) {
        createDialog({
            id: 'orderInfoDialog',
            templateUrl: 'tpl/orderInfoPopup.html',
            title: '订单信息表',
            backdrop: true,
            width : 1200,
            data: angular.copy(transData),
            success: {
                label: '确定', fn: function (scope) {
                    //新增
                    if (scope.transData.operator === '1') {
                        //提交数据
                        var t = OrderInfoService.processOrderInfo(scope.transData);
                        //将提交成功的数据插入grid
                        t.then(function (data) {
                            $scope.orderInfoList.push(data);
                            toaster.pop('success','新建订单成功');
                        });
                    }
                    //修改
                    else {
                        var t = OrderInfoService.processOrderInfo(scope.transData);
                        t.then(function (data) {
                            var idx = gridService.getRowIndex('orderInfoPkid', data.orderInfoPkid, $scope.orderInfoList);
                            $scope.orderInfoList.splice(idx, 1, data);
                            toaster.pop('success','订单修改成功');
                        })
                    }
                }
            },
            cancel: {
                label: '取消', fn: function () {

                }
            }
        });
    };
}]);

app.controller('OrderInfoPopupCtrl', ['$scope', 'createDialog', 'UserInfoService', 'DictClsService', 'PlanInfoService', 'PaymentInfoService', 'gridService','OperatorInfoService', function ($scope, createDialog, UserInfoService, DictClsService, PlanInfoService, PaymentInfoService, gridService,OperatorInfoService) {
    $scope.status = {
        isOpened: false,
        dueTakeDayOpened: false,
        payDateOpen: false
    }
    //被删除的收款信息
    $scope.transData.delPaymentList = [];

    $scope.employerList = [];

    $scope.getEmployerList = function(){
       OperatorInfoService.query().then(function(data){
           $scope.employerList = data;
       })
    }();

    //用户选择列表
    $scope.userList = [];
    $scope.opened = false;
    var promise = UserInfoService.getUserList();
    promise.then(function (data) {
        $scope.userList = data;
    });

    $scope.payList = [];
    var payPromise = PaymentInfoService.query($scope.transData.orderInfoPkid);
    payPromise.then(function (data) {
        $scope.payList = data;
    })


    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };


    $scope.dateOptions = {
        startingDay: 1
    };

    $scope.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[1];


    $scope.setPayDateOpen = function ($event) {
        $scope.status.dayDateOpen = true;
    }

    $scope.openDueTakeDay = function ($event) {

        $scope.status.dueTakeDayOpened = true;
    }

    $scope.open = function ($event) {

        $scope.status.isOpened = true;
    }
    //订单状态下拉框
    $scope.orderStatusList = [];
    var orderStatusPromise = DictClsService.getOptsByClsCode('02');
    orderStatusPromise.then(function (data) {
        $scope.orderStatusList = data[0].dict_opts;
    });

    $scope.planInfoList = [];
    var planPromise = PlanInfoService.query();
    planPromise.then(function (planInfoList) {
        $scope.planInfoList = planInfoList;
    });

    $scope.onPlanChange = function (item, model) {
        $scope.transData.orderAmount = item.planPrice;
        $scope.transData.planName = item.planName;
    }


    $scope.$watch('transData.discountAmount', function (newVal, oldVal) {
        $scope.transData.discountRate = (newVal / $scope.transData.orderAmount).toFixed(2);
    })

    $scope.openPayment = function (transData) {
        createDialog({
            id: 'paymentInfoDialog',
            templateUrl: 'tpl/paymentInfoPopup.html',
            title: '收款信息表',
            backdrop: true,
            data: angular.copy(transData),
            success: {
                label: '确定', fn: function (scope) {
                    //新增
                    if (scope.transData.operator === '1') {
                        $scope.payList.push(scope.transData);
                        $scope.transData.payList = $scope.payList;
                    }
                    //修改
                    else {
                        //var idx = gridService.getRowIndex('paymentInfoPkid',scope.transData.paymentInfoPkid, $scope.payList);
                        var idx = scope.transData.index;
                        console.log(idx);
                        $scope.payList.splice(idx, 1, scope.transData);
                        $scope.transData.payList = $scope.payList;
                    }
                }
            },
            cancel: {
                label: '取消', fn: function () {

                }
            }
        });
    }

    /**
     * 点击追加按钮
     */
    $scope.insPaymentInfo = function () {
        $scope.paymentInfo = {
            operator: '1'
        }
        $scope.openPayment($scope.paymentInfo);
    }

    /**
     * 点击修改按钮
     * @param grid grid对象
     * @param row 要修改的行
     */
    $scope.updPaymentInfo = function (row,index) {
        $scope.paymentInfo = row;
        $scope.paymentInfo.operator = '2';
        $scope.paymentInfo.index = index;
        $scope.openPayment($scope.paymentInfo);
    };

    /**
     * 点击删除按钮
     * @param grid grid对象
     * @param row 要删除的行
     */
    $scope.delPaymentInfo = function (row) {
        createDialog({
            id: 'delDialog',
            type: '4',
            message: '确定删除吗？',
            success: {
                label: '确定', fn: function () {
                    var inx = $scope.payList.indexOf(row);
                    $scope.payList.splice(inx, 1);
                    if (row.paymentInfoPkid) {
                        $scope.transData.delPaymentList.push(row);
                    }

                }
            }
        });
    }

    $scope.selectMakeUp = function(item){
        $scope.transData.makeup = item.operatorName;
    }

    $scope.selectCamera = function(item){
        $scope.transData.camera = item.operatorName;
    }

    $scope.selectLeader = function(item){
        $scope.transData.leader = item.leader;
    }
}]);