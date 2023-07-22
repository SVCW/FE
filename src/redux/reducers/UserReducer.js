const stateDefault = {
    userByID: {},

}


export const UserReducer = (state = stateDefault, action) => {
    switch (action.type) {

        case 'GET_USER_BY_ID': {
            state.userByID = action.userByID;
            return { ...state }
        }

        default: return state;
    }
}