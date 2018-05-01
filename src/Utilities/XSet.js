import {
    Component
} from 'react'

/*
接管全部components实例
每个实例对应一个XSetId，这里不考虑同一类的多个重复实例
重复的实例应该利用props.XSetId进行区别处理
*/
let components = {}

/*
初始化一个元素,components[key]=component
应该在componentWillUnmount方法中调用
必须经过初始化才能使用xset
key注册键名，默认使用key->XSetId->元素类名
return 实际使用的key或失败undefined
*/
const use = (component, key) => {
    if (!(component instanceof Component)) {
        console.error('Xset:init:componet format err.')
        return
    }

    key = key ? key : (component.props.XSetId ? component.props.XSetId : component.constructor.name)

    if (key.constructor !== String) {
        console.error('Xset:init:key must be a string.')
        return
    }

    components[key] = component
    return key
}

/*
释放一个元素，从components中移除,不再接收xset
应该在componentWillUnmount中调用
如果是元素，删除对应的key
如果是key，删除key
return true或失败undefined
*/
const free = (componentOrKey, index = -1) => {
    if (!componentOrKey) {
        console.error('Xset:free:componentOrKey can not be undefined.')
        return
    }
    if (componentOrKey instanceof Component) {
        for (let key in components) {
            if (components[key] == componentOrKey) {
                delete components[key]
            }
        }
    } else if (componentOrKey.constructor == String) {
        delete components[componentOrKey]
    } else {
        console.error('Xset:free:componentOrKey must be a component or a string.')
        return
    }

    return true
}

/*
根据key跨元素setState
执行components[key].setState(state)
return true或失败undefined
*/
const set = (key, state) => {
    if (!key || key.constructor != String) {
        console.error('Xset:xset:key must be a string:' + key + '.')
        return
    }

    if (!components[key] || !(components[key] instanceof Component)) {
        console.warn('Xset:xset:component does not exist on ' + key + '.')
        return
    }

    components[key].setState(state)
    return true
}

const XSet = {
    use,
    free,
    set,
    getComponents: () => {
        return components
    }
}
export default XSet
