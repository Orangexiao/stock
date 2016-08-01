/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(sequelize,DataType){

return sequelize.define('function_info',{
    
        
        functionInfoPkid : {
            
            primaryKey : true,
            unique : true,
            
            type : DataType.STRING,
            field : 'function_info_pkid'
        },
        
        functionName : {
            
            type : DataType.STRING,
            field : 'function_name'
        },
        
        functionId : {
            
            type : DataType.STRING,
            field : 'function_id'
        },
        
        activeFlagCode : {
            
            type : DataType.STRING,
            field : 'active_flag_code'
        },
        
        activeFlag : {
            
            type : DataType.STRING,
            field : 'active_flag'
        },
        
        displayOrder : {
            
            type : DataType.INTEGER,
            field : 'display_order'
        },
        
        parentFunction : {
            
            type : DataType.STRING,
            field : 'parent_function'
        },
        
        url : {
            
            type : DataType.STRING,
            field : 'url'
        },
        
        style : {
            
            type : DataType.STRING,
            field : 'style'
        },
        
        functionTypeCode : {
            
            type : DataType.STRING,
            field : 'function_type_code'
        },
        
        functionType : {
            
            type : DataType.STRING,
            field : 'function_type'
        }
        
    }
    ,
    {
        freezeTableName: true, // Model tableName will be the same as the model name
        timestamps : false
    }
    );
}