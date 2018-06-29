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


    componentDidMount() {
        let that = this
        const browser = document.querySelector('webview')
        browser.addEventListener('dom-ready', (e) => {
            browser.executeJavaScript(`document.body.innerHTML`, function (result) {
                that.setState({
                    webviewDom: result
                })
                console.log('>>Page', $(result).find('h2').html())
            })

            /*
            browser.openDevTools({
                mode: 'bottom'
            })
            */

            /* global.$electron.remote.getCurrentWindow().setDevToolsWebContents({
                 mode: 'right'
             })*/


            //          global.$electron.remote.getCurrentWindow().webContents.setDevToolsWebContents(browser.getWebContents())

            //const bb = browser.getWebContents()
            //browser.setDevToolsWebContents(browser.getWebContents())
        })




    }


    render() {
        let that = this
        const css = this.props.classes


        /* const browserView = document.getElementById('browser')
        const devtoolsView = document.getElementById('devtools')
        browserView.addEventListener('dom-ready', () => {
            const browser = browserView.getWebContents()
            browser.setDevToolsWebContents(devtoolsView.getWebContents())
            browser.openDevTools()
        })
*/


        //利用选择器获取元素值

        //const webview = document.getElementsByTagName('webview')[0];
        //console.log('>>>>>>webview',global.$webview)
        //console.log('>>>>>>',webview.getWebContents)


        let winWC = global.$electron.remote.getCurrentWindow().webContents
        //        winWC.executeJavaScript(`document.body.innerHTML`, function (result) {
        winWC.executeJavaScript(`document.body.innerHTML`, function (result) {
            //console.log('>>>>', $(result).find('#biaoti').html())
        })

        //console.log('>>>>cc',.executeJavaScript)



        //        console.log('>>', document.getElementsByName('webview'))
        let queryValue = 'Syntax error.'
        /*
        try {
            let webCont=global.$webview.getWebContents()
            let str = that.state.queryString.replace(/\s/g, ' ')
            let queryArr = that.state.queryString.split(' ')
            let jo = $(webCont)
            if (queryArr.length > 0) {
                for (var i = 0; i < queryArr.length; i++) {
                    jo = jo.find(queryArr[i])
                }
            }
            queryValue = jo ? jo.html() : 'Syntax error.'
            console.log('Query ok:', jo)
        } catch (err) {
            console.log('Query error:', err)
        }
        */


        queryValue = $(that.props.app.state.doc).find('head title').html()
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
                }, queryValue)
            ])
        ])
    }
}

Page.propTypes = {
    classes: PropTypes.object.isRequired,
}
export default withStyles(Style)(Page)
