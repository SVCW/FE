import { http } from "../../utils/reponse";
import { GetListActivityAction } from "./ActivityAction";

export const CommentAction = (value) => {
    return async (dispatch) => {
        try {
            let result = await http.post('/Comment/comment', value);
            console.log(result);
            const action = GetListActivityAction();
            dispatch(action)
        } catch (error) {
            console.log(error);
        }
    }
}


export const CommentRepllyAction = (value) => {
    return async (dispatch) => {
        try {
            let result = await http.post('/Comment/reply-comment', value);
            console.log(result);
            const action = GetListActivityAction();
            dispatch(action)
        } catch (error) {
            console.log(error);
        }
    }
}