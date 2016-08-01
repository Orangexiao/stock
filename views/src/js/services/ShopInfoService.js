/**
 * Created by xiaohongju on 15/9/13.
 */
app.factory('ShopInfoService',['$rootScope','$q','$http',function($rootScope,$q,$http){
    return {
        query : function() {
            var deferred = $q.defer();
            $http({method: 'POST', url: '/getShopInfoList.do'}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        queryByPage : function(pageObject) {
            var deferred = $q.defer();
            $http({method: 'post', url: '/getShopInfoByPage.do',data:{'pageObj':pageObject}}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        update : function(shopInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/updShopInfo.do',data:{'shopInfoObj':shopInfoObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
            return deferred.promise;
        },
        insert : function(shopInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/insShopInfo.do',data:{'shopInfoObj': shopInfoObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
                .error(function(data,status,headers,config){
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        delete : function(shopInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/delShopInfo.do',data:{'shopInfoObj': shopInfoObj}}).
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