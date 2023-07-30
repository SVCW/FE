import { http } from "../../utils/reponse";

export const GetListAdminFanpageAction = () => {
    return async (dispatch) => {
        try {
            let result = await http.get('/Achivement/get-all-achivement');
            let result1 = await http.get('/Achivement/get-all-achivement');
            console.log(result.data.data);
            const action = {
                type: "GET_LIST_ACHIVEMENT",
                arrFanpage: result.data.data,
                arrFanpage1: result1.data.data
            }
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}