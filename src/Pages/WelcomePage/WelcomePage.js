import {
    Component
} from 'react'
import h from 'react-hyperscript'

import Button from 'material-ui/Button';

class WelcomePage extends Component {
    render() {
        return h(Button, {
            color: 'primary',
            variant:'raised',
        }, 'Welcome to my website!')
    }
}

export default WelcomePage
