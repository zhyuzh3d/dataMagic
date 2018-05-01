import {
    Component
} from 'react'
import h from 'react-hyperscript'

import Button from 'material-ui/Button';

class Page extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: 'WelcomePage',
        }
    }

    render() {
        return h('div', [
            h('h1', this.state.title),
            h(Button, {
                color: 'primary',
                variant: 'raised',
                onClick: () => {
                    global.XRouter.changePage('HomePage', {
                        randNumber:Math.random(),
                    })
                },
            }, 'go home')
        ])
    }
}

Page.constructor = (props) => {
    Page.constructor(props)

}
export default Page
