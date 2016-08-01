/**
 * Created by xiaohongju on 16/3/1.
 */
/**
 * config
 */

var path = require('path');

var config = {
    // debug 为 true 时，用于本地调试
    debug: true,
    get mini_assets() { return !this.debug; }, // 是否启用静态文件的合并压缩，详见视图中的Loader
    secret : 'xmseesionkey',
    jwtTokenSecret : 'jwtToken'
};


module.exports = config;
