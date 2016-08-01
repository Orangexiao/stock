/**
 * Created by xiaohongju on 15/9/13.
 */
app.factory('StockInfoService',['$rootScope','$q','$http',function($rootScope,$q,$http){
    return {
        query : function() {
            var deferred = $q.defer();
            $http({method: 'POST', url: '/getStockInfoList.do'}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        queryByPage : function(pageObject) {
            var deferred = $q.defer();
            $http({method: 'post', url: '/getStockInfoByPage.do',data:{'pageObj':pageObject}}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        update : function(stockInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/updStockInfo.do',data:{'stockInfoObj':stockInfoObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
            return deferred.promise;
        },
        insert : function(stockInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/insStockInfo.do',data:{'stockInfoObj': stockInfoObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
                .error(function(data,status,headers,config){
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        delete : function(stockInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/delStockInfo.do',data:{'stockInfoObj': stockInfoObj}}).
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