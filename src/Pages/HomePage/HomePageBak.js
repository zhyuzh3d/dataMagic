import {
    Component
} from 'react'
import h from 'react-hyperscript'

import Button from 'material-ui/Button'
import Snackbar from 'material-ui/Snackbar';


class Page extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: 'HomePage',
            sbopen: false,
        }
    }

    render() {
        let that = this
        return h('div', [
            h('h1', this.state.title),
            h(Button, {
                onClick: () => {
                    global.$showMyDialog({
                        onClose: (ok) => {
                            console.log('MyDialog said:', ok)
                        },
                        children: [h(Button, {
                            onClick: () => {
                                global.$hideMyDialog()
                                console.log('Home Page said:', that.state.title)
                            }
                        }, 'close dialog')]
                    })
                }
            }, 'open dialog'),

            h('div'),
            h(Button, {
                onClick: () => {
                    let id = Math.random()
                    global.$addMySnackbar({
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'center',
                        },
                        autoHideDuration: 3000,
                        onClose: () => {
                            console.log('Home Page said:', that.state.title)
                        },
                        message: 'Hello from MySnackbar!',
                        action: [
                            h(Button, {
                                key: 'any',//必须要有这个，值任意
                                color: 'secondary',
                                onClick: () => {
                                    global.$closeMySnackBar(id)
                                    console.log('Home Page said:', that.state.title)
                                }
                            }, '关闭')
                        ],
                    }, id)
                }
            }, 'add snackbar'),

            h('div'),
            h(Button, {
                color: 'primary',
                variant: 'raised',
                onClick: () => {
                    that.props.app.updateUrl('http://www.163.com')
                },
            }, 'go welcome'),
            h(Button, {
                color: 'primary',
                variant: 'raised',
                onClick: () => {
                    global.XRouter.changePage('WelcomePage', {
                        randNumber: Math.random(),
                    })
                },
            }, 'go welcome')
        ])
    }
}

export default Page
