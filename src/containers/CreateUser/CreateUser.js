import React, {Component} from 'react'
import axios from '../../axios-api'
import Form from "../../components/UI/Form/Form"
import * as util from "../../shared/util"
import classes from './CreateUser.module.css'
import Modal from "../../components/UI/Modal/Modal";

class CreateUser extends Component {
    state = {
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
                label: 'Password *',
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
        message: false,

    }

    componentDidMount() {
        // init origin
        (async () => {
            try {
                // get teachers
                const teachers = await axios.get('/teachers')
                const teacherOptions = teachers.data.map(teacher => {
                    return {
                        value: teacher._id,
                        displayValue: `${teacher.lastName}, ${teacher.firstName} (${teacher.room.room})`,
                        room: teacher.room._id,
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
            }
        })()
    }

    submitHandler = (event) => {
        event.preventDefault();

        if (!this.state.controls.id.value || !this.state.controls.firstName.value || !this.state.controls.username.value
            || !this.state.controls.password.value || !this.state.controls.userType.value || !this.state.controls.email.value
            || !this.state.controls.lastName.value) {
            this.setState({message: {message: 'ID, First Name, Last Name, Username, Password, Email, and User Type cannot be empty'}})
            return
        }

        try {
            (async () => {
                const user = {
                    id: this.state.controls.id.value,
                    firstName: this.state.controls.firstName.value,
                    lastName: this.state.controls.lastName.value,
                    email: this.state.controls.email.value,
                    grade: this.state.controls.grade.value,
                    homeroomTeacher: this.state.controls.homeroomTeacher.value,
                    teacherLocation: this.state.controls.teacherLocation.value,
                    username: this.state.controls.username.value,
                    password: this.state.controls.password.value,
                    userType: this.state.controls.userType.value,
                }
                const res = await axios.post('/users', user)
                if (res.data.user) {
                    this.setState({message: {message: 'User created'}})
                } else {
                    this.setState({message: {message: res.data.error}})
                }
            })()
        } catch (e) {
            this.setState({message: {message: 'Failed to create user'}})
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

    hideModal = () => {
        this.setState({message: false})
    }

    render() {
        const message = this.state.message.message
        return (
            <div className={classes.CreateUser}>
                <h1>Create User</h1>
                <Form handleSubmit={this.submitHandler}
                      controls={this.state.controls}
                      handleInputChange={this.inputChangedHandler}
                      btnType="Success"
                      btnName="Create User"/>
                <Modal show={this.state.message} modalClosed={this.hideModal}>
                    {message}
                </Modal>
            </div>
        )
    }
}

export default CreateUser
