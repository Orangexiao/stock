/**
 * Created by xiaohongju on 15/9/13.
 */
app.factory('OperatorRoleService',['$rootScope','$q','$http',function($rootScope,$q,$http){
    return {
        query : function() {
            var deferred = $q.defer();
            $http({method: 'POST', url: '/getOperatorRoleList.do'}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        queryByPage : function(pageObject) {
            var deferred = $q.defer();
            $http({method: 'post', url: '/getOperatorRoleByPage.do',data:{'pageObj':pageObject}}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        update : function(operatorRoleObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/updOperatorRole.do',data:{'operatorRoleObj':operatorRoleObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
            return deferred.promise;
        },
        insert : function(operatorRoleObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/insOperatorRole.do',data:{'operatorRoleObj': operatorRoleObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
                .error(function(data,status,headers,config){
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        delete : function(operatorRoleObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/delOperatorRole.do',data:{'operatorRoleObj': operatorRoleObj}}).
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