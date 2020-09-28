import React, {Component} from 'react'
import axios from '../../axios-api'
import PassInfo from "../../components/UI/PassInfo/PassInfo";

class CheckPassStatus extends Component {
    state = {
        pass: null,
    }

    componentDidMount() {
        (async () => {
            try {
                const res = await axios.get('/isPassActive/' + this.props.match.match.params.uuid)
                this.setState({pass: res.data})
            } catch (e) {
                console.log(e)
            }
        })()
    }

    render() {
        return (
            <div>
                <h1>Pass Status</h1>
                {/* checking because react strict mode renders twice in dev
                    and when pass is null PassInfo throws errors*/}
                {this.state.pass && <PassInfo pass={this.state.pass}/>}
            </div>
        )
    }
}

export default CheckPassStatus
