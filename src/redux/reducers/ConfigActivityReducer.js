const stateDefault = {
    configActivity: localStorage.getItem('donation'),
    // configActivity: true,
    isValidCreate: localStorage.getItem('isValidCreate'),
    isFanpage: localStorage.getItem('isFanpage'),
    // isValidCreate: false,
    msg: localStorage.getItem('message')
}


export const ConfigActivityReducer = (state = stateDefault, action) => {
    switch (action.type) {

        case 'GET_CONFIG': {
            state.configActivity = localStorage.getItem('donation');
            state.isValidCreate = localStorage.getItem('isValidCreate');
            state.isFanpage = localStorage.getItem('isFanpage');
            state.msg = localStorage.getItem('message')
            return { ...state }
        }
        case 'LOGOUT': {
            state.isValidCreate = localStorage.setItem('isValidCreate', "false")
            state.configActivity = localStorage.setItem('configActivity', "false")
            state.msg = localStorage.setItem('message', "")
            return { ...state }
        }

        default: return state;
    }
}