/**
 * Created by xiaohongju on 15/9/13.
 */
app.factory('PaymentInfoService',['$rootScope','$q','$http',function($rootScope,$q,$http){
    return {
        query : function(orderInfoPkid) {
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
            $http({method: 'POST', url: '/getPaymentInfoList.do',data:{'orderInfoPkid':orderInfoPkid}}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
                }).
                error(function(data, status, headers, config) {
                    deferred.reject(data);   // 声明执行失败，即服务器返回错误
                });
            return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
        },
        queryByPage : function(pageObject) {
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
            $http({method: 'post', url: '/getPaymentInfoByPage.do',data:{'pageObj':pageObject}}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
                }).
                error(function(data, status, headers, config) {
                    deferred.reject(data);   // 声明执行失败，即服务器返回错误
                });
            return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
        },
        update : function(paymentInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/updPaymentInfo.do',data:{'paymentInfoObj':paymentInfoObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                }).
                error(function(data, status, headers, config){
                    deferred.reject(data);
                })
            return deferred.promise;
        },
        insert : function(paymentInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/insPaymentInfo.do',data:{'paymentInfoObj': paymentInfoObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
                .error(function(data,status,headers,config){
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        delete : function(paymentInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/delPaymentInfo.do',data:{'paymentInfoObj': paymentInfoObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
                .error(function(data,status,headers,config){
                    deferred.reject(data);
                });
            return deferred.promise;
            //return deferred.promise;
        }
    }
}])