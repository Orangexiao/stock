/**
 * Created by xiaohongju on 15/9/13.
 */
app.controller('ChildInfoController',['$scope','$http','ChildInfoService','gridService','createDialog',function($scope,$http,ChildInfoService,gridService,createDialog){

}]);

app.controller('ChildInfoPopupCtrl',['$scope','createDialog','DictClsService',function($scope,createDialog,DictClsService){

    $scope.sexualList = [];
    var orderStatusPromise = DictClsService.getOptsByClsCode('04');
    orderStatusPromise.then(function(data){
        $scope.sexualList = data[0].dict_opts;
    });
    $scope.status = {
        isOpened : false
    }

    $scope.openBirthday = function($event){
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isOpened = true;
    }

    $scope.dateOptions = {
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[1];
}]);