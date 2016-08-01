/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(sequelize,DataType){

return sequelize.define('role_info',{
    
        
        roleInfoPkid : {
            
            primaryKey : true,
            unique : true,
            
            type : DataType.STRING,
            field : 'role_info_pkid'
        },
        
        roleName : {
            type : DataType.STRING,
            field : 'role_name'
        },
        
        roleId : {
            type : DataType.STRING,
            field : 'role_id'
        },
        
        activeFlag : {
            type : DataType.STRING,
            field : 'active_flag'
        },

        activeFlagCode : {
            type : DataType.STRING,
            field : 'active_flag_code'
        }
        
    }
    ,
    {
        freezeTableName: true, // Model tableName will be the same as the model name
        timestamps : false
    }
    );
}