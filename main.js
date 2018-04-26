const {
    app,
    BrowserWindow
} = require('electron')
const path = require('path')
const url = require('url')

function createWindow() {
    //创建浏览器窗口
    win = new BrowserWindow({
        width: 800,
        height: 600
    })

    //让浏览器加载index.html
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
}

//执行
app.on('ready', createWindow)
