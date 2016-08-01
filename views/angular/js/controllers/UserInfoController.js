/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('UserInfoController', ['$scope', '$http', 'UserInfoService', 'gridService', 'createDialog', 'PageObjectService', 'PayDetailService', 'toaster', function ($scope, $http, UserInfoService, gridService, createDialog, PageObjectService, PayDetailService, toaster) {
    $scope.pageObj = PageObjectService.getPageObject();
    $scope.queryOpt = '';

    $scope.userInfoList = [];
    $scope.totalItems = 6;
    $scope.currentPage = 1;
    $scope.topOffset = 245;
    $scope.itemsPerPage = 2;
    /**
     * 点击追加按钮
     */
    $scope.insUserInfo = function () {
        $scope.userInfo = {
            operator: '1'
        }
        $scope.open($scope.userInfo);
    }

    /**
     * 点击修改按钮
     * @param grid grid对象
     * @param row 要修改的行
     */
    $scope.updUserInfo = function (row) {
        $scope.userInfo = row;
        $scope.userInfo.operator = '2';
        $scope.open($scope.userInfo);
    };

    $scope.charge = function (row) {
        $scope.userInfo = row;
        //operator为‘1’的时候为充值
        $scope.userInfo.operator = '1'
        $scope.openCharge($scope.userInfo);
    }

    /**
     * 点击删除按钮
     * @param grid grid对象
     * @param row 要删除的行
     */
    $scope.delUserInfo = function (row) {
        createDialog({
            id: 'delDialog',
            type: '4',
            message: '确定删除吗？',
            success: {
                label: '确定', fn: function () {
                    var t = UserInfoService.delete(row);
                    t.then(function (data) {
                        //var inx = gridService.getRowIndex('userInfoPkid',row.entity.userInfoPkid,$scope.gridOptions.data);
                        var index = $scope.userInfoList.indexOf(row);
                        $scope.userInfoList.splice(index, 1);
                        toaster.pop(
                            {
                                type: 'success',
                                title: '用户信息删除成功！'
                            });
                        //$scope.gridOptions.data.splice(inx,1);
                    });
                }
            }
        });
    }

    /**
     * 获取品牌分页信息
     * @param pageObj
     */
    $scope.getUserInfoByPage = function (pageObj) {
        var promise = UserInfoService.queryByPage(pageObj); // 同步调用，获得承诺接口
        promise.then(function (data) {  // 调用承诺API获取数据 .resolve
            $scope.userInfoList = data.rows;
            $scope.pageObj.setTotalItems(data.count);
            console.log(pageObj);
        }, function (data) {  // 处理错误 .reject
            $scope.myData = {error: '用户不存在！'};
        });
    };

    $scope.onPageChange = function () {
        $scope.pageObj.recount();
        $scope.getUserInfoByPage($scope.pageObj);
    }


    $scope.queryByOpt = function () {
        $scope.pageObj.setData(angular.copy($scope.queryOpt));
        $scope.getUserInfoByPage($scope.pageObj);
    }

    /**
     * 初始化grid
     */
    $scope.getUserInfoByPage($scope.pageObj);

    /**
     * 弹出品牌信息弹出框
     */
    $scope.open = function (transData) {
        createDialog({
            id: 'userInfoDialog',
            templateUrl: 'tpl/userInfoPopup.html',
            title: '客户信息表',
            backdrop: true,
            data: angular.copy(transData),
            success: {
                label: '确定', fn: function (scope) {
                    console.log(scope.transData);
                    //新增
                    if (scope.transData.operator === '1') {
                        //提交数据
                        console.log(scope.transData);
                        var t = UserInfoService.processUserInfo(scope.transData);
                        //将提交成功的数据插入grid
                        t.then(function (data) {
                            $scope.userInfoList.push(data);
                            toaster.pop(
                                {
                                    type: 'success',
                                    title: '用户信息追加成功！'
                                });
                        });
                    }
                    //修改
                    else {
                        var t = UserInfoService.processUserInfo(scope.transData);
                        t.then(function (data) {
                            var idx = gridService.getRowIndex('userInfoPkid', data.userInfoPkid, $scope.userInfoList);
                            $scope.userInfoList.splice(idx, 1, data);
                            toaster.pop(
                                {
                                    type: 'success',
                                    title: '用户信息修改成功！'
                                });
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

    $scope.openCharge = function (transData) {
        createDialog({
            id: 'userInfoDialog',
            templateUrl: 'tpl/payDetailPopup.html',
            title: '充值',
            backdrop: true,
            data: angular.copy(transData),
            success: {
                label: '确定', fn: function (scope) {
                    var t = PayDetailService.insert(scope.transData);
                    t.then(function (userInfo) {
                        var idx = gridService.getRowIndex('userInfoPkid', userInfo.userInfoPkid, $scope.userInfoList);
                        $scope.userInfoList.splice(idx, 1, userInfo);
                        toaster.pop(
                            {
                                type: 'success',
                                title: '用户账户充值成功！'
                            });

                    })
                }
            },
            cancel: {
                label: '取消', fn: function () {

                }
            }
        });
    }
}]);

app.controller('UserInfoPopupCtrl', ['$scope', 'createDialog', 'ChildInfoService', 'gridService', 'AddressInfoService', function ($scope, createDialog, ChildInfoService, gridService, AddressInfoService) {
    //要删除的宝贝信息
    $scope.transData.delChildRows = [];
    //要删除的地址信息
    $scope.transData.delAddressRows = [];
    $scope.transData.childDataList = [];
    $scope.transData.addressDataList = [];
    $scope.childDataList = [];
    $scope.addressDataList = [];

    /**
     * 点击追加宝贝信息按钮
     */
    $scope.insChildInfo = function () {
        $scope.childInfo = {
            operator: '1'
        }
        $scope.openChildInfo($scope.childInfo);
    }

    /**
     * 点击追加收货地址按钮
     */
    $scope.insAddressInfo = function () {
        $scope.addressInfo = {
            operator: '1'
        }
        $scope.openAddressInfo($scope.addressInfo);
    }

    /**
     * 点击宝贝GRID的修改按钮
     * @param grid grid对象
     * @param row 要修改的行
     */
    $scope.updChildInfo = function (row) {
        $scope.childInfo = row;
        $scope.childInfo.operator = '2';
        $scope.openChildInfo($scope.childInfo);
    };

    /**
     * 点击更新地址GRID的修改按钮
     * @param grid grid对象
     * @param row 要修改的行
     */
    $scope.updAddressInfo = function (row) {
        $scope.addressInfo = row;
        $scope.addressInfo.operator = '2';
        $scope.openAddressInfo($scope.addressInfo);
    };

    /**
     * 点击地址grid的删除按钮
     * @param grid grid对象
     * @param row 要删除的行
     */
    $scope.delAddressInfo = function (row) {
        createDialog({
            id: 'delDialog',
            type: '4',
            message: '确定删除吗？',
            success: {
                label: '确定', fn: function () {
                    if (row.addressInfoPkid !== undefined && row.addressInfoPkid !== '') {
                        $scope.transData.delAddressRows.push(row);
                        var inx = gridService.getRowIndex('addressInfoPkid', row.addressInfoPkid, $scope.addressDataList);
                        $scope.addressDataList.splice(inx, 1);
                    }
                }
            }
        });
    }

    /**
     * 获取送货地址信息
     * @param pageObj
     */
    $scope.getAddressInfo = function () {
        if ($scope.transData.operator === '2') {
            var userInfoPkid = $scope.transData.userInfoPkid;
            var promise = AddressInfoService.getAddressInfoByUserPkid(userInfoPkid); // 同步调用，获得承诺接口
            promise.then(function (data) {  // 调用承诺API获取数据 .resolve
                $scope.transData.addressList = data;
                $scope.addressDataList = data;
            }, function (data) {  // 处理错误 .reject
                $scope.myData = {error: '用户不存在！'};
            });
        }
    };

    $scope.getAddressInfo();

    /**
     * 点击宝贝grid的删除按钮
     * @param grid grid对象
     * @param row 要删除的行
     */
    $scope.delChildInfo = function (row) {
        createDialog({
            id: 'delDialog',
            type: '4',
            message: '确定删除吗？',
            success: {
                label: '确定', fn: function () {
                    if (row.childInfoPkid !== undefined && row.childInfoPkid !== '') {
                        $scope.transData.delChildRows.push(row);
                        var inx = $scope.childDataList.indexOf(row);
                        $scope.childDataList.splice(inx, 1);
                    }
                }
            }
        });
    }

    /**
     * 获取宝贝信息信息
     * @param pageObj
     */
    $scope.getChildInfoByPage = function () {
        if ($scope.transData.operator === '2') {
            var userInfoPkid = $scope.transData.userInfoPkid;
            var promise = ChildInfoService.getByUserPkid(userInfoPkid); // 同步调用，获得承诺接口
            promise.then(function (data) {  // 调用承诺API获取数据 .resolve
                $scope.transData.childDataList = data;
                $scope.childDataList = data;
            }, function (data) {  // 处理错误 .reject
                $scope.myData = {error: '用户不存在！'};
            });
        }
    };


    /**
     * 初始化grid
     */
    $scope.getChildInfoByPage();

    /**
     * 弹出宝贝信息弹出框
     */
    $scope.openChildInfo = function (transData) {
        createDialog({
            id: 'childInfoDialog',
            templateUrl: 'tpl/childInfoPopup.html',
            title: '宝贝信息表',
            backdrop: true,
            data: angular.copy(transData),
            success: {
                label: '确定', fn: function (scope) {
                    //新增
                    if (scope.transData.operator === '1') {
                        //将提交成功的数据插入grid
                        $scope.childDataList.push(scope.transData);
                        $scope.transData.childDataList = $scope.childDataList;

                    }
                    //修改
                    else {
                        var idx = gridService.getRowIndex('childInfoPkid', scope.transData.childInfoPkid, $scope.childDataList);
                        $scope.childDataList.splice(idx, 1, scope.transData);
                    }
                }
            },
            cancel: {
                label: '取消', fn: function () {

                }
            }
        });
    };

    $scope.openAddressInfo = function (transData) {
        createDialog({
            id: 'addressInfoDialog',
            templateUrl: 'tpl/addressInfoPopup.html',
            title: '收货地址管理表',
            backdrop: true,
            data: angular.copy(transData),
            success: {
                label: '确定', fn: function (scope) {
                    //新增
                    if (scope.transData.operator === '1') {
                        //提交数据
                        $scope.addressDataList.push(scope.transData);
                        $scope.transData.addressDataList = $scope.addressDataList;
                    }
                    //修改
                    else {
                        var idx = gridService.getRowIndex('addressInfoPkid', scope.transData.addressInfoPkid, $scope.addressDataList);
                        $scope.addressDataList.splice(idx, 1, scope.transData);
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