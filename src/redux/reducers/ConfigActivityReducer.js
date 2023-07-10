const stateDefault = {
    configActivity: [],

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