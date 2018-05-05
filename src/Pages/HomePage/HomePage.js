import {
    Component
} from 'react'
import h from 'react-hyperscript'

import Button from 'material-ui/Button'
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm'
import FontAwesome from 'react-fontawesome'

class Page extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: 'HomePage',
        }
    }

    render() {
        return h('div', [
            h('h1', this.state.title),
            h(AccessAlarmIcon, {
                color: 'primary'
            }),
            h(FontAwesome, {
                name: 'rocket',
                color: 'red'
            }),
            h('img', {
                src: 'icons/11.png'
            }),
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

Page.constructor = (props) => {
    Page.constructor(props)

}
export default Page
