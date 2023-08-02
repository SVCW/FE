const stateDefault = {
    arrReport: [],
    arrReportByID: []
}


export const ReportReducer = (state = stateDefault, action) => {
    switch (action.type) {

        case 'GET_LIST_REPORT': {
            state.arrReport = action.arrReport;
            return { ...state }
        }
        case 'GET_LIST_REPORT_BYID': {
            state.arrReportByID = action.arrReportByID;
            return { ...state }
        }

        default: return state;
    }
}