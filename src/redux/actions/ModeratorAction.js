import { http } from "../../utils/reponse";

export const GetListModeratorAction = () => {
    return async (dispatch) => {
        try {
            let result = await http.get('/Moderator/get-all');
            console.log(result.data.data);
            const action = {
                type: "GET_LIST_MODERATOR",
                arrModerator: result.data.data
            }
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}

export const CreateModeratorAction = (value) => {
    return async (dispatch) => {
        try {
            let result = await http.post('/Moderator/create', value);
            console.log(result.data.data);
            const action = GetListModeratorAction()
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}

export const DeleteModeratorAction = (value) => {
    return async (dispatch) => {
        try {
            let result = await http.delete(`/Moderator/delete?id=${value}`);
            console.log(result.data.data);
            const action = GetListModeratorAction()
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}