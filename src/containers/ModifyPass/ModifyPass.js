import React, {Component} from 'react'
import axios from "../../axios-api";
import * as util from "../../shared/util";
import Form from "../../components/UI/Form/Form";
import Modal from "../../components/UI/Modal/Modal";


class ModifyPass extends Component {
    state = {
        pass: null,
        message: null,
        controls: {
            originTeacherSearch: {
                elementType: 'input',
                elementConfig: { // passed directly to html tag
                    type: 'text',
                    placeholder: 'Supervisor Search...',
                },
                label: 'Send Request To',
                value: '',
                validation: {
                    required: false,
                },
                valid: false,
                touched: false
            },
            originTeacher: {
                elementType: 'select',
                elementConfig: {
                    options: []
                },
                value: '',
                info: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false
            },

            destinationSearch: {
                elementType: 'input',
                elementConfig: { // passed directly to html tag
                    type: 'text',
                    placeholder: 'Destination Search...',
                },
                label: 'Select Destination',
                value: '',
                validation: {
                    required: false,
                },
                valid: false,
                touched: false
            },
            destination: {
                elementType: 'select',
                elementConfig: {
                    options: []
                },
                value: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false
            },

            originSearch: {
                elementType: 'input',
                elementConfig: { // passed directly to html tag
                    type: 'text',
                    placeholder: 'Origin Search...',
                },
                label: 'Select Origin',
                value: '',
                validation: {
                    required: false,
                },
                valid: false,
                touched: false
            },
            origin: {
                elementType: 'select',
                elementConfig: {
                    options: []
                },
                value: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false
            },
        },
        allTeachers: [],
        destinations: [],
        origins: [],
    }

    componentDidMount() {
        (async () => {
            try {
                const passRes = await axios.get('/isPassActive/' + this.props.match.match.params.id
                    + '/' + this.props.match.match.params.uuid)
                const pass = passRes.data
                // get teachers
                const teachers = await axios.get('/teachers')
                const teacherOptions = teachers.data.map(teacher => {
                    return {
                        value: teacher._id,
                        displayValue: `${teacher.lastName}, ${teacher.firstName} (${teacher.room ? teacher.room.room : 'n/a'})`,
                        room: teacher.room ? teacher.room._id : '',
                    }
                })

                // get destinations
                const destinations = await axios.get('/destinations')
                let destinationOptions = destinations.data.map(destination => {
                    if (destination.teachers && destination.teachers.length > 0) {
                        return destination.teachers.map(teacher => {
                            return {
                                value: `${destination._id};${teacher._id}`,
                                displayValue: `${destination.room} - ${teacher.lastName}, ${teacher.firstName}`,
                            }
                        })
                    } else {
                        return {
                            value: destination._id,
                            displayValue: `${destination.room}`,
                        }
                    }
                })
                // flatten the array
                destinationOptions = destinationOptions.reduce((a, c) => a.concat(c), [])

                // get origins
                const origins = await axios.get('/origins')
                const originOptions = origins.data.map(origin => {
                    const residentTeachers = origin.teachers.map(teacher => (
                            `[${teacher.lastName}, ${teacher.firstName}]`
                        )
                    ).join(' ')
                    return {
                        value: origin._id,
                        displayValue: `${origin.room} ${residentTeachers}`,
                    }
                })

                // create a new controls object
                // do not mutate non-primitive types such as array and object
                const updatedControls = {
                    ...this.state.controls,
                    originTeacher: {
                        ...this.state.controls.originTeacher,
                        elementConfig: {
                            options: teacherOptions
                        },
                        value: pass.originTeacher._id,
                        room: teacherOptions[0].room,
                    },
                    destination: {
                        ...this.state.controls.destination,
                        elementConfig: {
                            options: destinationOptions,
                        },
                        value: pass.destination._id + ';' +
                            (pass.destinationTeacher ?  pass.destinationTeacher._id : ''),
                    },
                    origin: {
                        ...this.state.controls.origin,
                        elementConfig: {
                            options: originOptions,
                        },
                        value: pass.origin._id
                    },
                }

                this.setState({
                    controls: updatedControls,
                    allTeachers: teacherOptions,
                    origins: originOptions,
                    destinations: destinationOptions,
                    pass: pass,
                })
            } catch (e) {
                console.log(e)
            }
        })()
    }

