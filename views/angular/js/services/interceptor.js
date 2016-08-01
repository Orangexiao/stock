/**
 * Created by xiaohongju on 15/7/16.
 */
app.factory('myInterceptor', ['$localStorage', '$rootScope','$q', function ($localStorage, $rootScope,$q) {

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
                $rootScope.$broadcast('errorOccur', response.data);
            }
            return response;
        },
        responseError : function(response){
            $rootScope.$broadcast('errorOccur', response.data);
            return $q.reject(response);
        }
    }
    return appInterceptor;
}]);