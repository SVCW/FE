const stateDefault = {
    arrFanpage: [],
    fanpageId: {},
    fanpageActivity: []
}


export const FanpageReducer = (state = stateDefault, action) => {
    switch (action.type) {

        case 'GET_LIST_FANPAGE': {
            state.arrFanpage = action.arrFanpage;
            return { ...state }
        }
        case 'GET_LIST_FANPAGE_ID': {
            state.fanpageId = action.fanpageId;
            state.fanpageActivity = action.fanpageActivity;
            return { ...state }
        }

        default: return state;
    }
}