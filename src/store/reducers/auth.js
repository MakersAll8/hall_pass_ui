import * as actionTypes from '../actions/actionTypes';

const initialState = {
    token: null,
    user: null,
    expires: null,
    error: false,
    redirectPath: '/'
};

// modifies state and return the new state
const authSuccess = (state, action) => {
    return {
        ...state,
        token: action.token,
        user: action.user,
        expires: action.expires,
    }
};

const authFail = (state, action) => {
    return {
        ...state,
        error: action.error,
    }
};

const authLogout = (state, action) => {
    return {
        ...state,
        token: null,
        user: null,
        expires: null,
    }
};

const setRedirectPath = (state, action)=>{
    return {
        ...state,
        redirectPath: action.path,
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        // once reducer receives an action dispatch, return a new state
        // creation of new state is delegated to a function
        case actionTypes.AUTH_SUCCESS:
            return authSuccess(state, action);
        case actionTypes.AUTH_FAIL:
            return authFail(state, action);
        case actionTypes.AUTH_LOGOUT:
            return authLogout(state, action);
        case actionTypes.SET_REDIRECT_PATH:
            return setRedirectPath(state, action);
        default:
            return state;
    }
};

export default reducer;
