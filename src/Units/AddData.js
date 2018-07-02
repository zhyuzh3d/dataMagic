/*
添加一条或多条数据
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

const Style = {
    card: {
        padding: 12,
        margin: 8,
    },
    cardTitle: {
        fontSize: 12,
        color: '#444',
    },
    tf: {
        width: '100%',
        margin: '12px 0',
    },
    valueRow: {
        width: '100%',
        display: 'flex',
        fontSize: 14,
        margin: '8px 0',
    },
    rowLabel: {
        color: '#AAA',
        flexGrow: 'initial',
        marginRight: 12,
        minWidth: 48
    },
    rowContent: {
        flexGrow: 1,
        color: '#000',
        fontSize: 14,
        maxHeight: 120,
        overflowY: 'scroll'
    }
}

class Unit extends Component {
    constructor(props) {
        super(props)
        let that = this
        that.state = {
            queryString: 'head title',
            doc: null,
        }
    }

    componentDidMount() {
        global.docReadyFns['query'] = (doc) => {
            console.log('>Query:Doc title is ' + $(doc).find('head title').html())
        }
    }

    queryDoc() {
        let that = this
        let queryValue = 'Not found.'
        try {
            queryValue = $(that.props.app.state.doc).find(that.state.queryString).html()
        } catch (err) {
            queryValue = err.message || 'Syntax error.'
        }
        return queryValue
    }

    render() {
        let that = this
        const css = this.props.classes

        return h(Card, {
            id: 'xx',
            className: css.card
        }, [
            h('div', {
                id: 'biaoti',
                className: css.cardTitle
            }, '获取元素值'),

            h('div', {
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
            ]),
            h('div', {
                className: css.valueRow
            }, [
                h('div', {
                    className: css.rowLabel
                }, 'Value: '),
                h('div', {
                    className: css.rowContent
                }, that.queryDoc())
            ])
        ])
    }
}

Unit.propTypes = {
    classes: PropTypes.object.isRequired,
}
export default withStyles(Style)(Unit)
