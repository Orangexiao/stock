/**
 * Created by xiaohongju on 15/9/13.
 */
app.factory('FunctionInfoService',['$rootScope','$q','$http',function($rootScope,$q,$http){
    return {
        query : function() {
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
            $http({method: 'POST', url: '/getFunctionInfoList.do'}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
                });
            return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
        },
        queryByPage : function(pageObject) {
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
            $http({method: 'post', url: '/getFunctionInfoByPage.do',data:{'pageObj':pageObject}}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
                });
            return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
        },
        update : function(functionInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/updFunctionInfo.do',data:{'functionInfoObj':functionInfoObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        insert : function(functionInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/insFunctionInfo.do',data:{'functionInfoObj': functionInfoObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        delete : function(functionInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/delFunctionInfo.do',data:{'functionInfoObj': functionInfoObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                });
            return deferred.promise;
            //return deferred.promise;
        },
        getByOperator : function(){
            var deferred = $q.defer();
            $http({method : 'post', url : '/getAvailFunctions.do'})
                .success(function(data){
                    deferred.resolve(data)
                })
            return deferred.promise;
        }
    }
}])