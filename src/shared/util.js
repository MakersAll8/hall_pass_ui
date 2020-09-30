import moment from "moment-timezone";

export const validateInput = ( value, rules ) => {
    let isValid = true;
    if ( !rules ) {
        return true;
    }

    if ( rules.required ) {
        isValid = value.trim() !== '' && isValid;
    }

    if ( rules.minLength ) {
        isValid = value.length >= rules.minLength && isValid
    }

    if ( rules.maxLength ) {
        isValid = value.length <= rules.maxLength && isValid
    }

    // if ( rules.isEmail ) {
    //     const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    //     isValid = pattern.test( value ) && isValid
    // }

    if ( rules.isNumeric ) {
        const pattern = /^\d+$/;
        isValid = pattern.test( value ) && isValid
    }

    return isValid;
}

export const randomString = ()=>{
    return Math.random().toString(36).slice(2)
}

export const APP_URL = process.env.APP_URL || 'https://sfhs.bonvivant.tech'

export const TZ = process.env.TZ || 'America/Chicago'

export const toLocalTimeString = (utcTimeString)=>{
    return moment(utcTimeString).tz(TZ).format('h:mm:ss a MM/DD/YYYY')
}
