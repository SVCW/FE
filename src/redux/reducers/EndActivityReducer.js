const stateDefault = {
    arrActivity: [],

}


export const EndActivityReducer = (state = stateDefault, action) => {
    switch (action.type) {

        case 'GET_LIST_END_ACTIVITY': {
            state.arrActivity = action.arrActivity;
            return { ...state }
        }

        default: return state;
    }
}