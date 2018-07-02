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
import $ from 'jquery'

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
            sbopen: false,
            queryString: 'body div li:first ul div',
            filterString: 'span',
            tag: 'name',
            webviewDom: null,
            doc: null,
            rules: {},
            data: {},
        }
    }

    componentDidMount() {
        global.docReadyFns['query'] = (doc) => {
            console.log('>Query:Doc title is ' + $(doc).find('head title').html())
        }
    }

    queryDoc(str) {
        let that = this
        let queryStr = str ? str : that.state.queryString
        let queryValue = 'Not found.'
        try {
            let jo = $(that.props.app.state.doc).find(queryStr)
            if (jo.length == 1) {
                queryValue = jo.html()
            } else {
                queryValue = jo.map((i, item) => {
                    return $(item).html()
                })
            }

            //二次过滤，选择多个元素的子元素
            if (that.state.filterString) {
                jo = $(queryValue)
                queryValue = jo.map((i, item) => {
                    return $(item).filter('span:last').html()
                })
            }
        } catch (err) {
            queryValue = err.message || 'Syntax error.'
        }
        return queryValue
    }

    addRule() {
        let that = this
        that.state.rules[that.state.tag] = {
            tag: that.state.tag,
            query: that.state.queryString
        }
        that.setState({
            rules: that.state.rules
        })
    }

    render() {
        let that = this
        const css = this.props.classes

        let queryRow = h('div', {
            className: css.valueRow
        }, [
                h('div', {
                className: css.rowLabel,
                style: {
                    lineHeight: '30px'
                }
            }, 'Query: '),
                h(TextField, {
                className: css.rowContent,
                value: that.state.queryString,
                onChange: (evt) => {
                    that.setState({
                        queryString: evt.target.value
                    })
                }
            }),
        ])

        let filterRow = h('div', {
            className: css.valueRow
        }, [
                h('div', {
                className: css.rowLabel,
                style: {
                    lineHeight: '30px'
                }
            }, 'Filter: '),
                h(TextField, {
                className: css.rowContent,
                value: that.state.filterString,
                onChange: (evt) => {
                    that.setState({
                        filterString: evt.target.value
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
            }, that.queryDoc())
        ])

        let tagRow = h('div', {
            className: css.valueRow
        }, [
            h('div', {
                className: css.rowLabel,
                style: {
                    lineHeight: '30px'
                }
            }, 'Tags: '),
                h(TextField, {
                className: css.rowContent,
                value: that.state.tag,
                onChange: (evt) => {
                    that.setState({
                        tag: evt.target.value
                    })
                }
            })
        ])

        let buttonRow = h('div', {
            className: css.valueRow,
        }, [
            h(Button, {
                variant: 'raised',
                size: 'small',
                color: 'primary',
                onClick: () => {
                    that.addRule()
                }
            }, 'Add Rule')
        ])


        let fieldDomArr = []
        for (let attr in that.state.rules) {
            let v = that.queryDoc(that.state.rules[attr].query)
            that.state.data[that.state.rules[attr].tag] = v
        }
        let dataDom = h('div', {}, JSON.stringify(that.state.data))

        return h('div', {}, [
            h(Card, {
                id: 'xx',
                className: css.card
            }, [
                h('div', {
                    id: 'biaoti',
                    className: css.cardTitle
                }, '获取元素值'),
                queryRow,
                filterRow,
                valueRow,
                tagRow,
                buttonRow,
            ]),
            dataDom,
        ])
    }
}

Page.propTypes = {
    classes: PropTypes.object.isRequired,
}
export default withStyles(Style)(Page)
