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
import Jsoncsv from 'json-csv'

import Grid from 'material-ui/Grid'
import Card from 'material-ui/Card'
import Button from 'material-ui/Button'
import Snackbar from 'material-ui/Snackbar'
import TextField from 'material-ui/TextField'
import Tabs from 'material-ui/Tabs/Tabs'
import Tab from 'material-ui/Tabs/Tab'

import Style from './_style'

class Page extends Component {
    constructor(props) {
        super(props)
        let that = this
        that.state = {
            title: 'HomePage',
            refpath: '//head',
            xpath: '//title',
            //            refpath: '//li[@class="chapter"]',
            //            xpath: '//li[@class="items"][#]//span[2]',
            regx: '',
            xobj: {},
            key: 'name',
            xdata: {},
            queryValue: '',
            refcount: 0,
            tabon: 0,
            csvUrl: null,
            csvFile: 'DataMagic.csv',
            rulesUrl: null,
            rulesFile: 'DataMagic.mdr',
            doc: null,
            refNodes: {},
            refDoms: {},
            doms: {},
        }
    }

    componentDidMount() {
        let that = this
        global.docReadyFns['setTitle'] = (domstr) => {
            that.setTitle()
        }
    }

    setTitle() {
        let that = this
        that.setState({
            doc: that.domParser(that.props.app.state.doc)
        }, () => {
            that.queryDoc()
            var doc = that.domParser(that.props.app.state.doc)
            let title = that.queryDoc('//head', '//title', '', true)
            if (title) {
                that.setState({
                    rulesFile: title + '.mdr',
                    csvFile: title + '.csv'
                })
            }
            console.log('>Query:Doc title is ' + (title ? title : 'not found') + '.')
        })
    }

    domParser(str) {
        try {
            return new DOMParser().parseFromString(str)
        } catch (err) {
            return null
        }
    }

    //根据xpath查询数据,三个参数严格使用undefined指向that.state
    queryDoc(refstr, xstr, regxstr, notset) {
        let that = this
        let refpath = refstr !== undefined ? refstr : that.state.refpath
        let xpath = xstr !== undefined ? xstr : that.state.xpath
        let regx = regxstr !== undefined ? regxstr : that.state.regx
        let value = 'Not found.'
        let domstr = that.props.app.state.doc

        if (!domstr) {
            console.log('>QueryDoc:Err:domstr in empty.')
            return value
        }

        var doc = that.state.doc
        if (!doc) {
            doc = that.domParser(domstr)
            that.state.doc = doc
        }

        try {
            //如果不指定，那么就返回第一个[1]
            refpath = /\[[0-9]{0,4}\]$/.test(refpath) ? refpath : refpath + '[1]'

            //尝试获取缓存的dom
            let refNodes = that.state.refNodes[refpath] || XPath.select(refpath, doc)
            that.state.refNodes[refpath] = refNodes
            let refdom = that.state.refDoms[refpath] || that.domParser(refNodes[0].toString())
            that.state.refDoms[refpath] = refdom

            //斜杠结尾使用string，否则使用data
            let usestr = xpath[xpath.length - 1] == '/'
            if (usestr) {
                xpath = xpath.slice(0, xpath.length - 1)
            }

            //如果xpath包含[#]那么就返回一个字符串数组列表
            if (xpath.indexOf('[#]') != -1) {
                let xpathArr = xpath.split('[#]')
                let itemNode = XPath.select(xpathArr[0], refdom)
                value = itemNode.map((sub, n) => {
                    let subDom = that.domParser(itemNode[n].toString())
                    console.log('>>n', n, subDom.toString())
                    let node = XPath.select(xpathArr[1], subDom)
                    let d = (node[0] && node[0].firstChild) ? node[0].firstChild.data : null
                    let v = !usestr ? d : node.toString()
                    if (regx) {
                        v = v.match(new RegExp(regx, 'g'))[0]
                    }
                    if (v) return v
                })
            } else {
                var nodes = XPath.select(xpath, refdom)
                let data = (nodes[0] && nodes[0].firstChild) ? nodes[0].firstChild.data : null
                value = !usestr ? data : nodes.toString()
                if (regx) {
                    value = value.match(new RegExp(regx, 'g'))[0]
                }
            }
        } catch (err) {
            value = err.message
        }

        if (!notset) {
            that.setState({
                queryValue: value,
                refcount: that.getCount(refpath, doc)
            })
        }
        return value
    }

