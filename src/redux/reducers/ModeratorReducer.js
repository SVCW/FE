// let moder = '';
// if (localStorage.getItem('createmoderator') !== '') {
//     moder = localStorage.getItem('createmoderator')
// }

const stateDefault = {
    arrModerator: [],
    msg: ''
}


export const ModeratorReducer = (state = stateDefault, action) => {
    switch (action.type) {

        case 'GET_LIST_MODERATOR': {
            state.arrModerator = action.arrModerator;
            return { ...state }
        }

        case 'CREATE_MODERATOR': {
            state.msg = action.msg;
            return { ...state }
        }

        case 'CHECK_MODERATOR': {
            state.msg = '';
            return { ...state }
        }

        default: return state;
    }
}
