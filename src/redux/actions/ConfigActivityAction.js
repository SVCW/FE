import { http } from "../../utils/reponse";



export const ConfigActivityAction = (value) => {
    return async (dispatch) => {
        try {
            let result = await http.post(`/Config/get-userCreateActivityConfig`, value);
            console.log(result.data.data.isDonatable);
            const action = {
                type: "GET_CONFIG",
                configActivity: result.data.data.isDonatable,
                isValidCreate: result.data.data?.isValidCreate,
                isFanpage: result.data.data.isFanpage,
                msg: result.data.data.message
            }
            localStorage.setItem('donation', result.data.data.isDonatable)
            localStorage.setItem('isValidCreate', result.data.data?.isValidCreate)
            localStorage.setItem('isFanpage', result.data.data.isFanpage)
            localStorage.setItem('message', result.data.data.message)
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}