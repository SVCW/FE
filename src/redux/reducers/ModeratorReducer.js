const stateDefault = {
    arrModerator: []
}


export const ModeratorReducer = (state = stateDefault, action) => {
    switch (action.type) {

        case 'GET_LIST_MODERATOR': {
            state.arrModerator = action.arrModerator;
            return { ...state }
        }


        default: return state;
    }
}