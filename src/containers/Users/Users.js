import React, {Component} from 'react'
import axios from '../../axios-api'
import Aux from "../../hoc/Aux/Aux"
import Modal from "../../components/UI/Modal/Modal"
import Button from "../../components/UI/Button/Button"
import xlsx from 'xlsx'
import Input from "../../components/UI/Input/Input";
import * as util from "../../shared/util";
import Form from "../../components/UI/Form/Form"; // https://docs.sheetjs.com/ https://sheetjs.com/demo
import classes from './Users.module.css'
import * as uuid from 'uuid'

class Users extends Component {
    state = {
        users: [],
        error: false,
        filteredUsers: [],
        filterValue: '',
        selectedUser: false,
        message: false,
        controls: {
            id: {
                elementType: 'input',
                elementConfig: { // passed directly to html tag
                    type: 'text',
                    placeholder: 'Student ID'
                },
                label: 'Unique ID *',
                value: '',
                // validation is handled by inputChangedHandler
                validation: {
                    required: true,
                },
                valid: false,
                touched: false
            },
            firstName: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'First Name'
                },
                label: 'First Name  *',
                value: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false
            },
            lastName: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Last Name'
                },
                label: 'Last Name *',
                value: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Email'
                },
                label: 'Email *',
                value: '',
                valid: false,
                touched: false
            },
            grade: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Grade'
                },
                label: 'Grade',
                value: '',
                valid: false,
                touched: false
            },
            homeroomTeacher: {
                elementType: 'select',
                elementConfig: {
                    options: []
                },
                value: '',
                label: 'Homeroom Teacher',
                valid: false,
                touched: false
            },
            teacherLocation: {
                elementType: 'select',
                elementConfig: {
                    options: []
                },
                value: '',
                label: 'Teacher Location',
                valid: false,
                touched: false
            },
            username: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Username'
                },
                label: 'Username *',
                value: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                },
                label: 'Password',
                value: util.randomString(),
                validation: {
                    required: true,
                },
                valid: false,
                touched: false
            },
            userType: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'STUDENT', displayValue: 'STUDENT'},
                        {value: 'TEACHER', displayValue: 'TEACHER'},
                        {value: 'ADMIN', displayValue: 'ADMIN'}
                    ]
                },
                label: 'User Type',
                value: 'STUDENT',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false
            },
        },

    }

    componentDidMount() {
        (async () => {
            await this.getUsers()
        })();

        (async () => {
            try {
                // get teachers
                const teachers = await axios.get('/teachers')
                const teacherOptions = teachers.data.map(teacher => {
                    return {
                        value: teacher._id,
                        displayValue: `${teacher.lastName}, ${teacher.firstName} (${teacher.room ? teacher.room.room : 'n/a'})`,
                        room: teacher.room ? teacher.room._id : '',
                    }
                })
                teacherOptions.unshift({value: '', displayValue: 'Please select...'})

                // get locations
                const origins = await axios.get('/origins')
                const originOptions = origins.data.map(origin => {
                    return {
                        value: origin._id,
                        displayValue: origin.room,
                    }
                })
                originOptions.unshift({value: '', displayValue: 'Please select...'})

                this.setState({
                    controls: {
                        ...this.state.controls,
                        homeroomTeacher: {
                            ...this.state.controls.homeroomTeacher,
                            elementConfig: {
                                options: teacherOptions,
                            }
                        },
                        teacherLocation: {
                            ...this.state.controls.teacherLocation,
                            elementConfig: {
                                options: originOptions,
                            }
                        }
                    }
                })
            } catch (e) {
                console.log(e)
            }
        })()
    }

    getUsers = async () => {
        try {
            const users = await axios.get('/users')
            this.setState({users: users.data, filteredUsers: users.data})
        } catch (e) {
            this.setState({error: {message: 'Failed to get users'}})
        }
    }

    selectUserHandler = (user) => {
        this.setState({
            selectedUser: user,
            controls: {
                ...this.state.controls,
                id: {
                    ...this.state.controls.id,
                    value: user.id,
                },
                firstName: {
                    ...this.state.controls.firstName,
                    value: user.firstName,
                },
                lastName: {
                    ...this.state.controls.lastName,
                    value: user.lastName,
                },
                email: {
                    ...this.state.controls.email,
                    value: user.email,
                },
                grade: {
                    ...this.state.controls.grade,
                    value: user.grade,
                },
                homeroomTeacher: {
                    ...this.state.controls.homeroomTeacher,
                    value: user.homeroom ? user.homeroom._id : '',
                },
                teacherLocation: {
                    ...this.state.controls.teacherLocation,
                    value: user.room ? user.room._id : '',
                },
                username: {
                    ...this.state.controls.username,
                    value: user.username,
                },
                password: {
                    ...this.state.controls.password,
                    value: user.password,
                },
                userType: {
                    ...this.state.controls.userType,
                    value: user.userType,
                },
            }
        })
    }

    hideUserModalHandler = () => {
        this.setState({
            selectedUser: false,
            message: false,
        })
    }

    filterHandler = (e) => {
        let filteredUsers = this.state.users.filter(user => {
            return (user.firstName + user.lastName).toLowerCase().includes(e.target.value.toLowerCase())
                || user.email.toLowerCase().includes(e.target.value.toLowerCase())
                || user.username.toLowerCase().includes(e.target.value.toLowerCase())
                || user.userType.toLowerCase().includes(e.target.value.toLowerCase())
                || (user.room && user.room.room.trim().toLowerCase().includes(e.target.value.trim().toLowerCase()))
        })
        this.setState({
            filterValue: e.target.value,
            filteredUsers: filteredUsers,
        })
    }

    downloadHandler = () => {
        let flatUsers = this.state.users.map(user => {
            let flat = {
                uuid: user._id,
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                grade: user.grade,
                username: user.username,
                userType: user.userType,
                room: user.room ? user.room.room : ''

            }
            if (user.userType === 'TEACHER' || user.userType === 'ADMIN') {

            }
            return flat
        })

        let wb = xlsx.utils.book_new()
        let ws = xlsx.utils.json_to_sheet(flatUsers,
            {
                header: []
            }
        )
        xlsx.utils.book_append_sheet(wb, ws, 'Users')
        xlsx.writeFile(wb, 'users.xlsx',)
    }

    submitHandler = (event, userObjectId) => {
        event.preventDefault();

        if (!this.state.controls.id.value || !this.state.controls.firstName.value || !this.state.controls.username.value
            || !this.state.controls.userType.value || !this.state.controls.email.value
            || !this.state.controls.lastName.value) {
            this.setState({message: {message: 'ID, First Name, Last Name, Username, Email, and User Type cannot be empty'}})
            return
        }

        try {
            (async () => {
                const user = {
                    id: this.state.controls.id.value,
                    firstName: this.state.controls.firstName.value,
                    lastName: this.state.controls.lastName.value,
                    email: this.state.controls.email.value,
                    username: this.state.controls.username.value,
                    userType: this.state.controls.userType.value,
                }

                if (this.state.controls.password.value) {
                    user.password = this.state.controls.password.value
                }

                user.grade = this.state.controls.grade.value

                user.homeroomTeacher = this.state.controls.homeroomTeacher.value

                if (this.state.controls.teacherLocation.value) {
                    user.teacherLocation = this.state.controls.teacherLocation.value
                }

                const res = await axios.patch('/users/' + userObjectId, user)
                if (res.data._id) {
                    this.setState({message: {message: 'User updated'}})
                } else {
                    this.setState({message: {message: res.data.error}})
                }
            })()
        } catch (e) {
            this.setState({message: {message: 'Failed to update user'}})
        }
    }

    resetQrCodeHandler = async (e, userObjectId) => {
        e.preventDefault()
        try {
            const qrString = uuid.v4()
            console.log(qrString)
            const resetRes = await axios.patch('/users/'+userObjectId, {qrString})
            if(resetRes.data._id){
                this.setState({message: {message: 'Reset successful'}})
            } else {
                this.setState({message: {message: 'Failed to reset'}})
            }
        } catch (e){

        }
    }

    inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                // delegate input validation to a utility function
                valid: util.validateInput(event.target.value, this.state.controls[controlName].validation),
                touched: true,
            }
        }

        this.setState({controls: updatedControls})
    }

    quickLoginHandler = (objectId) => {
        this.props.history.push('/studentQr/' + objectId)
    }

    render() {
        let users = this.state.filteredUsers.map(row => {
            return (
                <tr key={row._id}>
                    <td><Button clicked={() => {
                        this.selectUserHandler(row)
                    }} btnType='Warn'>{row.id}</Button></td>
                    <td>{row.firstName}</td>
                    <td>{row.lastName}</td>
                    <td>{row.email}</td>
                    <td>{row.grade}</td>
                    <td>{row.username}</td>
                    <td>{row.userType}</td>
                    <td>{row.userType === 'STUDENT' && <Button btnType='Success'
                                                               clicked={() => {
                                                                   this.quickLoginHandler(row._id)
                                                               }}
                    >QR Code</Button>}</td>
                    <td>{row.room ? row.room.room : ''}</td>
                </tr>
            )
        })
        let modalBody = null;
        if (this.state.selectedUser) {
            modalBody =
                <Aux>
                    <Form handleSubmit={(e) => {
                        this.submitHandler(e, this.state.selectedUser._id)
                    }}
                          controls={this.state.controls}
                          handleInputChange={this.inputChangedHandler}
                          btnType="Success"
                          btnName="Update User"/>
                    {this.state.selectedUser.userType === 'STUDENT' &&
                    <Button clicked={(e) => {
                        this.resetQrCodeHandler(e, this.state.selectedUser._id)
                    }}
                            btnType="Success">Reset QR Code</Button>
                    }
                </Aux>
        }
        return (
            <div className={classes.Users}>
                <Button btnType='Success' clicked={this.downloadHandler}>Download</Button>
                <Modal show={this.state.selectedUser} modalClosed={this.hideUserModalHandler}>
                    {modalBody}
                    {this.state.message.message}
                </Modal>
                {this.state.message.message}
                <h1>Users</h1>
                <Input elementType='input'
                       elementConfig={{placeholder: 'Search Users...'}}
                       value={this.state.filterValue}
                       changed={this.filterHandler}/>
                <table className={classes.Table}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Grade</th>
                        <th>Username</th>
                        <th>User Type</th>
                        <th>Quick Login</th>
                        <th>Default Room</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users}
                    </tbody>
                </table>
            </div>
        )
    }
}


export default Users
