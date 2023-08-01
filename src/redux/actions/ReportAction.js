import { http } from "../../utils/reponse";

export const GetListReportAction = () => {
    return async (dispatch) => {
        try {
            let result = await http.get('/Report/get-all-report');
            console.log(result.data.data);
            const action = {
                type: "GET_LIST_REPORT",
                arrReport: result.data.data
            }
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}

export const GetListReportByTypeAction = (id) => {
    return async (dispatch) => {
        try {
            let result = await http.get(`/Report/get-all-report-by-type?reportType=${id}`);
            console.log(result.data.data);
            const action = {
                type: "GET_LIST_REPORT_BYID",
                arrReportByID: result.data.data
            }
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}

export const CreateReportAction = (id) => {
    return async (dispatch) => {
        try {
            let result = await http.post(`/Report/new-report`, id);
            console.log(result.data.data);
            const action = GetListReportAction()
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}