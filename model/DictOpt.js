/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(sequelize,DataType){

return sequelize.define('dict_opt',{
    
        
        dictOptPkid : {
            
            primaryKey : true,
            unique : true,
            
            type : DataType.STRING,
            field : 'dict_opt_pkid'
        },
        
        dictClsPkid : {
            
            type : DataType.STRING,
            field : 'dict_cls_pkid'
        },
        
        dictOptCode : {
            
            type : DataType.STRING,
            field : 'dict_opt_code'
        },
        
        dictOptValue : {
            
            type : DataType.STRING,
            field : 'dict_opt_value'
        }
        
    }
    ,
    {
        freezeTableName: true, // Model tableName will be the same as the model name
        timestamps : false
    }
    );
}