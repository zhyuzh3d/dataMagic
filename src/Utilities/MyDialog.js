/*
被加载时候componentDidMount添加全局方法：
$showMyDialog(state)，state格式请参照下面defaultState对象
$showMyDialog()
*/
import React from 'react'
import h from 'react-hyperscript'
import PropTypes from 'prop-types'
import deepmerge from 'deepmerge'


import Button from 'material-ui/Button'
import Dialog, {
    DialogTitle,
    DialogContent,
    DialogActions,
} from 'material-ui/Dialog'

const defaultState = {
    open: false, //窗口是否显示
    title: '', //标题
    content: '', //文字内容，优先使用
    children: [], //替换整个内容区，其次使用
    onClose: (confirmOrCancle) => {}, //关闭时执行的函数
    confirmLabel: '', //确认按钮上的文字
    cancelLabel: '', //取消按钮上的文字
    useCancelButton: true, //是否显示取消按钮
}

class MyDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = defaultState
    }

    show(state) {
        this.setState(deepmerge(state, {
            open: true
        }))
    }

    hide() {
        this.setState(deepmerge(defaultState, {
            open: false
        }))
    }

    componentDidMount() {
        let that = this;
        global.$showMyDialog = (state) => {
            that.show(state)
        }
        global.$hideMyDialog = () => {
            that.hide()
        }
    }

    render() {
        return h(Dialog, {
            open: this.state.open || false,
        }, [
            h(DialogTitle, {
                style: {
                    minWidth: '200px',
                }
            }, this.state.title || '弹窗标题'),
            h(DialogContent, {}, this.state.children || [
                h(DialogContentText, this.state.content || '弹窗提示文字')
            ]),
            h(DialogActions, [
                h(Button, {
                    onClick: () => {
                        this.setState({
                            open: false
                        })
                        this.state.onClose && this.state.onClose(true)
                    }
                }, this.state.confirmLabel || '确认'),
                this.state.useCancelButton && h(Button, {
                    onClick: () => {
                        this.setState({
                            open: false
                        })
                        this.state.onClose && this.state.onClose(false)
                    }
                }, this.state.cancelLabel || '取消')
            ])

        ])
    }
}

export default MyDialog
