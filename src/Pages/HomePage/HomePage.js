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
            queryString: 'head',
            webviewDom: null,
            doc: null,
        }
    }

    componentDidMount() {}

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

Page.propTypes = {
    classes: PropTypes.object.isRequired,
}
export default withStyles(Style)(Page)
