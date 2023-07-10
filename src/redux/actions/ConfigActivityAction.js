import { http } from "../../utils/reponse";



export const ConfigActivityAction = (value) => {
    return async (dispatch) => {
        try {
            let result = await http.get(`/Config/get-userCreateActivityConfig?email=${value}`);
            console.log(result.data.data.message);
            const action = {
                type: "GET_CONFIG",
                configActivity: result.data.data.message,
            }
            localStorage.setItem('config', result.data.data.message)
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}