    //获取count数量
    getCount(refpath, doc) {
        let that = this
        if (!doc) {
            doc = that.state.doc
        }
        if (!doc) {
            doc = that.domParser(that.props.app.state.doc)
        }

        refpath = refpath.replace(/\[[0-9]{0,4}\]$/, '') //去除结尾的[1]限制
        let refnodes = that.state.refNodes[refpath]
        if (!refnodes) {
            try {
                refnodes = XPath.select(refpath, doc)
                that.state.refNodes[refpath] = refnodes
                that.setState({
                    refNodes: that.state.nodes || {}
                })
            } catch (err) {
                console.log('>GetCount:ERR:', err.message)
            }
        }
        let count = refnodes ? refnodes.length : 0
        that.setState({
            refcount: count
        })

        return count
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
            queryValue: that.state.queryValue,
            regx: that.state.regx,
        }
        that.setState({
            xobj: that.state.xobj
        }, () => {
            that.getData()
            that.genRulesUrl()
        })
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
        }, () => {
            that.getData()
            that.genRulesUrl()
        })
    }

    //利用xdata查询生成数据
    getData() {
        let that = this
        let xobj = that.state.xobj
        let xdata = {}

        for (let refpath in xobj) {
            xdata[refpath] = []
            let obj = xobj[refpath]
            let count = that.getCount(refpath) //使用重新计算的count数量
            for (let n = 1; n < count + 1; n++) {
                let data = {}
                for (let attr in obj) {
                    if (attr != 'count') {
                        let xpath = obj[attr].xpath
                        let regx = obj[attr].regx
                        let query = that.queryDoc(refpath + '[' + n + ']', xpath || '', regx || '', true)
                        if (query.constructor == Array) {
                            query.forEach((n, v) => {
                                data[String(v)] = n
                            })
                        } else {
                            data[attr] = query
                        }
                    }
                }
                if (JSON.stringify(data) != "{}") xdata[refpath].push(data)
            }
            if (xdata[refpath].length == 0) delete xdata[refpath]
        }
        that.setState({
            xdata: xdata
        })
        xdata && that.genCSVUrl(xdata[that.state.refpath])
    }

    showDevTool() {
        try {
            const browser = document.querySelector('webview')
            browser.openDevTools()
        } catch (err) {
            console.log('>ShowDevTools:ERR:', err.message)
        }
    }


    genCSVUrl(data) {
        let that = this
        if (!data || data.length < 1) {
            console.log('>SaveCSV:ERR', 'Nothing to save.')
            return
        }
        let fields = []
        for (let attr in data[0]) {
            fields.push({
                name: attr,
                label: attr,
            })
        }
        Jsoncsv.csvBuffered(data, {
            fields: fields
        }, (err, csv) => {
            if (err) {
                console.log('>SaveCSV:ERR', err.message)
            } else {
                var blob = new Blob(["\ufeff", csv], {
                    type: "text/csv;charset=UTF-8"
                })
                var csvUrl = URL.createObjectURL(blob)
                that.setState({
                    csvUrl: csvUrl
                })
            }
        })
    }

    genRulesUrl() {
        let that = this
        var blob = new Blob(["\ufeff", JSON.stringify(that.state.xobj)], {
            type: "application/mdr;charset=UTF-8"
        })
        var url = URL.createObjectURL(blob)
        that.setState({
            rulesUrl: url
        })
    }

    loadRules() {
        let that = this
        let file_input = document.createElement('input')
        file_input.setAttribute('accept', ".mdr")
        file_input.addEventListener("change", (evt) => {
            let f = evt.target.files ? evt.target.files[0] : null
            if (!f) return
            var reader = new FileReader()
            reader.onload = function (e) {
                var contents = e.target.result
                var xobj = null
                try {
                    xobj = JSON.parse(contents)
                } catch (err) {
                    console.log('>LoadRules:ERR:', err.message)
                }
                if (xobj) {
                    that.setByXobj(xobj)
                }
            }
            reader.readAsText(f);
        }, false)
        file_input.type = 'file'
        file_input.click()
    }

    setByXobj(xobj) {
        let that = this
        let refpath, xpath
        for (let rpath in xobj) {
            let obj = xobj[rpath]
            refpath = rpath
            for (let key in obj) {
                if (key != 'count') {
                    xpath = obj[key].xpath
                    break
                }
            }
            break
        }
        that.setState({
            xobj: xobj ? xobj : that.state.xobj,
            refpath: refpath ? refpath : that.state.refpath,
            xpath: xpath ? xpath : that.state.xpath
        }, () => {
            that.queryDoc()
            that.getData()
            that.genRulesUrl()
        })
    }

    clearXobj() {
        let that = this
        that.setState({
            xobj: {},
            refpath: '//head',
            xpath: '//title',
            nodes: {},
            doc: null,
            refNodes: {},
            refDoms: {},
            doms: {},
        }, () => {
            that.queryDoc()
            that.getData()
            that.genCSVUrl()
            that.genRulesUrl()
        })
    }

    regenDoc() {
        let that = this
        that.setState({
            nodes: {},
            doc: null,
            refNodes: {},
            refDoms: {},
            doms: {},
        }, () => {
            that.props.app.regenDoc((doc, browser) => {
                that.setState({
                    doc: doc
                })
            })
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
            }, '单元路径: '),
                h(TextField, {
                className: css.rowContent,
                value: that.state.refpath,
                onChange: (evt) => {
                    that.setState({
                        refpath: evt.target.value,
                        value: that.queryDoc(evt.target.value, undefined, undefined)
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
            }, '字段路径: '),
                h(TextField, {
                className: css.rowContent,
                value: that.state.xpath,
                onChange: (evt) => {
                    that.setState({
                        xpath: evt.target.value,
                        value: that.queryDoc(undefined, evt.target.value, undefined)
                    })
                }
            }),
        ])

        let regxRow = h('div', {
            className: css.valueRow
        }, [
            h('div', {
                className: css.rowLabel,
                style: {
                    lineHeight: '30px'
                }
            }, '正则过滤: '),
                h(TextField, {
                className: css.rowContent,
                value: that.state.regx,
                onChange: (evt) => {
                    that.setState({
                        regx: evt.target.value,
                        value: that.queryDoc(undefined, undefined, evt.target.value)
                    })
                }
            }),
        ])

        let valueRow = h('div', {
            className: css.valueRow,
        }, [
            h('div', {
                className: css.rowLabel
            }, '获取结果: '),
            h('div', {
                className: css.rowContent
            }, that.state.queryValue)
        ])

        let countRow = h('div', {
            className: css.valueRow,
        }, [
            h('div', {
                className: css.rowLabel
            }, '单元数量: '),
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
            }, '字段名称: '),
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
            }, '加字段'),
            h(Button, {
                className: css.button,
                variant: 'raised',
                size: 'small',
                color: 'secondary',
                onClick: () => {
                    that.delKey()
                }
            }, '删字段'),
            that.state.csvUrl && h('a', {
                    href: that.state.csvUrl,
                    download: that.state.csvFile,
                    style: {
                        textDecoration: 'none'
                    }
                },
                h(Button, {
                    className: css.button,
                    variant: 'raised',
                    size: 'small',
                    color: 'primary',
                }, '保存CSV')
              ),
            h(Button, {
                className: css.button,
                variant: 'raised',
                size: 'small',
                color: 'secondary',
                onClick: () => {
                    that.clearXobj()
                }
            }, '清空'),
        ])

        let xobjDom = h('div', {
            className: css.note,
            dangerouslySetInnerHTML: {
                __html: Json2Html(that.state.xobj)
            }
        })

        let xdataDom = h('div', {}, [
            h(Button, {
                className: css.button,
                variant: 'raised',
                size: 'small',
                color: 'default',
                onClick: () => {
                    that.queryDoc()
                    that.getData()
                    that.genCSVUrl()
                    that.genRulesUrl()
                }
            }, '刷新数据'),
            h('div', {
                style: {
                    height: 12
                }
            }),
            h('div', {
                className: css.note,
                dangerouslySetInnerHTML: {
                    __html: Json2Html(that.state.xdata)
                }
            })
        ])

        let buttonRowTop = h('div', {
            className: css.valueRow,
        }, [
            h('div', {
                style: {
                    width: 8
                }
            }),
            h(Button, {
                className: css.button,
                variant: 'raised',
                size: 'small',
                color: 'secondary',
                onClick: () => {
                    that.regenDoc()
                }
            }, '分析页面'),
            h(Button, {
                className: css.button,
                variant: 'raised',
                size: 'small',
                color: 'default',
                onClick: () => {
                    that.loadRules()
                }
            }, '载入规则'),
            that.state.rulesUrl && h('a', {
                    href: that.state.rulesUrl,
                    download: that.state.rulesFile,
                    style: {
                        textDecoration: 'none'
                    }
                },
                h(Button, {
                    className: css.button,
                    variant: 'raised',
                    size: 'small',
                    color: 'default',
                }, '保存规则')
              ),
            h(Button, {
                className: css.button,
                variant: 'raised',
                size: 'small',
                color: 'default',
                onClick: () => {
                    that.showDevTool()
                }
            }, '开发工具'),

        ])


        return h('div', {}, [
            buttonRowTop,
            h(Card, {
                className: css.card
            }, [
                refRow,
                countRow,
                queryRow,
                regxRow,
                valueRow,
                that.state.xpath.indexOf('[#]') == -1 && keyRow,
                buttonRow,
            ]),
            h(Tabs, {
                value: that.state.tabon,
                indicatorColor: "primary",
                textColor: "primary",
                fullWidth: true,
                onChange: (evt, val) => {
                    that.setState({
                        tabon: val
                    })
                }
            }, [
               h(Tab, {
                    label: '全部结果'
                }),
               h(Tab, {
                    label: '全部规则'
                })
            ]),
            h(Card, {
                className: css.card,
                elevation: 0,
            }, that.state.tabon == 0 ? xdataDom : xobjDom),
        ])
    }
}

Page.propTypes = {
    classes: PropTypes.object.isRequired,
}
export default withStyles(Style)(Page)
