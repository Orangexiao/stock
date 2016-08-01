/**
 * Created by xiaohongju on 15/9/13.
 */
app.factory('StockProductService',['$rootScope','$q','$http',function($rootScope,$q,$http){
    return {
        query : function() {
            var deferred = $q.defer();
            $http({method: 'POST', url: '/getStockProductList.do'}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        queryByPage : function(pageObject) {
            var deferred = $q.defer();
            $http({method: 'post', url: '/getStockProductByPage.do',data:{'pageObj':pageObject}}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        update : function(stockProductObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/updStockProduct.do',data:{'stockProductObj':stockProductObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
            return deferred.promise;
        },
        insert : function(stockProductObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/insStockProduct.do',data:{'stockProductObj': stockProductObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
                .error(function(data,status,headers,config){
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        delete : function(stockProductObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/delStockProduct.do',data:{'stockProductObj': stockProductObj}}).
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