

const stateDefault = {
    arrActivity: [],
    activityId: {}
}


export const ActivityReducer = (state = stateDefault, action) => {
    switch (action.type) {

        case 'GET_LIST_ACTIVITY': {
            state.arrActivity = action.arrActivity;
            return { ...state }
        }
        case 'GET_ACTIVITY_ID': {
            state.activityId = action.activityId;
            return { ...state }
        }

        default: return state;
    }
}