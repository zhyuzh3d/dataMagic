import {
    Component
} from 'react'
import h from 'react-hyperscript'

/*import codemirror from 'codemirror'
import {
    UnControlled as CodeMirror
} from 'react-codemirror2'*/

import css from 'codemirror/lib/codemirror.css'
var CodeMirror = require('react-codemirror')

//import MyCoder from '../../Utilities/MyCoder'


import Button from 'material-ui/Button'
import Snackbar from 'material-ui/Snackbar'


class Page extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: 'HomePage',
            sbopen: false,
            code: 'alert("hello")'
        }
    }

    render() {
        let that = this
        return h('div', [
            h(CodeMirror, {
                value: that.state.code,
                options: {
                    lineNumbers: true
                },
                onChange: (value) => {
                    console.log(value)
                }
            })
        ])
    }
}

export default Page
