/**
 * Created by xiaohongju on 15/9/13.
 */
app.factory('OrderProductService',['$rootScope','$q','$http',function($rootScope,$q,$http){
    return {
        query : function() {
            var deferred = $q.defer();
            $http({method: 'POST', url: '/getOrderProductList.do'}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        queryByPage : function(pageObject) {
            var deferred = $q.defer();
            $http({method: 'post', url: '/getOrderProductByPage.do',data:{'pageObj':pageObject}}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        update : function(orderProductObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/updOrderProduct.do',data:{'orderProductObj':orderProductObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
            return deferred.promise;
        },
        insert : function(orderProductObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/insOrderProduct.do',data:{'orderProductObj': orderProductObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
                .error(function(data,status,headers,config){
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        delete : function(orderProductObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/delOrderProduct.do',data:{'orderProductObj': orderProductObj}}).
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