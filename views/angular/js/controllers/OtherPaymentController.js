/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('OtherPaymentController',['$scope','$http','OtherPaymentService','gridService','createDialog','PageObjectService','DictClsService',function($scope,$http,OtherPaymentService,gridService,createDialog,PageObjectService,DictClsService){
    $scope.otherPaymentList = [];
    $scope.pageObj = PageObjectService.getPageObject();

    /**
    * 点击追加按钮
    */
    $scope.insOtherPayment= function(){
        $scope.otherPayment = {
            operator : '1'
        }
        $scope.open( $scope.otherPayment);
    }

    /**
    * 点击修改按钮
    * @param grid grid对象
    * @param row 要修改的行
    */
    $scope.updOtherPayment =  function(row){
        $scope.otherPayment = row;
        $scope.otherPayment.operator = '2';
        $scope.open($scope.otherPayment);
    };

    /**
    * 点击删除按钮
    * @param grid grid对象
    * @param row 要删除的行
    */
    $scope.delOtherPayment = function(row){
        createDialog({
            id : 'delDialog',
            type : '4',
            message : '确定删除吗？',
            success : {label:'确定',fn:function(){
                var t = OtherPaymentService.delete(row);
                t.then(function(data){
                    var inx = gridService.getRowIndex('otherPaymentPkid',row.otherPaymentPkid,$scope.otherPaymentList);
                    $scope.otherPaymentList.splice(inx,1);
                });
            }}
        });
    }

    /**
    * 获取品牌分页信息
    * @param pageObj
    */
    $scope.getOtherPaymentByPage = function(pageObj){
        var promise = OtherPaymentService.queryByPage(pageObj); // 同步调用，获得承诺接口
        promise.then(function(data) {  // 调用承诺API获取数据 .resolve

            $scope.otherPaymentList = data.rows;
            $scope.pageObj.setTotalItems(data.count);
        }, function(data) {  // 处理错误 .reject
            $scope.myData = {error: '用户不存在！'};
        });
    };

    /**
    * 初始化grid
    */
    $scope.getOtherPaymentByPage($scope.pageObj);

    /**
    * 弹出品牌信息弹出框
    */
    $scope.open = function (transData) {
        createDialog({
            id: 'otherPaymentDialog',
            templateUrl : 'tpl/otherPaymentPopup.html',
            title: '其他收支信息表',
            backdrop: true,
            data : angular.copy(transData),
            success: {label: '确定', fn: function(scope) {
                //新增
                if(scope.transData.operator==='1'){
                //提交数据
                    var t = OtherPaymentService.insert(scope.transData);
                    //将提交成功的数据插入grid
                    t.then(function(data){
                        $scope.otherPaymentList.push(data);
                    });
                }
                //修改
                else{
                    var t = OtherPaymentService.update(scope.transData);
                    t.then(function(data){
                        var idx = gridService.getRowIndex('otherPaymentPkid',data.otherPaymentPkid,$scope.otherPaymentList);
                        $scope.otherPaymentList.splice(idx,1,data);
                    })
                }
            }},
            cancel : {label:'取消',fn:function(){

            }}
        });
    };
}]);

app.controller('OtherPaymentPopupCtrl',['$scope','DictClsService','OperatorInfoService',function($scope,DictClsService,OperatorInfoService){
    /**
     * 状态控制类
     * @type {{payDateOpen: boolean}}
     */
    $scope.status = {
        //控制收支日期选择框
        payDateOpen : false
    }
    /**
     * 点击收支日期选择按钮
     * @param $event
     */
    $scope.openPayDate = function($event){
        $scope.status.payDateOpen = true;
    }
    /**
     * 收支类型列表
     * @type {Array}
     */
    $scope.payTypeList = [];
    /**
     * 获取收支类型列表
     */
    var payTypePromise = DictClsService.getOptsByClsCode('07');
    payTypePromise.then(function(dataList){
        $scope.payTypeList = dataList[0].dict_opts;
    })
    /**
     * 收支类型下拉框变化
     * @param item 选中的项目
     * @param model 选中的值
     */
    $scope.onPaymentTypeChange = function(item){
        $scope.transData.paymentType = item.dictOptValue;
    }
    /**
     * 经办列表
     * @type {Array}
     */
    $scope.operatorList = [];
    var operatorPromise = OperatorInfoService.query();
    operatorPromise.then(function(dataList){
        $scope.operatorList = dataList;
    });

    $scope.onHandlerChange = function(item){
        $scope.transData.handler = item.operatorName;
    }

}]);