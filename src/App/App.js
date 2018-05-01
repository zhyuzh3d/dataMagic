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
import Button from 'material-ui/Button'

import Pages from './_pages'
import Style from './_style'
import Theme from './_theme'
import Config from './_config'

import XRouter from '../Utilities/XRouter'

global.XRouter = XRouter //输出到全局

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPageName: 'WelcomePage',
            randNumber: Math.random(),
        }
    }

    componentDidMount() {
        global.XRouter.use(this)
        global.XRouter.changePage()
    }

    componentWillUnmount() {
        global.XRouter.free(this)
    }

    render() {
        let that = this
        const css = this.props.classes

        return h(MuiThemeProvider, {
            theme: Theme,
        }, h(Grid, {
            container: false,
            className: css.app,
        }, [
            h(Pages[this.state.currentPageName]),
            h('h5', this.state.randNumber)
        ]))
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
}
export default withStyles(Style)(App)
