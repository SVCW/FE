import { http } from "../../utils/reponse";



export const HistoryFollowJoinAction = (id) => {
    return async (dispatch) => {
        try {
            let result = await http.get(`/User/get-history-user?userId=${id}`);
            console.log(result.data.data);
            const action = {
                type: "GET_LIST_HISTORY_FOLLOWJOIN",
                arrFollowJoin: result.data.data
            }
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}