/**
 * Created by xiaohongju on 15/9/13.
 */
app.factory('ProductInfoService',['$rootScope','$q','$http',function($rootScope,$q,$http){
    return {
        query : function() {
            var deferred = $q.defer();
            $http({method: 'POST', url: '/getProductInfoList.do'}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        queryByPage : function(pageObject,whereClause) {
            var deferred = $q.defer();
            $http({method: 'post', url: '/getProductInfoByPage.do',data:{'pageObj':pageObject,'whereClause':whereClause||''}}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        update : function(productInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/updProductInfo.do',data:{'productInfoObj':productInfoObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
            return deferred.promise;
        },
        insert : function(productInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/insProductInfo.do',data:{'productInfoObj': productInfoObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
                .error(function(data,status,headers,config){
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        delete : function(productInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/delProductInfo.do',data:{'productInfoObj': productInfoObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
                .error(function(data,status,headers,config){
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        procProduct : function(productInfoObj){
            var deffered = $q.defer();
            $http({method:'post',url:'procProduct.do',data:{'productInfoObj' : productInfoObj}})
                .success(function(data){
                    deffered.resolve(data);
                })
                .error(function(data){
                    deffered.resolve(data);
                })
            return deffered.promise;
        },
        importProudct : function(platformCode,url){
            var deferred = $q.defer();
            $http({method:'post',url:'/importProduct.do',data:{'platformCode':platformCode,'url':url}})
                .success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
                .error(function(data,status,headers,config){
                    deferred.reject(data);
                });
            return deferred.promise;
        }
    }
}])