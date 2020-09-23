import React, {Component} from 'react'
import axios from '../../axios-api'

class MyPass extends Component {
    state = {
        passes: [],
        error: false,
    }

    componentDidMount() {
        (async () => {
            await this.getPasses()
        })()
    }

    getPasses = async () => {
        try {
            const passes = await axios.get('passes')
            this.setState({passes: passes.data})
        } catch (e) {
            this.setState({error: {message: 'Failed to get passes'}})
        }
    }

    render() {
        let passTable = this.state.passes.map(row => {
            return (
                <tr key={row._id}>
                    {/*<td>{Date.parse(row.createTime)}</td>*/}
                    <td>{row.createTime}</td>
                    <td>{row.active ? 'ACTIVE' : 'INACTIVE'}</td>
                    <td>{row.student.lastName}, {row.student.firstName}</td>
                    <td>{row.student.grade}</td>
                    <td>{row.destination.room}</td>
                    <td>{row.destinationTeacher ? row.destinationTeacher.lastName + ', ' + row.destinationTeacher.firstName : null}</td>
                    <td>{row.origin.room}</td>
                    <td>{row.originTeacher.lastName + ', ' + row.originTeacher.firstName}</td>
                </tr>
            )
        })
        return (
            <div>
                {this.state.error.message}
                <h1>Passes</h1>
                <table>
                    <thead>
                    <tr>
                        <th>Create Time</th>
                        <th>Status</th>
                        <th>Student</th>
                        <th>Grade</th>
                        <th>Destination</th>
                        <th>Destination Teacher</th>
                        <th>Origin</th>
                        <th>Origin Teacher</th>
                    </tr>
                    </thead>
                    <tbody>
                    {passTable}
                    </tbody>
                </table>
            </div>
        )
    }
}


export default MyPass
