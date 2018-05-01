/*
利用xset和xstore实现路由
*/
import createHistory from 'history/createBrowserHistory'
import deepmerge from 'deepmerge'
import urlParser from 'urlparser'

import XStore from './XStore'
import XSet from './XSet'

/*
监听所有动作地址栏动作，根据地址里面的XSetPath变量跳转页面
依赖于App元素的state.currentPageName
当history被push的时候就会被激活
*/
let history = createHistory({
    basename: '',
})
history.listen((location, action, state) => {
    let urlObj = urlParser.parse(window.location.href)
    let pageName = urlObj.query ? urlObj.query.params['XSetPageName'] : undefined
    let urlState = urlObj.query ? urlObj.query.params['XSetPageState'] : undefined
    urlState = JSON.parse(decodeURIComponent(urlState))
    let appState = deepmerge({
        currentPageName: pageName
    }, urlState)
    XSet.set('App', appState)
})

/*
正式的切换元素的函数。
history.push推入历史，被上面的函数监听到激活上面的监听
如果pageName为空，那么尝试从地址栏中取得pageName和urlState
*/
const changePage = (pageName, urlState) => {
    let urlObj = urlParser.parse(window.location.href)
    if (!pageName) {
        pageName = urlObj.query ? urlObj.query.params['XSetPageName'] : undefined
        let urlStateStr = urlObj.query ? urlObj.query.params['XSetPageState'] : undefined
        urlStateStr = decodeURIComponent(urlStateStr)
        if (urlStateStr != 'undefined') {
            urlState = JSON.parse(urlStateStr)
        }
    }

    if (pageName) {
        let stateStr = encodeURIComponent(JSON.stringify(urlState || {}))
        history.push('?XSetPageName=' + pageName + '&XSetPageState=' + stateStr)
    }
}

const XRouter = {
    changePage,
    prevPage: history.goBack,
    nextPage: history.goForward,
    use: XSet.use,
    free: XSet.free,
    getComponents: XSet.getComponents,
    store: XStore.store,

}
export default XRouter
