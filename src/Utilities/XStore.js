/*
利用本地存储JSON结构的数据，分为单独的targetKey避免整个ls读取压力
获取存储的数据store('key','subkey')；
存储,与原来数据合并store('key',{'subkey':11})；
获取整个对象store('key')；
清理store('key')或store('key',null)；
设空子属性store('key',{'subkey':null})；
*/
import merge from 'deepmerge'
const store = (targetKey, objOrKey) => {
    let lsdata, res

    if (!targetKey || targetKey.constructor !== String) {
        console.error('Xstore:store:targetKey must be a string.')
        return res
    }

    if (objOrKey === null) {
        localStorage.removeItem(targetKey) //清理targetKey
        return
    } else if (objOrKey === undefined) {
        lsdata = localStorage.getItem(targetKey)
        res = lsdata ? JSON.parse(lsdata) : undefined //获取targetKey值
        return res
    }

    lsdata = localStorage.getItem(targetKey)
    res = lsdata ? JSON.parse(lsdata) : undefined

    if (objOrKey && objOrKey.constructor === String) {
        res = res ? res[objOrKey] : undefined //获取targetKey.subkey值
    } else {
        res = merge(res || {}, objOrKey || {})
        localStorage.setItem(targetKey, JSON.stringify(res)) //合并存储targetKey值
    };
    return res
}

const XStore = {
    store,
}
export default XStore
