/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('SerialInfoController',['$scope','$http','SerialInfoService','gridService','createDialog','PageObjectService',function($scope,$http,SerialInfoService,gridService,createDialog,PageObjectService){
    $scope.serialInfoList = [];
    $scope.pageObj = PageObjectService.getPageObject();
    /**
    * 点击追加按钮
    */
    $scope.insSerialInfo= function(){
        $scope.serialInfo = {
            operator : '1'
        }
        $scope.open( $scope.serialInfo);
    }

    /**
    * 点击修改按钮
    * @param grid grid对象
    * @param row 要修改的行
    */
    $scope.updSerialInfo =  function(row){
        $scope.serialInfo = row;
        $scope.serialInfo.operator = '2';
        $scope.open($scope.serialInfo);
    };

    /**
    * 点击删除按钮
    * @param grid grid对象
    * @param row 要删除的行
    */
    $scope.delSerialInfo = function(row){
        createDialog({
            id : 'delDialog',
            type : '4',
            message : '确定删除吗？',
            success : {label:'确定',fn:function(){
                var t = SerialInfoService.delete(row);
                t.then(function(data){
                    var inx = gridService.getRowIndex('serialInfoPkid',row.serialInfoPkid,$scope.serialInfoList);
                    $scope.serialInfoList.splice(inx,1);
                });
            }}
        });
    }

    /**
    * 获取品牌分页信息
    * @param pageObj
    */
    $scope.getSerialInfoByPage = function(pageObj){
        var promise = SerialInfoService.queryByPage(pageObj); // 同步调用，获得承诺接口
        promise.then(function(data) {  // 调用承诺API获取数据 .resolve

            $scope.serialInfoList = data.rows;
            $scope.pageObj.setTotalItems(data.count);
        }, function(data) {  // 处理错误 .reject
            $scope.myData = {error: '用户不存在！'};
        });
    };

    /**
    * 初始化grid
    */
    $scope.getSerialInfoByPage($scope.pageObj);

    /**
    * 弹出品牌信息弹出框
    */
    $scope.open = function (transData) {
        createDialog({
            id: 'serialInfoDialog',
            templateUrl : 'tpl/serialInfoPopup.html',
            title: '序列管理表',
            backdrop: true,
            data : angular.copy(transData),
            success: {label: '确定', fn: function(scope) {
                //新增
                if(scope.transData.operator==='1'){
                //提交数据
                    var t = SerialInfoService.insert(scope.transData);
                    //将提交成功的数据插入grid
                    t.then(function(data){
                        $scope.serialInfoList.push(data);
                    });
                }
                //修改
                else{
                    var t = SerialInfoService.update(scope.transData);
                    t.then(function(data){
                        var idx = gridService.getRowIndex('serialInfoPkid',data.serialInfoPkid,$scope.serialInfoList);
                        $scope.serialInfoList.splice(idx,1,data);
                    })
                }
            }},
            cancel : {label:'取消',fn:function(){

            }}
        });
    };
}]);

app.controller('SerialInfoPopupCtrl',['$scope','createDialog',function($scope,createDialog){

}]);