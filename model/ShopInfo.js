/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(sequelize,DataType){

return sequelize.define('shop_info',{
    
        
        shopInfoPkid : {
            
            primaryKey : true,
            unique : true,
            
            type : DataType.STRING,
            field : 'shop_info_pkid'
        },
        
        sid : {
            
            type : DataType.STRING,
            field : 'sid'
        },
        
        shopName : {
            
            type : DataType.STRING,
            field : 'shop_name'
        },
        
        shopUrl : {
            
            type : DataType.STRING,
            field : 'shop_url'
        },
        
        rankValue : {
            
            type : DataType.FLOAT,
            field : 'rank_value'
        },
        
        typeRank : {
            
            type : DataType.FLOAT,
            field : 'type_rank'
        },
        
        infoRank : {
            
            type : DataType.FLOAT,
            field : 'info_rank'
        },
        
        serviceRank : {
            
            type : DataType.FLOAT,
            field : 'service_rank'
        },
        
        packageRank : {
            
            type : DataType.FLOAT,
            field : 'package_rank'
        },
        
        logisticsRank : {
            
            type : DataType.FLOAT,
            field : 'logistics_rank'
        },
        
        reviewCount : {
            
            type : DataType.INTEGER,
            field : 'review_count'
        },
        
        email : {
            
            type : DataType.STRING,
            field : 'email'
        }
        
    }
    ,
    {
        freezeTableName: true, // Model tableName will be the same as the model name
        timestamps : false
    }
    );
}