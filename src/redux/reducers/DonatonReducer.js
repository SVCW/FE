const stateDefault = {
    arrDonation: [],

}


export const DonationReducer = (state = stateDefault, action) => {
    switch (action.type) {

        case 'GET_LIST_HISTORYDONATION': {
            state.arrDonation = action.arrDonation;
            return { ...state }
        }

        default: return state;
    }
}