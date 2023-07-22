let activi = [];

if (JSON.parse(localStorage.getItem('activity'))) {
    activi = JSON.parse(localStorage.getItem('activity'))
}

const stateDefault = {
    arrActivity: activi,

}


export const ActivityReducer = (state = stateDefault, action) => {
    switch (action.type) {

        case 'GET_LIST_ACTIVITY': {
            state.arrActivity = action.arrActivity;
            return { ...state }
        }

        default: return state;
    }
}