const stateDefault = {
    userByID: {},
    userByStatis: {}
}


export const UserReducer = (state = stateDefault, action) => {
    switch (action.type) {

        case 'GET_USER_BY_ID': {
            state.userByID = action.userByID || action.getUserId;
            return { ...state }
        }
        case 'GET_USER_BY_STATIS': {
            state.userByStatis = action.userByStatis
            return { ...state }
        }

        default: return state;
    }
}