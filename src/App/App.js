import {
    Component
} from 'react'
import h from 'react-hyperscript'
import {
    MuiThemeProvider,
    withStyles
} from 'material-ui/styles'
import PropTypes from 'prop-types'
import Grid from 'material-ui/Grid';

import Pages from './_pages'
import Style from './_style'
import Theme from './_theme'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            curPage: Pages.WelcomePage,
        }
    }

    render() {
        let that = this
        const css = this.props.classes

        return h(MuiThemeProvider, {
            theme: Theme,
        }, h(Grid, {
            container: true,
            spacing: 0,
            className: css.app,
        }, [h(that.state.curPage)]))
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
}
export default withStyles(Style)(App)



/*
import {
    Component
} from 'react'

import h from 'react-hyperscript'
import PropTypes from 'prop-types'
import {
    MuiThemeProvider,
    withStyles
} from 'material-ui/styles'

import Grid from 'material-ui/Grid'
import Button from 'material-ui/Button'

import Style from './_style' //专用样式表
import Theme from './_theme' //主题风格
import Config from './_config' //全局设置
import Pages from './_pages' //所有页面设置

class App extends Component {
    state = {
        title: 'undefined'
    }

    //此元素被加载之前执行
    componentWillMount = () => {
        that.setState({
            title: 'MYWEB'
        })
    }

    //此元素加载后执行
    componentDidMount = async function () {
        that.setState({
            title: 'MYAPP'
        })
    }

    //渲染实现
    render() {
        let that = this;
        const css = this.props.classes;

        let page = h(Button, {
            variant: 'raised',
            color: 'primary',
            children: 'BUTTON',
        })

        return h(MuiThemeProvider, {
                theme: Theme,
            }, h(Grid, {
                container: true,
                spacing: 0,
                className: css.app,
            }, [page])
        }
    }

    App.propTypes = {
        classes: PropTypes.object.isRequired,
    }

    export default withStyles(style)(App)
*/
