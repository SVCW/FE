import { http } from "../../utils/reponse";

export const GetListActivityAction = () => {
    return async (dispatch) => {
        try {
            let result = await http.get('/Activity/get-activity');
            console.log(result.data.data);
            const action = {
                type: "GET_LIST_ACTIVITY",
                arrActivity: result.data.data
            }
            dispatch(action)
            localStorage.setItem('activity', JSON.stringify(result.data.data))
        } catch (error) {
            console.log(error);
        }
    }
}