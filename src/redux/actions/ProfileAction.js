import { http } from "../../utils/reponse";

export const GetProfileByIdAction = (id) => {
    return async (dispatch) => {
        try {
            let result = await http.get(`/User/get-user-by-id?UserId=${id}`);
            console.log(result.data.data);
            const action = {
                type: "GET_USER_BY_ID",
                getUserId: result.data.data.user
            }
            localStorage.setItem('getuserid',JSON.stringify(result.data?.data?.user))
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}

export const UpdateProfileById = (userInfo) => {
    return async (dispatch) => {
        try {
            let result = await http.put('/User/update-user', {
                ...userInfo,
                gender: userInfo.gender === 'Nam' ? true : false 
            });

            const action = {
                type: "GET_USER_BY_ID",
                getUserId: result.data.data.user
            }
            localStorage.setItem('getuserid',JSON.stringify(result.data?.data?.user))
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}
