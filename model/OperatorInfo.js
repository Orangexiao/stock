/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(sequelize,DataType){

return sequelize.define('operator_info',{
    
        
        operatorInfoPkid : {
            
            primaryKey : true,
            unique : true,
            
            type : DataType.STRING,
            field : 'operator_info_pkid'
        },
        
        operatorCode : {
            
            type : DataType.STRING,
            field : 'operator_code'
        },
        
        password : {
            
            type : DataType.STRING,
            field : 'password'
        },
        
        salt : {
            
            type : DataType.STRING,
            field : 'salt'
        },
        
        activeFlagCode : {
            
            type : DataType.STRING,
            field : 'active_flag_code'
        },
        
        operatorName : {
            
            type : DataType.STRING,
            field : 'operator_name'
        },
        
        operatorPhone : {
            
            type : DataType.STRING,
            field : 'operator_phone'
        },
        
        activeFlag : {
            
            type : DataType.STRING,
            field : 'active_flag'
        }
        
    }
    ,
    {
        freezeTableName: true, // Model tableName will be the same as the model name
        timestamps : false
    }
    );
}