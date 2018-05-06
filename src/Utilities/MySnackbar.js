/*
被加载时候componentDidMount添加全局方法：
$addSnackbar(state)，state格式请参照官方API说明
*/
import React from 'react'
import h from 'react-hyperscript'
import deepmerge from 'deepmerge'

import Snackbar from 'material-ui/Snackbar'

class MySnackbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true
        }
    }

    render() {
        const css = this.props.classes

        console.log(this.props)
        let props = deepmerge(this.props, {
            open: this.state.open,
            style:{
                display:'block',
                position:'relative',
                height:56,
            },
            onClose: (event, reason) => {
                this.props.onClose && this.props.onClose()
                if (reason !== 'clickaway') this.setState({
                    open: false
                })
            },
        })
        return h(Snackbar, props)
    }
}

export default MySnackbar
