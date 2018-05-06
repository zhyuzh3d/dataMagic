/*
被加载时候componentDidMount添加全局方法：
$addSnackbar(state)，state格式请参照官方API说明
*/
import React from 'react'
import h from 'react-hyperscript'
import PropTypes from 'prop-types'
import deepmerge from 'deepmerge'


import Button from 'material-ui/Button'
import Snackbar from 'material-ui/Snackbar'

let snackbars = []

class MySnackbar extends Snackbar {
    constructor(props) {
        super(props)
        snackbars.push(this)
    }
}


class MySnackbars extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: {}, //放置所有的提示列表
            use: {}, //是否显示
        }
    }

    add(state) {
        let that = this
        let list = that.state.list
        let componentid = String(Math.random())
        state = deepmerge(state, {
            componentid: componentid
        })
        that.state.list[componentid] = that.create(state, that)
        that.state.use[componentid] = true
        this.setState({
            use: that.state.use,
            list: that.state.list
        })
    }

    create(state, that) {
        let res = h(Snackbar, deepmerge(state, {
            style: {
                bottom: 'auto',
                display: 'block',
            },
            open: true,
            key: Math.random(),
            onClose: (event, reason) => {
                state.onClose()
                let sb = that.state.list[state.componentid].setState({
                    open: false
                })
            },
            onExited: () => {
                that.state.use[state.componentid] = false
                this.setState({
                    use: that.state.use,
                    list: that.state.list
                })
            },
            message: state.componentid,
        }))

        console.log(res)

        return res
    }

    componentDidMount() {
        let that = this;
        global.$addMySnackbar = (state) => {
            that.add(state)
        }
    }

    render() {
        let snackbars = []
        let list = this.state.list
        let use = this.state.use

        for (let key in this.state.list) {
            if (this.state.use[key]) {
                snackbars.push(this.state.list[key])
            } else {
                delete list[key]
                delete use[key]
                this.setState({
                    use: use,
                    list: list
                })
            }
        }

        return h('div', {
            style: {
                bottom: 100,
                position: 'fixed'
            }
        }, snackbars)
    }
}

export default MySnackbars
