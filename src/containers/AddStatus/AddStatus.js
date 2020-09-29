import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import axios from '../../axios-api'

class AddStatus extends Component {
    state = {
        error : false
    }
    componentDidMount() {
        console.log('addStatus componentDidMount')
        const accessPin = this.props.match.params.accessPin
        const action = this.props.match.params.action
        const teacherId = this.props.match.params.teacherId
        const locationType = this.props.match.params.locationType
        try {
            (async () => {
                const addRes = await axios.get('/addStatus/'
                    + accessPin + '/'
                    + teacherId + '/'
                    + action + '/'
                    + locationType
                )
                if (addRes.data._id) {
                    this.props.history.push('/isPassActive/'
                        + addRes.data._id + '/'
                        + accessPin
                    )
                } else {
                    this.setState({error: 'Failed to add a status to the pass'})
                }
            })();
        } catch (e) {

        }
    }

    render() {
        return (
            <div>
                <h1>Add a Status to a Pass</h1>
                {this.state.error}
            </div>
        )
    }
}

export default withRouter(AddStatus)
