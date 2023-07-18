
const stateDefault = {
    isLoadingM: false,
}

export const LoadingReducer = (state = stateDefault, action) => {

    switch (action.type) {
        case "DISPLAY_LOADING": {
            state.isLoadingM = true;
            return { ...state }
        }
        case "HIDE_LOADING": {
            state.isLoadingM = false;
            return { ...state };
        }

        default: return state;
    }
}