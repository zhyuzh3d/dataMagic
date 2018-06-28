/*
浏览器部分的地址栏
*/

import {
    Component
} from 'react'
import h from 'react-hyperscript'

import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import MyIcons from '../Utilities/MyIcons'

class Unit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            url: this.props.url
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.url !== this.state.url) {
            this.setState({
                url: nextProps.startTime
            });
        }
    }

    render() {
        let that = this
        return h('div', {}, [
            h(TextField, {
                value:that.props.url,
                style: {
                    width: '100%',
                },
                onChange: (evt) => {
                    that.props.app.updateUrl(evt.target.value)
                }
            })
        ])
    }
}

export default Unit
