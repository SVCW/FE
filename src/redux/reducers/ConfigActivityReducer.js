const stateDefault = {
    configActivity: localStorage.getItem('donation'),
    // configActivity: true,
    isValidCreate: localStorage.getItem('isValidCreate'),
    message: localStorage.getItem('message'),
    // isValidCreate: false,
}


export const ConfigActivityReducer = (state = stateDefault, action) => {
    switch (action.type) {

        case 'GET_CONFIG': {
            state.configActivity = action.configActivity;
            state.isValidCreate = action.isValidCreate;
            state.message = action.message;
            return { ...state }
        }

        default: return state;
    }
}