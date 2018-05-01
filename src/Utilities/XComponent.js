import {
    Component
} from 'react'

/*
自动执行global._XComponent相应的方法，包括以下：
constructor(component,props),
componentDidMount(component),
componentWillUnmount(component),
shouldComponentUpdate(component),
render(component),
*/
class XComponent extends Component {
    constructor(props) {
       super(props)
    }

    async componentDidMount() {
        await this.componentDidMount_prev(this)
        console.log('XC')
    }

    render() {
        return h(Button, {
            color: 'primary',
            variant: 'raised',
        }, this.props.a || this.state.a)
    }
}

export default XComponent
