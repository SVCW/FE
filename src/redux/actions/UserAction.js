import { http } from "../../utils/reponse";

export const GetUserByIdAction = (id) => {
    return async (dispatch) => {

        try {
            let result = await http.get(`/User/get-user-by-id?UserId=${id}`);
            console.log(result.data.data.user);
            console.log(result.data.data?.user?.activity);
            const action = {
                type: "GET_USER_BY_ID",
                userByID: result.data.data.user
            }
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}

export const GetUserBystatisticAction = (id) => {
    return async (dispatch) => {

        try {
            let result = await http.get(`/User/get-statistic-profile?userId=${id}`);
            console.log(result.data.data);
            console.log(result.data.data.total.slice(0, 4));
            const action = {
                type: "GET_USER_BY_STATIS",
                userByStatis: result.data.data,
                usertotal: result.data.data.total.slice(0, 4),

            }
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}