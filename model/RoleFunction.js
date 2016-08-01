/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(sequelize,DataType){

return sequelize.define('role_function',{
    
        
        roleFunctionPkid : {
            
            primaryKey : true,
            unique : true,
            
            type : DataType.STRING,
            field : 'role_function_pkid'
        },
        
        functionInfoPkid : {
            
            type : DataType.STRING,
            field : 'function_info_pkid'
        },
        
        roleInfoPkid : {
            
            type : DataType.STRING,
            field : 'role_info_pkid'
        }
        
    }
    ,
    {
        freezeTableName: true, // Model tableName will be the same as the model name
        timestamps : false
    }
    );
}