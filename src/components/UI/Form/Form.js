import React from 'react';
import Input from "../Input/Input";
import Button from "../Button/Button";

const form = (props) => {
    const formElementsArray = [];
    for (let key in props.controls) {
        formElementsArray.push({
            id: key,
            config: props.controls[key]
        });
    }

    let form = formElementsArray.map(formElement => (
        <Input
            key={formElement.id}
            label={formElement.config.label}
            elementType={formElement.config.elementType}
            value={formElement.config.value}
            // elementConfig are passed to down to become html tag attributes
            elementConfig={formElement.config.elementConfig}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event) => props.handleInputChange(event, formElement.id)}/>
    ));

    return (
        <form onSubmit={props.handleSubmit}>
            {form}
            <Button btnType={props.btnType}>{props.btnName}</Button>
        </form>
    )
}

export default form;
