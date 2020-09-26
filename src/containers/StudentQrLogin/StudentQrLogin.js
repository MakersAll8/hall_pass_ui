import React, {Component} from 'react'
import axios from '../../axios-api';
import Form from "../../components/UI/Form/Form";
import * as util from "../../shared/util";
import {connect} from "react-redux";
import * as actions from "../../store/actions";

class StudentQrLogin extends Component {
    state = {
        uuid: false,
        controls: {
            id: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Student ID'
                },
                label: 'Enter Your Student ID to Verify Your Identity',
                value: '',
                validation: {
                    required: true,
                    minLength: 5
                },
                valid: false,
                touched: false
            }
        },
        message: false,
    }

    componentDidMount() {
        this.setState({
            uuid: this.props.match.match.params.uuid,
        })
    }

    submitHandler = (e) => {
        e.preventDefault();
        // submit to studentQrLogin/uuid
        try {
            (async () => {
                const studentRes = await axios.post('/studentQrLogin/'+this.state.uuid, {id: this.state.controls.id.value})
                if(studentRes.data.user){
                    this.props.authenticated(studentRes.data.token, studentRes.data.user, studentRes.data.expires)
                    this.props.match.history.push('/home')
                } else {
                    this.setState({message : {message:'Failed to login'}})
                }
            })()
        } catch (e) {

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

    render() {
        return (
            <div>
                {this.state.message.message}
                <h1>Verify Student ID</h1>
                <p>Verifying QR Code with UUID: {this.props.match.match.params.uuid}</p>
                <Form handleSubmit={this.submitHandler}
                      controls={this.state.controls}
                      handleInputChange={this.inputChangedHandler}
                      btnType="Success"
                      btnName="Login"
                />
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        // dispatch takes an action as an argument, in the format of {type: ... , payload: ...}
        // actions.auth is an action creator which eventually returns an action {type: ... , payload: ...}
        // action creator can be synchronous and asynchronous
        // redux reducer does not handle asynchronous requests
        // async action creator processes async calls, when results come back, dispatch a sync action
        // sync action: reducer handles these
        authenticated: (token, user, expires) => dispatch(actions.authSuccess(token, user, expires)),
    };
};

export default connect(null, mapDispatchToProps)(StudentQrLogin)
