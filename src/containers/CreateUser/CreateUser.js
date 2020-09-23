import React, {Component} from 'react'
import axios from '../../axios-api'
import Form from "../../components/UI/Form/Form";
import * as util from "../../shared/util";

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
                label: 'First Name',
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
                label: 'Last Name',
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
                label: 'Email',
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
                validation: {
                    required: true,
                },
                label: 'Homeroom Teacher',
                valid: false,
                touched: false
            },
            username: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Username'
                },
                label: 'Username',
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
                label: 'Username',
                value: '',
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
                        {value:'STUDENT',displayValue:'STUDENT'},
                        {value:'TEACHER',displayValue:'TEACHER'},
                        {value:'ADMIN',displayValue:'ADMIN'}
                    ]
                },
                value: 'STUDENT',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false
            },
        }
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
                this.setState({
                    controls : {
                        ...this.state.controls,
                        homeroomTeacher : {
                            ...this.state.controls.homeroomTeacher,
                            elementConfig : {
                                options: teacherOptions,
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

    render() {
        return (
            <div>
                <h1>Create User</h1>
                <Form handleSubmit={this.submitHandler}
                      controls={this.state.controls}
                      handleInputChange={this.inputChangedHandler}
                      btnType="Success"
                      btnName="Create User"/>
            </div>
        )
    }
}

export default CreateUser
