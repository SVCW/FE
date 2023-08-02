import { http } from "../../utils/reponse";

// export const GetListActivityAction = () => {
//     return async (dispatch) => {

//         try {
//             dispatch({ type: "DISPLAY_LOADING" })
//             let result = await http.get('/Activity/get-activity?pageSize=5&PageLoad=1');
//             console.log(result.data.data);
//             const newArray = await (result.data.data).map((item) => ({
//                 ...item,
//                 isFollow: false,
//                 isJoin: false,

//             }));
//             // const newArray2 = await (result.data.data).map((item) => ({
//             //     id: item.activityId,
//             //     isCmt: true,
//             //     color: '#eae9ee',

//             // }));
//             // console.log(newArray2);
//             // console.log(newArray);
//             const action = {
//                 type: "GET_LIST_ACTIVITY",
//                 arrActivity: newArray
//             }
//             dispatch(action)
//             // newArray.forEach((item) => {
//             //     localStorage.setItem(`activity_${item.activityId}`, JSON.stringify(item.isJoin));
//             // });
//             await localStorage.setItem('activity', JSON.stringify(newArray))
//             // await localStorage.setItem('activity2', JSON.stringify(newArray2))
//             localStorage.setItem('activity', JSON.stringify(result.data.data))
//             dispatch({ type: "HIDE_LOADING" })
//         } catch (error) {
//             console.log(error);
//         }
//     }
// }

export const GetListActivityAction = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: "DISPLAY_LOADING" })
            let result = await http.get('/Activity/get-activity?pageSize=5&PageLoad=1');
            console.log(result.data.data.result);
            const newArray = await (result.data.data.result).map((item) => ({
                ...item,
                isFollow: false,
                isJoin: false,

            }));
            const action = {
                type: "GET_LIST_ACTIVITY",
                arrActivity: newArray
            }
            dispatch(action)

            localStorage.setItem('activity', JSON.stringify(result.data.data.result))
            dispatch({ type: "HIDE_LOADING" })
        } catch (error) {
            console.log(error);
        }
    }
}
export const CreateActivityAction = (value) => {
    return async (dispatch) => {
        try {
            let result = await http.post('/Activity/Insert-Activity', value);
            console.log(result.data.data);
            const action1 = {
                type: "CREATE_PROCEESS",
                activityProcess: result.data.data.activityId
            }
            dispatch(action1)
            const action = GetListActivityAction()
            dispatch(action)
            localStorage.setItem('activityprocess', result.data.data.activityId)

        } catch (error) {
            console.log(error);
        }
    }
}

export const PostLikeAction = (value) => {
    return async (dispatch) => {
        try {
            let result = await http.post('/Like/simple-like', value);
            const action = GetListActivityAction()
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}

export const DeleteLikeAction = (value) => {
    return async (dispatch) => {
        try {
            let result = await http.delete('/Like/simple-unlike', {
                headers: {
                    'Content-Type': 'application/json'
                },
                data: value
            });

            const action = GetListActivityAction()
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}


export const UpdateActivityAction = (value) => {
    return async (dispatch) => {
        try {
            let result = await http.put(`/Activity/update-activity`, value)
            console.log(result.data.data);
            const action1 = GetListActivityAction()
            dispatch(action1)
        } catch (error) {
            console.log(error);
        }
    }
}