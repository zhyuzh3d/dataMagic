const path = require('path');
module.exports = {
    entry: './src/index.js', //入口文件
    output: {
        filename: 'bundle.js', //编译后的文件
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development',
    devServer: {
        contentBase: path.join(__dirname, "dist"), //编译好的文件放在这里
        compress: true,
        port: 9000 //本地开发服务器端口
    }
}
