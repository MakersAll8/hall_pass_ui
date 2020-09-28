import React, {Component} from 'react'
import axios from '../../axios-api'
import classes from './MyPass.module.css'
import Modal from "../../components/UI/Modal/Modal"
import Button from "../../components/UI/Button/Button"
import xlsx from 'xlsx'
import PassInfo from "../../components/UI/PassInfo/PassInfo"; // https://docs.sheetjs.com/ https://sheetjs.com/demo
import moment from 'moment-timezone'
import * as util from '../../shared/util'

class MyPass extends Component {
    state = {
        passes: [],
        error: false,
        modal: false
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
        this.setState({modal: false})
    }

    showActionHandler = (row) => {
        this.setState({modal: row,})
    }

    downloadHandler = () => {
        console.log(this.state.passes)
        let flatPasses = this.state.passes.map(pass => {
            let flat = {
                _id: pass._id,
                active: pass.active,
                createTime: pass.createTime,
                studentFN: pass.student.firstName,
                studentLN: pass.student.lastName,
                grade: pass.student.grade,
                destination: pass.destination.room,
                origin: pass.origin.room,
                originTeacherFN: pass.originTeacher.firstName,
                originTeacherLN: pass.originTeacher.lastName,
                actions: JSON.stringify(pass.statuses),
            }
            if (pass.destinationTeacher) {
                flat.destinationTeacherFN = pass.destinationTeacher.firstName
                flat.destinationTeacherLN = pass.destinationTeacher.lastName
            }
            return flat
        })

        let wb = xlsx.utils.book_new()
        let ws = xlsx.utils.json_to_sheet(flatPasses,
            {
                header: [
                    '_id', 'active', 'createTime', 'studentFN', 'studentLN', 'grade', 'destination', 'origin',
                    'originTeacherFN', 'originTeacherLN', 'destinationTeacherFN', 'destinationTeacherLN', 'actions'
                ]
            }
        )
        xlsx.utils.book_append_sheet(wb, ws, 'AllPasses')
        xlsx.writeFile(wb, 'passes.xlsx',)
    }

    render() {
        let passes = this.state.passes.map(row => {
            return (
                <tr className={row.active ? classes.Active : null} key={row._id}>
                    <td>{row.active ? 'ACTIVE' : 'INACTIVE'}</td>
                    <td>{util.toLocalTimeString(row.createTime)}</td>
                    <td>{row.student.lastName}, {row.student.firstName}</td>
                    <td>{row.student.grade}</td>
                    <td>{row.destination.room}</td>
                    <td>{row.destinationTeacher ?
                        `${row.destinationTeacher.lastName}, ${row.destinationTeacher.firstName}`
                        : null}</td>
                    <td>{row.origin.room}</td>
                    <td>{row.originTeacher.lastName + ', ' + row.originTeacher.firstName}</td>
                    <td><Button btnType="Warn" clicked={() => {
                        this.showActionHandler(row)
                    }}>Show</Button></td>
                </tr>
            )
        })
        let modalBody = null;
        if (this.state.modal) {
            modalBody = <PassInfo pass={this.state.modal}/>
        }
        return (
            <div className={classes.Passes}>
                <Button btnType='Success' clicked={this.downloadHandler}>Download</Button>
                <Modal show={this.state.modal} modalClosed={this.hideActionHandler}>
                    {modalBody}
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
