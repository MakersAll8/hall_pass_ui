import React, {Component} from 'react'
import axios from '../../axios-api'
import classes from './MyPass.module.css'
import Aux from "../../hoc/Aux/Aux";
import Modal from "../../components/UI/Modal/Modal";
import Button from "../../components/UI/Button/Button";

class MyPass extends Component {
    state = {
        passes: [],
        error: false,
        showAction: false,
        modalActions: []
    }

    componentDidMount() {
        (async () => {
            await this.getPasses()
        })()
        if (this.props.active) {
            // When user is on the active pass page, update every 5s
            this.updateInterval = setInterval((async () => {
                await this.getPasses()
            }), 5000)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.active !== prevProps.active) {
            (async () => {
                await this.getPasses()
            })()
            if (this.props.active) {
                // When user is on the active pass page, update every 5s
                this.updateInterval = setInterval((async () => {
                    await this.getPasses()
                }), 5000)
            } else {
                if (this.updateInterval) {
                    clearInterval(this.updateInterval)
                }
            }
        }
    }

    componentWillUnmount() {
        // if an auto update exists, stop it
        if (this.updateInterval) {
            clearInterval(this.updateInterval)
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

    hideActionHandler = () => {
        this.setState({showAction: false})
    }

    showActionHandler = (statuses) => {
        this.setState({showAction: true, modalActions: statuses,})
    }

    render() {
        let passes = this.state.passes.map(row => {
            return (
                <tr className={row.active ? classes.Active : null} key={row._id}>
                    <td>{row.active ? 'ACTIVE' : 'INACTIVE'}</td>
                    <td>{row.createTime}</td>
                    <td>{row.student.lastName}, {row.student.firstName}</td>
                    <td>{row.student.grade}</td>
                    <td>{row.destination.room}</td>
                    <td>{row.destinationTeacher ?
                        `${row.destinationTeacher.lastName}, ${row.destinationTeacher.firstName}`
                        : null}</td>
                    <td>{row.origin.room}</td>
                    <td>{row.originTeacher.lastName + ', ' + row.originTeacher.firstName}</td>
                    <td><Button btnType="Warn" clicked={() => {
                        this.showActionHandler(row.statuses)
                    }}>Show</Button></td>
                </tr>
            )
        })
        const modalActions = this.state.modalActions.map(status => {
            return (
                <Aux key={status._id}>
                    <p>
                        Action: {status.action} <br/>
                        Time: {status.actionTime} <br/>
                        Teacher: {status.reviewTeacher.lastName + ', ' + status.reviewTeacher.firstName}
                        <br/>
                    </p>
                </Aux>
            )
        })
        return (
            <div className={classes.Passes}>
                <Modal show={this.state.showAction} modalClosed={this.hideActionHandler}>
                    {modalActions}
                </Modal>
                {this.state.error.message}
                <h1>{this.props.active ? 'Active Passes' : 'All Passes'}</h1>
                <table>
                    <thead>
                    <tr>
                        <th>Status</th>
                        <th>Create Time</th>
                        <th>Student</th>
                        <th>Grade</th>
                        <th>Destination</th>
                        <th>Destination Teacher</th>
                        <th>Origin</th>
                        <th>Origin Teacher</th>
                        <th>Show Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {passes}
                    </tbody>
                </table>
            </div>
        )
    }
}


export default MyPass
