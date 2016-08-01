/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('OperatorInfoController', ['$scope', '$http', 'OperatorInfoService', 'gridService', 'createDialog', 'DictClsService', 'PageObjectService', 'toaster', function ($scope, $http, OperatorInfoService, gridService, createDialog, DictClsService, PageObjectService, toaster) {
    $scope.operatorInfoList = [];
    $scope.pageObj = PageObjectService.getPageObject();
    //查询条件
    $scope.whereClause = [{
        label: 'operatorInfo',
        content: ''
    }];

    $scope.simpleQuery = function () {
        var promise = OperatorInfoService.queryByOption($scope.pageObj, $scope.whereClause); // 同步调用，获得承诺接口
        promise.then(function (data) {  // 调用承诺API获取数据 .resolve
            $scope.operatorInfoList = data.rows;
            $scope.pageObj.totalItems = data.count;
        });
    }

    /**
     * 点击追加按钮
     */
    $scope.insOperatorInfo = function () {
        $scope.operatorInfo = {
            operator: '1',
            activeFlagCode: '0'
        }
        $scope.open($scope.operatorInfo);
    }

    /**
     * 点击修改按钮
     * @param grid grid对象
     * @param row 要修改的行
     */
    $scope.updOperatorInfo = function (row) {
        $scope.operatorInfo = row;
        $scope.operatorInfo.operator = '2';
        $scope.open($scope.operatorInfo);
    };

    /**
     * 点击删除按钮
     * @param grid grid对象
     * @param row 要删除的行
     */
    $scope.delOperatorInfo = function (row) {
        createDialog({
            id: 'delDialog',
            type: '4',
            message: '确定删除吗？',
            success: {
                label: '确定', fn: function () {
                    var t = OperatorInfoService.delete(row);
                    t.then(function (data) {
                        var inx = gridService.getRowIndex('operatorInfoPkid', row.operatorInfoPkid, $scope.operatorInfoList);
                        $scope.operatorInfoList.splice(inx, 1);
                        toaster.pop(
                            {
                                type: 'success',
                                title: '管理员信息删除成功！'
                            });
                    }).catch(function (err) {

                    });
                }
            }
        });
    }

    /**
     * 获取品牌分页信息
     * @param pageObj
     */
    $scope.getOperatorInfoByPage = function (pageObj) {
        var promise = OperatorInfoService.queryByPage(pageObj); // 同步调用，获得承诺接口
        promise.then(function (data) {  // 调用承诺API获取数据 .resolve
            $scope.operatorInfoList = data.rows;
            $scope.pageObj.setTotalItems(data.count);
        }, function (data) {  // 处理错误 .reject
            $scope.myData = {error: '用户不存在！'};
        });
    };

    $scope.getOperatorInfoByPage($scope.pageObj);
    /**
     /**
     * 弹出品牌信息弹出框
     */
    $scope.open = function (transData) {
        createDialog({
            id: 'operatorInfoDialog',
            templateUrl: 'tpl/operatorInfoPopup.html',
            title: '管理员信息表',
            backdrop: true,
            data: angular.copy(transData),
            success: {
                label: '确定', fn: function (scope) {
                    //新增
                    if (scope.transData.operator === '1') {
                        //提交数据
                        var t = OperatorInfoService.insert(scope.transData);
                        //将提交成功的数据插入grid
                        t.then(function (data) {
                            $scope.operatorInfoList.push(data);
                            toaster.pop('success', '管理员信息追加成功！');
                        });
                    }
                    //修改
                    else {
                        var t = OperatorInfoService.update(scope.transData);
                        t.then(function (data) {
                            var idx = gridService.getRowIndex('operatorInfoPkid', data.operatorInfoPkid, $scope.operatorInfoList);
                            $scope.operatorInfoList.splice(idx, 1, data);
                            toaster.pop(
                                {
                                    type: 'success',
                                    title: '管理员信息修改成功！'
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
}]);

app.controller('OperatorInfoPopupCtrl', ['$scope', 'createDialog', 'DictClsService', 'RoleInfoService', 'OperatorInfoService', '$q', function ($scope, createDialog, DictClsService, RoleInfoService, OperatorInfoService, $q) {
    $scope.transData.operatorRoleList = [];
    /**
     * 获取可用标识下拉列表
     * @returns {*}
     */
    var getActiveFlagList = function () {
        return DictClsService.getOptsByClsCode('01');
    };
    /**
     * 获取角色信息下拉列表
     * @returns {*}
     */
    var getRoleInfoList = function () {
        return RoleInfoService.query();
        //promise.then(function (roleInfoList) {
        //    $scope.roleInfoList = roleInfoList;
        //})
    };


    $q.all([getActiveFlagList(), getRoleInfoList()]).then(function (data) {
        $scope.activeFlagList = data[0][0].dict_opts;
        $scope.roleInfoList = data[1];
        if ($scope.transData.operator === '2') {
            OperatorInfoService.getOperatorInfoById($scope.transData.operatorInfoPkid)
                .then(function (operatorInfo) {
                    var roleInfos = operatorInfo.role_infos;
                    angular.extend($scope.transData, operatorInfo);
                    for (var i = 0; i < roleInfos.length; i++) {
                        $scope.transData.operatorRoleList.push(roleInfos[i].roleInfoPkid);
                    }
                });
        }


    });


    $scope.getSelected = function (item) {
        $scope.transData.activeFlag = item.dictOptValue;
    }
}]);