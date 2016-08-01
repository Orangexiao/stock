/**
 * Created by xiaohongju on 15/9/13.
 */
app.factory('RoleFunctionService',['$rootScope','$q','$http',function($rootScope,$q,$http){
    return {
        query : function() {
            var deferred = $q.defer();
            $http({method: 'POST', url: '/getRoleFunctionList.do'}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        queryByPage : function(pageObject) {
            var deferred = $q.defer();
            $http({method: 'post', url: '/getRoleFunctionByPage.do',data:{'pageObj':pageObject}}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        update : function(roleFunctionObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/updRoleFunction.do',data:{'roleFunctionObj':roleFunctionObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
            return deferred.promise;
        },
        insert : function(roleFunctionObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/insRoleFunction.do',data:{'roleFunctionObj': roleFunctionObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
                .error(function(data,status,headers,config){
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        delete : function(roleFunctionObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/delRoleFunction.do',data:{'roleFunctionObj': roleFunctionObj}}).
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