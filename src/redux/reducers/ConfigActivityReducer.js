const stateDefault = {
    configActivity: localStorage.getItem('donation'),
    // configActivity: true,
    isValidCreate: localStorage.getItem('isValidCreate'),
    // isValidCreate: false,
}


export const ConfigActivityReducer = (state = stateDefault, action) => {
    switch (action.type) {

        case 'GET_CONFIG': {
            state.configActivity = action.configActivity;
            return { ...state }
        }

        default: return state;
    }
}