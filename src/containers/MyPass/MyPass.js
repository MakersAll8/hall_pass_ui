import React, {Component} from 'react'
import axios from '../../axios-api'
import classes from './MyPass.module.css'
import Aux from "../../hoc/Aux/Aux";

class MyPass extends Component {
    state = {
        passes: [],
        error: false,
    }

    componentDidMount() {
        (async () => {
            await this.getPasses()
        })()
        if (this.props.active) {
            setInterval((async () => {
                await this.getPasses()
            }), 5000)
        }
    }

    getPasses = async () => {
        try {
            const passes = this.props.active ? await axios.get('activePasses') : await axios.get('passes')
            this.setState({passes: passes.data})
        } catch (e) {
            this.setState({error: {message: 'Failed to get passes'}})
        }
    }

    render() {
        let passes = this.state.passes.map(row => {
            const classNames = [classes.Pass]
            if (row.active) {
                classNames.push(classes.Active)
            }
            return (
                <div className={classNames.join(' ')} key={row._id}>
                    <p>Status: {row.active ? 'ACTIVE' : 'INACTIVE'}</p>
                    <p>Create Time: {row.createTime}</p>
                    <p>Student: {row.student.lastName}, {row.student.firstName}</p>
                    <p>Grade: {row.student.grade}</p>
                    <p>Destination: {row.destination.room}</p>
                    <p>Destination
                        Teacher: {row.destinationTeacher ? row.destinationTeacher.lastName + ', ' + row.destinationTeacher.firstName : null}</p>
                    <p>Origin: {row.origin.room}</p>
                    <p>Origin Teacher: {row.originTeacher.lastName + ', ' + row.originTeacher.firstName}</p>
                    {row.statuses.map(status => {
                        return (
                            <Aux key={status._id}>
                                <p>
                                    Time: {status.actionTime} <br/>
                                    Action: {status.action} <br/>
                                    Teacher: {status.reviewTeacher.lastName + ', ' + status.reviewTeacher.firstName}
                                    <br/>
                                </p>
                            </Aux>
                        )
                    })}
                </div>
            )
        })
        return (
            <div className={classes.Passes}>
                {this.state.error.message}
                <h1>{this.props.active ? 'Active Passes' : 'All Passes'}</h1>
                {passes}
            </div>
        )
    }
}


export default MyPass
