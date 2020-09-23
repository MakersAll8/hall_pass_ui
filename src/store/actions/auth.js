import axios from '../../axios-api';
import * as actionTypes from './actionTypes';

// sync action creator
// triggers reducer to modify state with these arguments
export const authSuccess = (token, user, expires) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token,
        user,
        expires,
    };
};

export const authCheckState = () =>{
    return dispatch => {
        const token = localStorage.getItem('token');
        if (token) {
            const expires = new Date(parseInt(localStorage.getItem('expires')));
            if (expires <= new Date()) {
                dispatch(logout());
            } else {
                const user = JSON.parse(localStorage.getItem('user'));
                dispatch(authSuccess(token, user, expires));
            }
        }
    };
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error,
    };
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expires');
    localStorage.removeItem('user');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

// this is an async action creator
export const auth = (email, password) => {
    return dispatch => {
        const authData = {
            email: email,
            password: password
        };
        // async api call
        axios.post('/login', authData)
            .then(res => {
                const expires = new Date(res.data.expires);
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem('expires', expires.getTime().toString());

                // eventually dispatches a sync action creator
                dispatch(authSuccess(res.data.token, res.data.user, res.data.expires));
            })
            .catch(err => {
                // eventually dispatches a sync action creator
                dispatch(authFail({message: 'Login Failed'}));
            });
    };
};

export const setRedirectPath = (path) => {
    return {
        type: actionTypes.SET_REDIRECT_PATH,
        path: path
    };
};

