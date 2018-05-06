import {
    Component
} from 'react'
import h from 'react-hyperscript'

import Button from 'material-ui/Button'

import MyIcons from '../../Utilities/MyIcons'

class Page extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: 'WelcomePage!',
        }
    }

    render() {
        return h('div', [
            h('h1', this.state.title),
            MyIcons.icon('favorite', {
                color: 'primary'
            }),
            MyIcons.icon('favorite border', {
                color: 'primary'
            }),
            h('div'),
            h(Button, {
                color: 'primary',
                variant: 'raised',
                onClick: () => {
                    global.XRouter.changePage('HomePage', {
                        randNumber: Math.random(),
                    })
                },
            }, 'go home')
        ])
    }
}

export default Page
