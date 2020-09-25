import React, {Component} from 'react'
import Form from "../../components/UI/Form/Form"
import * as util from "../../shared/util"
import axios from '../../axios-api'
import classes from './UpdatePassword.module.css'

class UpdatePassword extends Component {
    state = {
        controls: {
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password',
                    autoComplete: 'off',
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5
                },
                valid: false,
                touched: false
            },
            confirmPassword: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Confirm Password',
                    autoComplete: 'off',
                },
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

    // handlers call dispatch
    submitHandler = (event) => {
        event.preventDefault();
        console.log('[handler]')
        if (!this.state.controls.password.value || !this.state.controls.confirmPassword.value) {
            this.setState({message: {message: 'Password cannot be empty'}})
            return
        }
        if (this.state.controls.password.value !== this.state.controls.confirmPassword.value) {
            this.setState({message: {message: 'Passwords do not match'}})
            return
        }
        if(!this.state.controls.password.valid){
            this.setState({message: {message: 'Passwords must be longer than 5 digits'}})
            return
        }
        (async () => {
            try {
                const res = await axios.patch('/updatePassword', {password: this.state.controls.password.value})
                if(res.data._id){
                    this.setState({message: {message: 'Password updated'}})
                } else {
                    this.setState({message: {message: 'Failed to update password'}})
                }
            } catch {
                this.setState({message: {message: 'Failed to update password'}})
            }
        })()
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
        let message = null;
        if (this.state.message) {
            message = (
                <p>{this.state.message.message}</p>
            );
        }
        return (
            <div className={classes.UpdatePassword}>
                {message}
                <h1>Change My Password</h1>
                <Form handleSubmit={this.submitHandler}
                      controls={this.state.controls}
                      handleInputChange={this.inputChangedHandler}
                      btnType="Success"
                      btnName="Change Password"
                />
            </div>
        )
    }
}

export default UpdatePassword

