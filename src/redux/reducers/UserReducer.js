let ad = 'no';
if (localStorage.getItem('admin') !== 'no') {
    ad = localStorage.getItem('admin')
}

const stateDefault = {
    userByID: {},
    userByStatis: {},
    admin: ad,
    usertotal: ""
}


export const UserReducer = (state = stateDefault, action) => {
    switch (action.type) {

        case 'GET_USER_BY_ID': {
            state.userByID = action.userByID || action.getUserId;
            state.arrActivityUser = action.arrActivityUser;
            return { ...state }
        }
        case 'GET_USER_BY_STATIS': {
            state.userByStatis = action.userByStatis;
            state.usertotal = action.usertotal;
            return { ...state }
        }
        case 'LOGOUT_ADMIN': {
            state.admin = action.admin
        }

        default: return state;
    }
}