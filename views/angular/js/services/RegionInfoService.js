/**
 * Created by xiaohongju on 15/12/16.
 */
app.factory('RegionInfoService',['$rootScope','$q','$http',function($rootScope,$q,$http){
    return {
        getByParentId : function(parentId){
            var deferred = $q.defer();
            $http({method:'post',url:'/getByParentId.do',data:{'parentId': parentId}}).
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