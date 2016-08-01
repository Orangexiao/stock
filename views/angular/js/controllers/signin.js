'use strict';

/* Controllers */
  // signin controller
app.controller('SigninFormController', ['$scope', '$http', '$state', '$localStorage','$rootScope', function($scope, $http, $state, $localStorage,$rootScope) {
    $scope.user = {};
    $scope.authError = null;
    $scope.login = function() {
      $scope.authError = null;
      //提交用户名密码
      $http.post('/login.do', {userName: $scope.user.userName, password: $scope.user.password})
      .then(
          function(response) {
              //返回的数据中没用用户信息
              if ( !response.data.token ) {
                $scope.authError = '用户名或密码错误';
              }else{
                  var mills = new Date();
                  $localStorage.token = response.data.token;
                  $localStorage.timestamp = mills.getMilliseconds();
                  $localStorage.operator = response.data.operator;
                  $rootScope.operator = response.data.operator;
                  $scope.$emit('loginSuccess');
                  $state.go('app.dashboard-v1');
              }
            }, function(x) {
                 $scope.authError = '服务器异常，请与管理员联系';
          });
    };
  }])
;