    inputChangedHandler = (event, controlName) => {
        // update input
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

        // if originTeacherSearch is updated, update the supervisor dropdown
        if (controlName === 'destinationSearch') {
            const destinationOptions = this.state.destinations.filter(destination => {
                return destination.displayValue.toLowerCase().includes(event.target.value.toLowerCase())
            });

            // update destination dropdown
            updatedControls.destination.elementConfig.options = destinationOptions
            if (destinationOptions.length > 0) {
                updatedControls.destination.value = destinationOptions[0].value
            }
        }

        // if originTeacher is updated, update the default origin
        if (controlName === 'originTeacher') {
            // maps through allTeachers to get info
            const fallbackRoom = this.state.allTeachers[0].room;
            const defaultRoom = this.state.allTeachers.filter(teacher => (teacher.value === event.target.value))
            updatedControls.origin = {
                ...updatedControls.origin,
                value: defaultRoom[0].room ? defaultRoom[0].room : fallbackRoom
            }
        }

        // if originTeacherSearch is updated, update the supervisor dropdown
        if (controlName === 'originTeacherSearch') {
            const teacherOptions = this.state.allTeachers.filter(teacher => {
                return teacher.displayValue.toLowerCase().includes(event.target.value.toLowerCase())
            });

            // update teachers dropdown
            updatedControls.originTeacher.elementConfig.options = teacherOptions
            if (teacherOptions.length > 0) {
                updatedControls.originTeacher.value = teacherOptions[0].value
                updatedControls.originTeacher.room = teacherOptions[0].room

                // update origin to teacher's default location
                const fallbackRoom = this.state.allTeachers[0].room;
                updatedControls.origin = {
                    ...updatedControls.origin,
                    value: teacherOptions[0].room ? teacherOptions[0].room : fallbackRoom,
                }
            }
        }

        this.setState({controls: updatedControls})
    }

    submitHandler = (e) => {
        e.preventDefault();
        console.log(this.state);

        (async () => {
            try {
                const destinationData = this.state.controls.destination.value.split(';')

                const passRequest = {
                    destination: destinationData[0],
                    origin: this.state.controls.origin.value,
                    originTeacher: this.state.controls.originTeacher.value,
                }
                if (destinationData.length > 1) {
                    passRequest.destinationTeacher = destinationData[1]
                }

                const passRes = await axios.patch('/modifyPass/' + this.state.pass._id
                    + '/' + this.state.pass.accessPin, passRequest)
                if (passRes.data._id) {
                    this.props.match.history.push('/isPassActive/' + this.state.pass._id + '/' + this.state.pass.accessPin)
                } else {
                    this.setState({
                        message: {message: 'Failed to update pass 2'}
                    })
                }
            } catch (e) {
                console.log(e)
                this.setState({
                    message: {message: 'Failed to update pass'}
                })
            }
        })()
    }

    hideActionHandler = () => {
        this.setState({message: null})
    }

    render() {
        let modalBody = null
        if (this.state.message) {
            modalBody = <p>{this.state.message.message}</p>
        }
        return (
            <div>
                <Modal show={this.state.message} modalClosed={this.hideActionHandler}>
                    {modalBody}
                </Modal>
                <h1>Modify Pass</h1>
                <Form handleSubmit={this.submitHandler}
                      controls={this.state.controls}
                      handleInputChange={this.inputChangedHandler}
                      btnType="Success"
                      btnName="Modify Pass"
                />
            </div>
        )
    }

}

export default ModifyPass
