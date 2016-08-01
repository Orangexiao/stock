/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('PatternInfoController',['$scope','$http','PatternInfoService','gridService','createDialog','PageObjectService',function($scope,$http,PatternInfoService,gridService,createDialog,PageObjectService){
    $scope.patternInfoList = [];
    $scope.pageObj = PageObjectService.getPageObject();
    /**
    * 点击追加按钮
    */
    $scope.insPatternInfo= function(){
        $scope.patternInfo = {
            operator : '1'
        }
        $scope.open( $scope.patternInfo);
    }

    /**
    * 点击修改按钮
    * @param grid grid对象
    * @param row 要修改的行
    */
    $scope.updPatternInfo =  function(row,idx){
        $scope.patternInfo = row;
        $scope.patternInfo.operator = '2';
        $scope.patternInfo.index = idx;
        $scope.open($scope.patternInfo);
    };

    /**
    * 点击删除按钮
    * @param grid grid对象
    * @param row 要删除的行
    */
    $scope.delPatternInfo = function(row,idx){
        createDialog({
            id : 'delDialog',
            type : '4',
            message : '确定删除吗？',
            success : {label:'确定',fn:function(){
                var t = PatternInfoService.delete(row);
                t.then(function(data){
                    $scope.patternInfoList.splice(idx,1);
                });
            }}
        });
    }

    $scope.onPageChange = function () {
        $scope.pageObj.recount();
        $scope.getPatternInfoByPage($scope.pageObj);
    }

    /**
    * 获取商品规格信息表分页信息
    * @param pageObj
    */
    $scope.getPatternInfoByPage = function(pageObj){
        var promise = PatternInfoService.queryByPage(pageObj); // 同步调用，获得承诺接口
        promise.then(function(data) {  // 调用承诺API获取数据 .resolve

            $scope.patternInfoList = data.rows;
            $scope.pageObj.setTotalItems(data.count);
        }, function(data) {  // 处理错误 .reject
            $scope.myData = {error: '用户不存在！'};
        });
    };

    /**
    * 初始化grid
    */
    $scope.getPatternInfoByPage($scope.pageObj);

    /**
    * 弹出商品规格信息表信息弹出框
    */
    $scope.open = function (transData) {
        createDialog({
            id: 'patternInfoDialog',
            templateUrl : 'tpl/patternInfoPopup.html',
            title: '商品规格信息表',
            backdrop: true,
            data : angular.copy(transData),
            success: {label: '确定', fn: function(scope) {
                //新增
                if(scope.transData.operator==='1'){
                //提交数据
                    var t = PatternInfoService.insert(scope.transData);
                    //将提交成功的数据插入grid
                    t.then(function(data){
                        $scope.patternInfoList.push(data);
                    });
                }
                //修改
                else{
                    var t = PatternInfoService.update(scope.transData);
                    t.then(function(data){
                        var idx = scope.transData.idx;
                        $scope.patternInfoList.splice(idx,1,data);
                    })
                }
            }},
            cancel : {label:'取消',fn:function(){

            }}
        });
    };
}]);

app.controller('PatternInfoPopupCtrl',['$scope',function($scope){

}]);