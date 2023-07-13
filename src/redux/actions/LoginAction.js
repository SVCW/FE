import { history } from "../../App";
import { http } from "../../utils/reponse";



export const LoginUserAction = (value) => {
    return async (dispatch) => {
        try {
            let result = await http.post(`/User/validate-login-user`, value);
            console.log(result.data.data.user?.userId);
            const action = {
                type: "GET_USER_LOGIN",
                userLogin: result.data.data,
            }
            await dispatch(action)
            await localStorage.setItem('userLogin', result.data.data.resultCode)
            await localStorage.setItem('setError', result.data.data.resultMsg)
            if (result.data.data.resultCode === 104) {
                dispatch({
                    type: "CHECH_LOGIN",
                    data: "Emai không hợp lệ"
                })

            } else {
                dispatch({
                    type: "CHECH_LOGIN",
                    data: ""
                })

            }


        } catch (error) {
            console.log(error);
        }
    }
}