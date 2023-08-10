

const stateDefault = {
    arrStatical: JSON.parse(localStorage.getItem('statistical')),

}


export const StatisticalReducer = (state = stateDefault, action) => {
    switch (action.type) {
        case 'GET_STATICAL': {
            state.arrStatical = action.arrStatical;
            return { ...state }
        }

        default: return state;
    }
}