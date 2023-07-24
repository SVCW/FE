let activity = ''
let activityprocess = []
if (localStorage.getItem('activityProcess') !== '') {
    activity = localStorage.getItem('activityProcess')
}
if (localStorage.getItem('activityprocess')) {
    activityprocess = localStorage.getItem('activityprocess')
}
const stateDefault = {
    processType: [],
    activityProcess: activity,
    processactivity: activityprocess
}


export const ProcessTypeReducer = (state = stateDefault, action) => {
    switch (action.type) {

        case 'GET_LIST_PROCESSTYPE': {
            state.processType = action.processType;
            return { ...state }
        }
        case 'CREATE_PROCEESS': {
            state.activityProcess = action.activityProcess;
            return { ...state }
        }
        case 'GET_PROCESS_ACTIVITY': {
            state.processactivity = action.processactivity;
            return { ...state }
        }
        default: return state;
    }
}