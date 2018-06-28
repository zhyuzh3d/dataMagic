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

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPageName: 'WelcomePage',
            randNumber: Math.random(),
            url: 'http://www.10knet.com/'
        }
    }

    componentDidMount() {
        global.XRouter.use(this)
        global.XRouter.changePage()
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
                    minWidth: 360,
                    width: '20%',
                    height: '100%',
                    borderRight: '1px solid #444',
                }
            }, h(Pages[this.state.currentPageName], {
                app: that
            })),
            /*h('div', {
                style: {
                    flexGrow: 1,
                    overflowY: 'hidden',
                }
            }, [
                h(Toolbar, {
                    url: that.state.url,
                    app: that,
                }),
                webview
            ]),*/
            h(MyDialog),
            h(MySnackbar),
        ]))
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
}
export default withStyles(Style)(App)
