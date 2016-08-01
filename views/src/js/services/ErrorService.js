/**
 * Created by xiaohongju on 16/3/3.
 */
app.factory('ErrorService',['$rootScope','$q',function(rootScope,$q){
    var self = this;
    this.errorCodeList = {
        '401' : '您没有足够的权限访问该页面',
        '403' : '服务器拒绝请求',
        '404' : '要访问的页面不存在',
        //'405' : '禁用请求中指定的方法',
        //'406' : '无法使用请求的内容特性响应请求的网页',
        //'407' : '需要代理授权',
        //'408' : '请求超时',
        //'409' : '服务器在完成请求时发生冲突',
        //'410' : '已删除',
        '500' : '内部服务器异常，请与管理员联系'
    };
    return {
        getErrorMessage : function(errorCode){
            return self.errorCodeList[errorCode];
        }
    }
}])