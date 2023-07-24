import { http } from "../../utils/reponse";

export const GetListFanpageAction = () => {
    return async (dispatch) => {
        try {
            let result = await http.get('/Fanpage/getall-fanpage');
            console.log(result.data.data);
            const action = {
                type: "GET_LIST_FANPAGE",
                arrFanpage: result.data.data
            }
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}


export const CreateFanpageAction = (value, props) => {
    return async (dispatch) => {
        try {
            let result = await http.post('/Fanpage/Insert-fanpage', value);
            console.log(result.data.data);
            const action = GetListFanpageAction()
            dispatch(action)
            localStorage.setItem('isFanpage', true)
            props.history.push('/home')
        } catch (error) {
            console.log(error);
        }
    }
}


export const GetFanpageByIDAction = (id) => {
    return async (dispatch) => {
        try {
            dispatch({ type: "DISPLAY_LOADING" })
            let result = await http.get(`/Fanpage/get-fanpage-id?id=${id}`);
            console.log(result.data.data);
            const action = {
                type: "GET_LIST_FANPAGE_ID",
                fanpageId: result.data.data,
                fanpageActivity: result.data.data.activity
            }
            dispatch(action)
            localStorage.setItem('fanpageactivity', JSON.stringify(result.data.data.activity))
            dispatch({ type: "HIDE_LOADING" })
        } catch (error) {
            console.log(error);
            dispatch({ type: "HIDE_LOADING" })
        }
    }
}