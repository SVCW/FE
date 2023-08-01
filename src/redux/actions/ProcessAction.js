import { http } from "../../utils/reponse";
import { GetListActivityAction } from "./ActivityAction";
import Swal from 'sweetalert2'
export const CreateProcessAction = (value) => {
    return async (dispatch) => {
        try {
            let result = await http.post('/Process/Insert-process-list', value);
            console.log(result.data);
            const action = GetListActivityAction()
            dispatch(action)
        } catch (error) {
            console.log(error);
        }
    }

}

export const CreateProcess1Action = (value, id) => {
    return async (dispatch) => {
        try {
            let result = await http.post('/Process/Insert-process', value);
            console.log(result.data);
            // const action = GetListActivityAction()
            // dispatch(action)
            const action1 = GetProcessByActivityAction(id)
            dispatch(action1)
        } catch (error) {
            console.log(error);
        }
    }

}

export const GetProcessByActivityAction = (id) => {
    return async (dispatch) => {
        try {
            dispatch({ type: "DISPLAY_LOADING" })
            let result = await http.get(`/Process/get-process-activity?activityId=${id}`);
            console.log(result.data.data);
            const action1 = {
                type: "GET_PROCESS_ACTIVITY",
                processactivity: result.data.data
            }
            dispatch(action1)
            console.log(result.data);
            localStorage.setItem('activityprocess', JSON.stringify(result.data.data))
            // const action = GetListActivityAction()
            // dispatch(action)
            dispatch({ type: "HIDE_LOADING" })
        } catch (error) {
            console.log(error);
            dispatch({ type: "HIDE_LOADING" })
        }
    }
}

export const UpdateProcessAction = (value) => {
    return async (dispatch) => {
        try {
            let result = await http.put(`/Process/update-process`, value);
            console.log(result.data.data);
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'success',
                title: `Cập nhật tiến trình ${result.data.data.processTitle} thành công`
            })
        } catch (error) {
            console.log(error);
        }
    }
}




export const DeleteProcessByIdAction = (id) => {
    return async (dispatch) => {
        try {
            let result = await http.delete(`/Process/delete-process?id=${id}`);
            console.log(result.data.data);
            const action = GetListActivityAction();
            dispatch(action)
        } catch (error) {
            console.log(error);
        }
    }
}