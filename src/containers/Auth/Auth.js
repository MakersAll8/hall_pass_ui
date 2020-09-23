import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as util from "../../shared/util";
import Form from "../../components/UI/Form/Form";

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: { // passed directly to html tag
                    type: 'text',
                    placeholder: 'Username or Email Address'
                },
                value: '',
                // validation is handled by inputChangedHandler
                validation: {
                    required: true,
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5
                },
                valid: false,
                touched: false
            }
        }
    }

    // handlers call dispatch
    submitHandler = ( event ) => {
        event.preventDefault();
        this.props.onAuth( this.state.controls.email.value, this.state.controls.password.value);
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
        let errorMessage = null;
        if (this.props.error) {
            errorMessage = (
                <p>{this.props.error.message}</p>
            );
        }
        return (
            <div className={classes.Auth}>
                {errorMessage}
                <h1>Login</h1>
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

// get redux state as props
const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        error: state.auth.error,
    };
};

// update redux state through dispatching actions
// state changes trigger render
const mapDispatchToProps = dispatch => {
    return {
        // dispatch takes an action as an argument, in the format of {type: ... , payload: ...}
        // actions.auth is an action creator which eventually returns an action {type: ... , payload: ...}
        // action creator can be synchronous and asynchronous
        // redux reducer does not handle asynchronous requests
        // async action creator processes async calls, when results come back, dispatch a sync action
        // sync action: reducer handles these
        onAuth: ( email, password ) => dispatch( actions.auth( email, password ) ),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth)

