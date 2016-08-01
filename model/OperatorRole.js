/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(sequelize,DataType){

return sequelize.define('operator_role',{
    
        
        roleOperator : {
            
            type : DataType.STRING,
            field : 'role_operator'
        },
        
        operatorInfoPkid : {
            
            type : DataType.STRING,
            field : 'operator_info_pkid'
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