import React, {Component} from 'react'
import axios from '../../axios-api'

import {connect} from 'react-redux';
import Form from "../../components/UI/Form/Form";
import * as util from "../../shared/util";
import {Redirect} from "react-router-dom";
import classes from './Home.module.css'

class Home extends Component {
    state = {
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
        error: false,
        redirectToMyPass: false,
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
                        displayValue: `${teacher.lastName}, ${teacher.firstName} (${teacher.room? teacher.room.room: 'n/a'})`,
                        room: teacher.room? teacher.room._id : '',
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
                        value: teacherOptions[0].value,
                        room: teacherOptions[0].room,
                    },
                    destination: {
                        ...this.state.controls.destination,
                        elementConfig: {
                            options: destinationOptions,
                        },
                        value: destinationOptions[0].value,
                    },
                    origin: {
                        ...this.state.controls.origin,
                        elementConfig: {
                            options: originOptions,
                        },
                        value: teacherOptions[0].room
                    },
                }

                this.setState({
                    controls: updatedControls,
                    allTeachers: teacherOptions,
                    origins: originOptions,
                    destinations: destinationOptions,
                })
            } catch (e) {
                console.log(e)
            }
        })()

    }

    // handlers call dispatch
    submitHandler = (event) => {
        event.preventDefault()
        const destinationData = this.state.controls.destination.value.split(';')
        // console.log("origin teacher id", this.state.controls.originTeacher.value)
        // console.log("destination id", destinationData[0])

        // console.log("origin id", this.state.controls.origin.value)

        const passRequest = {
            destination: destinationData[0],
            origin: this.state.controls.origin.value,
            originTeacher: this.state.controls.originTeacher.value,
        }
        if (destinationData.length > 1) {
            passRequest.destinationTeacher = destinationData[1]
        }

        (async () => {
            try {
                const pass = await axios.post('/requestPass', passRequest)
                if (pass.data._id) {
                    this.setState({
                        error: false,
                        redirectToMyPass: true,
                    })
                } else {
                    this.setState({
                        error: {message: 'Failed to create a pass request'}
                    })
                }
            } catch (e) {
                console.log(e)
                this.setState({
                    error: {message: 'Failed to create a pass request'}
                })
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
            console.log(fallbackRoom)
            const defaultRoom = this.state.allTeachers.filter(teacher => (teacher.value === event.target.value))
            updatedControls.origin = {
                ...updatedControls.origin,
                value: defaultRoom[0].room? defaultRoom[0].room : fallbackRoom
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

    render() {
        let errorMessage = null;
        if (this.state.error) {
            errorMessage = (
                <p>{this.state.error.message}</p>
            );
        }
        let redirectMyPasses = null;
        if (this.state.redirectToMyPass) {
            redirectMyPasses = <Redirect to="/activePasses"/>
        }

        return (
            <div className={classes.Home}>
                {redirectMyPasses}
                {errorMessage}
                <h1>Request a Pass</h1>
                <p>Logged in as: <i>{this.props.loggedInAs}</i></p>
                <Form handleSubmit={this.submitHandler}
                      controls={this.state.controls}
                      handleInputChange={this.inputChangedHandler}
                      btnType="Success"
                      btnName="Send Request"
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        loggedInAs: `${state.auth.user.lastName}, ${state.auth.user.firstName}`,
    };
};


export default connect(mapStateToProps)(Home)
