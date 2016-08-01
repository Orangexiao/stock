/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(sequelize,DataType){

return sequelize.define('dict_cls',{
    
        
        dictClsPkid : {
            
            primaryKey : true,
            unique : true,
            
            type : DataType.STRING,
            field : 'dict_cls_pkid'
        },
        
        dictClsCode : {
            
            type : DataType.STRING,
            field : 'dict_cls_code'
        },
        
        dictClsName : {
            
            type : DataType.STRING,
            field : 'dict_cls_name'
        }
        
    }
    ,
    {
        freezeTableName: true, // Model tableName will be the same as the model name
        timestamps : false
    }
    );
}