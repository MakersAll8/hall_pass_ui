import * as actionTypes from '../actions/actionTypes';

const initialState = {
    activePasses: null,

};

const getActivePass = (state, action) => {
    return {
        ...state,
    }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        // once reducer receives an action dispatch, return a new state
        // creation of new state is delegated to a function
        case actionTypes.GET_ACTIVE_PASS:
            return getActivePass(state, action);
        default:
            return state;
    }
};

export default reducer;
