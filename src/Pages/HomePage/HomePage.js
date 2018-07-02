/*
初始页面,添加一条或多条数据
props:{app}
选定数据对应的父层dom范围-选定多个子dom并对应字段-是否通过父层dom的兄弟节点一次添加多个数据
props:{app}
*/
import {
    Component
} from 'react'
import h from 'react-hyperscript'
import {
    MuiThemeProvider,
    withStyles
} from 'material-ui/styles'
import PropTypes from 'prop-types'
//import $ from 'jquery'
import {
    DOMParser
} from 'xmldom'
import XPath from 'xpath'
import Json2Html from 'json-pretty-html'

import Grid from 'material-ui/Grid'
import Card from 'material-ui/Card'
import Button from 'material-ui/Button'
import Snackbar from 'material-ui/Snackbar'
import TextField from 'material-ui/TextField'

import Style from './_style'

class Page extends Component {
    constructor(props) {
        super(props)
        let that = this
        that.state = {
            title: 'HomePage',
            refpath: '//ul',
            xpath: '/p',
            xobj: {},
            key: 'name',
            xdata: {},
            queryValue: '',
            refcount: 0,
        }
    }

    componentDidMount() {
        let that = this
        global.docReadyFns['query'] = (doc) => {
            that.queryDoc()
            //let title = that.queryDoc('//title')[0].firstChild.data
            //console.log('>Query:Doc title is ' + (title ? title : 'not found') + '.')
        }
    }

    //根据xpath查询数据
    queryDoc(refstr, xstr, notset) {
        let that = this
        let refpath = refstr ? refstr : that.state.refpath
        let xpath = xstr ? xstr : that.state.xpath
        let value = 'Not found.'
        let domstr = that.props.app.state.doc
        let count = 0
        if (domstr) {
            var doc = new DOMParser().parseFromString(domstr)
            try {
                let refnodes = XPath.select(refpath, doc)
                count = refnodes ? refnodes.length : 0
                //斜杠结尾使用string，否则使用data
                let usestr = xpath[xpath.length - 1] == '/'
                if (usestr) {
                    xpath = xpath.slice(0, xpath.length - 1)
                }
                let path = refpath + xpath
                console.log('use path:', path)
                var nodes = XPath.select(path, doc)
                let data = (nodes[0] && nodes[0].firstChild) ? nodes[0].firstChild.data : null
                value = !usestr ? data : nodes.toString()
            } catch (err) {
                value = err.message
            }
        }
        if (!notset) {
            that.setState({
                queryValue: value,
                refcount: count
            })
        }
        return value
    }

    //向对象里面添加一个字段
    addKey() {
        let that = this
        let refpath = that.state.refpath || 'undefined'
        if (!that.state.xobj[refpath]) that.state.xobj[refpath] = {}
        that.state.xobj[refpath]['count'] = that.state.refcount
        that.state.xobj[refpath][that.state.key] = {
            key: that.state.key,
            xpath: that.state.xpath,
            queryValue: that.state.queryValue
        }
        that.setState({
            xobj: that.state.xobj
        })
        that.getData()
    }

    //删除对象里面的一个字段
    delKey() {
        let that = this
        let newxobj = that.state.xobj
        let objkey = that.state.refpath || 'undefined'
        let obj = newxobj[objkey]
        delete obj[that.state.key]
        newxobj[objkey] = obj
        let n = 0
        for (let attr in obj) {
            if (attr != 'count') n++
        }
        if (n == 0) delete newxobj[objkey]

        that.setState({
            xobj: newxobj
        })
        that.getData()
    }

    //利用xdata查询生成数据
    getData() {
        let that = this
        let xobj = that.state.xobj
        let xdata = {}

        for (let refpath in xobj) {
            xdata[refpath] = []
            let obj = xobj[refpath]
            for (let n = 1; n < obj.count + 1; n++) {
                let data = {}
                let rpath = refpath + '[' + n + ']'
                for (let attr in obj) {
                    if (attr != 'count') {
                        let xpath = obj[attr].xpath
                        data[attr] = that.queryDoc(rpath, xpath, true)
                    }
                }

                if (JSON.stringify(data) != "{}") xdata[refpath].push(data)
            }
            if (xdata[refpath].length == 0) delete xdata[refpath]
        }
        that.setState({
            xdata: xdata
        })
    }



    render() {
        let that = this
        const css = this.props.classes

        let refRow = h('div', {
            className: css.valueRow
        }, [
            h('div', {
                className: css.rowLabel,
                style: {
                    lineHeight: '30px'
                }
            }, 'RefPath: '),
                h(TextField, {
                className: css.rowContent,
                value: that.state.refpath,
                onChange: (evt) => {
                    that.setState({
                        refpath: evt.target.value,
                        value: that.queryDoc(evt.target.value, that.state.xpath)
                    })
                }
            }),
        ])

        let queryRow = h('div', {
            className: css.valueRow
        }, [
            h('div', {
                className: css.rowLabel,
                style: {
                    lineHeight: '30px'
                }
            }, 'SubPath: '),
                h(TextField, {
                className: css.rowContent,
                value: that.state.xpath,
                onChange: (evt) => {
                    that.setState({
                        xpath: evt.target.value,
                        value: that.queryDoc(that.state.refpath, evt.target.value)
                    })
                }
            }),
        ])

        let valueRow = h('div', {
            className: css.valueRow,
        }, [
            h('div', {
                className: css.rowLabel
            }, 'Value: '),
            h('div', {
                className: css.rowContent
            }, that.state.queryValue)
        ])

        let countRow = h('div', {
            className: css.valueRow,
        }, [
            h('div', {
                className: css.rowLabel
            }, 'Count: '),
            h('div', {
                className: css.rowContent
            }, that.state.refcount)
        ])

        let keyRow = h('div', {
            className: css.valueRow
        }, [
            h('div', {
                className: css.rowLabel,
                style: {
                    lineHeight: '30px'
                }
            }, 'Key: '),
                h(TextField, {
                className: css.rowContent,
                value: that.state.key,
                onChange: (evt) => {
                    that.setState({
                        key: evt.target.value
                    })
                }
            })
        ])

        let buttonRow = h('div', {
            className: css.valueRow,
        }, [
            h(Button, {
                className: css.button,
                variant: 'raised',
                size: 'small',
                color: 'primary',
                onClick: () => {
                    that.addKey()
                }
            }, 'AddKey'),
             h(Button, {
                className: css.button,
                variant: 'raised',
                size: 'small',
                color: 'secondary',
                onClick: () => {
                    that.delKey()
                }
            }, 'DelKey')
        ])

        let xobjDom = h('p', {
            className: css.note,
            dangerouslySetInnerHTML: {
                __html: Json2Html(that.state.xobj)
            }
        })

        let xdataDom = h('p', {
            className: css.note,
            dangerouslySetInnerHTML: {
                __html: Json2Html(that.state.xdata)
            }
        })

        return h('div', {}, [
            h(Card, {
                className: css.card
            }, [
                h('div', {
                    id: 'biaoti',
                    className: css.cardTitle
                }, '获取元素值'),
                refRow,
                countRow,
                queryRow,
                valueRow,
                keyRow,
                buttonRow,
            ]),
            h(Card, {
                className: css.card,
                elevation: 0
            }, [
                xobjDom,
                xdataDom,
            ])
        ])
    }
}

Page.propTypes = {
    classes: PropTypes.object.isRequired,
}
export default withStyles(Style)(Page)
