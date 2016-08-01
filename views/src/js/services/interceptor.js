/**
 * Created by xiaohongju on 15/7/16.
 */
app.factory('myInterceptor', ['$localStorage', '$rootScope','$q','ErrorService',function ($localStorage, $rootScope,$q,ErrorService) {

    var appInterceptor = {
        request: function (config) {
            var token = $localStorage.token;
            if (token) {
                config.headers['token'] = token;
                var current = new Date();
                $localStorage.timestamp = current.getMilliseconds();
            }else{
            }
            return config;
        },
        response: function (response) {
            if (response && response.data.result && response.data.result === 'error') {
                $rootScope.$broadcast('errorOccur', response);
            }
            return response;
        },
        responseError : function(response){
            var errorMessage = ErrorService.getErrorMessage(response.status)||response.data;
            $rootScope.$broadcast('errorOccur', errorMessage);
            if(response.data.result && response.data.result==='timeOutError'){
                $rootScope.$broadcast('loginTimeout');
            }
            return $q.reject(response);
        }
    }
    return appInterceptor;
}]);