/**
 * Created by xiaohongju on 15/9/13.
 */
app.factory('ShopProductInfoService',['$rootScope','$q','$http',function($rootScope,$q,$http){
    return {
        query : function() {
            var deferred = $q.defer();
            $http({method: 'POST', url: '/getShopProductInfoList.do'}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        queryByPage : function(pageObject) {
            var deferred = $q.defer();
            $http({method: 'post', url: '/getShopProductInfoByPage.do',data:{'pageObj':pageObject}}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        update : function(shopProductInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/updShopProductInfo.do',data:{'shopProductInfoObj':shopProductInfoObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
            return deferred.promise;
        },
        insert : function(shopProductInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/insShopProductInfo.do',data:{'shopProductInfoObj': shopProductInfoObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
                .error(function(data,status,headers,config){
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        delete : function(shopProductInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/delShopProductInfo.do',data:{'shopProductInfoObj': shopProductInfoObj}}).
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