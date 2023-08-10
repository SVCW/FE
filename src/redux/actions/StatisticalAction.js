import { http } from "../../utils/reponse";

export const GetUserByIdAction = (id) => {
    return async (dispatch) => {

        try {
            let result = await http.get(`Statistical/statistical?userId=${id}&start=2023-1-1&end=2023-1-31`);
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