/*
 * @Descripttion: 
 * @Author: yizheng.yuan
 * @Date: 2020-04-16 15:11:27
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2020-04-16 16:49:31
 */
// vue.config.js
module.exports = {
    lintOnSave: false,
　　devServer: {
　　　　host: '127.0.0.1',
　　　　port: 8080,
　　　　proxy: {
　　　　　　'/api': {
　　　　　　　　target: 'http://127.0.0.1:5000',// 要跨域的域名
　　　　　　　　changeOrigin: true, // 是否开启跨域
　　　　　　　　pathRewrite: {
　　　　　　　　'^/api': '' // 在请求的时候 凡是/api开头的地址都可以跨域
　　　　　　　　}
　　　　　　},
　　　　}
　　}
};