/**
 * Created by xiaohongju on 15/9/13.
 */
app.factory('OperatorInfoService',['$rootScope','$q','$http',function($rootScope,$q,$http){
    return {
        query : function() {
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
            $http({method: 'POST', url: '/getOperatorInfoList.do'}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
                }).
                error(function(data, status, headers, config) {
                    deferred.reject(data);   // 声明执行失败，即服务器返回错误
                });
            return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
        },
        queryByPage : function(pageObject) {
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
            $http({method: 'post', url: '/getOperatorInfoByPage.do',data:{'pageObj':pageObject}}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
                }).
                error(function(data, status, headers, config) {

                    deferred.reject(data);   // 声明执行失败，即服务器返回错误
                });
            return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
        },
        queryByOption : function(pageObject,whereClause){
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
            $http({method: 'post', url: '/queryOpByOpt.do',data:{'pageObj':pageObject,'whereClause':whereClause}}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
                }).
                error(function(data, status, headers, config) {
                    console.log(data);
                    deferred.reject(data);   // 声明执行失败，即服务器返回错误
                });
            return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
        },
        update : function(operatorInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/updOperatorInfo.do',data:{'operatorInfoObj':operatorInfoObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                }).
                error(function(data, status, headers, config){
                    deferred.reject(data);
                })
            return deferred.promise;
        },
        insert : function(operatorInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/insOperatorInfo.do',data:{'operatorInfoObj': operatorInfoObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
                .error(function(data,status,headers,config){
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        delete : function(operatorInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/delOperatorInfo.do',data:{'operatorInfoObj': operatorInfoObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
                .error(function(data,status,headers,config){
                    deferred.reject(data);
                });
            return deferred.promise;
            //return deferred.promise;
        },
        getOperatorInfoById : function(operatorInfoPkid){
            var deferred = $q.defer();
            $http({method:'post',url:'/getOperatorInfoById.do',data:{'operatorInfoPkid': operatorInfoPkid}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
                .error(function(data,status,headers,config){
                    deferred.reject(data);
                });
            return deferred.promise;
        }
    }
}])