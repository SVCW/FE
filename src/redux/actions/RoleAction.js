import { http } from "../../utils/reponse";

export const GetListRoleAction = () => {
    return async (dispatch) => {
        try {
            let result = await http.get('/Role/get-role');
            console.log(result.data.data);
            const action = {
                type: "GET_LIST_ROLE",
                arrRole: result.data.data
            }
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}

export const CreateRoleAction = (value) => {
    return async (dispatch) => {
        try {
            let result = await http.post('/Role/Insert-Role', value);
            console.log(result.data.data);
            const action = GetListRoleAction();
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}
export const UpdateRoleAction = (value) => {
    return async (dispatch) => {
        try {
            let result = await http.put('/Role/update-role', value);
            const action = GetListRoleAction();
            dispatch(action)
        } catch (error) {
            console.log(error);
        }
    }
}
export const DeleteRoleAction = (value) => {
    return async (dispatch) => {
        try {
            let result = await http.delete(`/Role/delete-role?dto=${value}`);
            const action = GetListRoleAction();
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}