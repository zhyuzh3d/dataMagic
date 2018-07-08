import React from 'react'
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

import Pages from './_pages'
import Style from './_style'
import Theme from './_theme'
import Config from './_config'

import XRouter from '../Utilities/XRouter'
import MyDialog from '../Utilities/MyDialog'
import MySnackbar from '../Utilities/MySnackbars'

import Toolbar from '../Units/Toolbar'

global.XRouter = XRouter //输出到全局
global.docReadyFns = {
    'sample': (doc) => {
        console.log('>DocReadyFn:sample:Doc title is ' + $(doc).find('head title').html())
    }
}

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPageName: 'HomePage',
            randNumber: Math.random(),
            url: 'http://localhost:9000/test.html',
            //            url: 'https://www.zhipin.com/c101190400-p100101/',
            //            url: 'https://study.163.com/course/introduction.htm?courseId=1003599014&share=1&shareId=1142274227#/courseDetail?tab=1',
            doc: null
        }
    }

    componentDidMount() {
        let that = this
        global.XRouter.use(that)
        global.XRouter.changePage()
        const browser = document.querySelector('webview')
        browser.addEventListener('dom-ready', (e) => {
            that.regenDoc()
        })
    }

    //将webview内容同步到编辑窗口,callbackFn(doc)
    regenDoc(callbackFn) {
        let that = this
        const browser = document.querySelector('webview')
        browser.executeJavaScript(`document.documentElement.innerHTML`, function (str) {
            let doc = document.createDocumentFragment()
            let el = document.createElement('html')
            el.innerHTML = str
            doc.appendChild(el)

            that.setState({
                doc: str
            })

            callbackFn && callbackFn(doc, browser)

            for (let attr in global.docReadyFns) {
                try {
                    global.docReadyFns[attr](doc)
                } catch (err) {
                    console.log('>DocReadyFns:' + attr + ':failed:', err.message)
                }
            }
        })
    }

    componentWillUnmount() {
        global.XRouter.free(this)
    }

    updateUrl(url) {
        let that = this
        that.setState({
            url: url
        })
    }

    render() {
        let that = this
        const css = this.props.classes
        const webview = global.$webview = h('webview', {
            id: 'browser',
            src: that.state.url,
            //nodeintegration: 'false',//浏览器内不支持nodejs
            style: {
                width: '100%',
                height: '100%',
            }
        })

        return h(MuiThemeProvider, {
            theme: Theme,
        }, h(Grid, {
            container: true,
            className: css.app,
        }, [
           h('div', {
                style: {
                    minWidth: 400,
                    width: '20%',
                    height: '100%',
                    borderRight: '1px solid #AAA',
                    overflowY: 'auto'
                }
            }, h(Pages[this.state.currentPageName], {
                app: that,
            })),
            h('div', {
                style: {
                    flexGrow: 1,
                    overflowY: 'hidden',
                }
            }, [
                h(Toolbar, {
                    url: that.state.url,
                    app: that,
                }),
                webview,
            ]),
            h(MyDialog),
            h(MySnackbar),
        ]))
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
}
export default withStyles(Style)(App)
