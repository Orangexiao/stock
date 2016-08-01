/**
 * Created by xiaohongju on 15/9/27.
 */
app.factory('validatorService',function($rootScope,$q){
    var self = this;
    this.messages = {
        required : '此项为必填项！',
        maxLength : '最大只能输入{0}个字符',
        minLength : '最少输入{0}个字符',
        url : 'url格式不正确'
    }

    return  {
        required : function(value){
            if(value===undefined || value===''){
                return false
            }else{
                return true;
            }
        },
        maxLength : function(value){
            return true;
        },
        userName : function(value){
            return true;
        },
        getMessage : function(key,params){
            var message = self.messages[key];
            if(params===undefined){
                return message;
            }else {
                for(var i=0;i<params.length;i++){
                    console.log(i);
                    message=message.replace(new RegExp("\\{"+i+"\\}","g"), params[i]);
                    return message;
                }
            }
        }
    }
});