/**
 * Created by xiaohongju on 15/9/13.
 */
app.factory('OrderInfoService',['$rootScope','$q','$http',function($rootScope,$q,$http){
    return {
        query : function() {
            var deferred = $q.defer();
            $http({method: 'POST', url: '/getOrderInfoList.do'}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        queryByPage : function(pageObject) {
            var deferred = $q.defer();
            $http({method: 'post', url: '/getOrderInfoByPage.do',data:{'pageObj':pageObject}}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        update : function(orderInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/updOrderInfo.do',data:{'orderInfoObj':orderInfoObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
            return deferred.promise;
        },
        insert : function(orderInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/insOrderInfo.do',data:{'orderInfoObj': orderInfoObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
                .error(function(data,status,headers,config){
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        delete : function(orderInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/delOrderInfo.do',data:{'orderInfoObj': orderInfoObj}}).
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