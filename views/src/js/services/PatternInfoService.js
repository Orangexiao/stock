/**
 * Created by xiaohongju on 15/9/13.
 */
app.factory('PatternInfoService',['$rootScope','$q','$http',function($rootScope,$q,$http){
    return {
        query : function() {
            var deferred = $q.defer();
            $http({method: 'POST', url: '/getPatternInfoList.do'}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        queryByPage : function(pageObject) {
            var deferred = $q.defer();
            $http({method: 'post', url: '/getPatternInfoByPage.do',data:{'pageObj':pageObject}}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        update : function(patternInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/updPatternInfo.do',data:{'patternInfoObj':patternInfoObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
            return deferred.promise;
        },
        insert : function(patternInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/insPatternInfo.do',data:{'patternInfoObj': patternInfoObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
                .error(function(data,status,headers,config){
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        delete : function(patternInfoObj){
            var deferred = $q.defer();
            $http({method:'post',url:'/delPatternInfo.do',data:{'patternInfoObj': patternInfoObj}}).
                success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
                .error(function(data,status,headers,config){
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        queryByProductPkid : function(productInfoPkid){
            var deferred = $q.defer();
            $http({method:'post',url:'/getPatternByProductPkid.do',data:{'productInfoPkid':productInfoPkid}})
                .success(function(data,status,headers,config){
                    deferred.resolve(data);
                })
                .error(function(data,status,headers,config){
                    deferred.reject(data);
                })
            return deferred.promise;
        }
    }
}])