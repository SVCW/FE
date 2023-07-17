const stateDefault = {
    arrFollowJoin: [],

}


export const HistoryReducer = (state = stateDefault, action) => {
    switch (action.type) {

        case 'GET_LIST_HISTORY_FOLLOWJOIN': {
            state.arrFollowJoin = action.arrFollowJoin;
            return { ...state }
        }

        default: return state;
    }
}