import { http } from "../../utils/reponse";
import { GetListActivityAction } from "./ActivityAction";

export const FollowAction = (activity, user) => {
    return async (dispatch) => {
        try {
            let result = await http.post(`/Activity/follow-Activity?activityId=${activity}&userId=${user}`);
            console.log(result.data);
            const action = GetListActivityAction();
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}


export const UnFollowAction = (activity, user) => {
    return async (dispatch) => {
        try {
            let result = await http.put(`/Activity/unfollow-activity?activityId=${activity}&userId=${user}`);
            console.log(result.data);
            const action = GetListActivityAction();
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}

export const JoinAction = (activity, user) => {
    return async (dispatch) => {
        try {
            let result = await http.post(`/Activity/join-Activity?activityId=${activity}&userId=${user}`);
            console.log(result.data);

            const action = GetListActivityAction();
            dispatch(action)
        } catch (error) {
            console.log(error);
        }
    }
}
export const UnJoinAction = (activity, user) => {
    return async (dispatch) => {
        try {
            let result = await http.put(`/Activity/disJoin-activity?activityId=${activity}&userId=${user}`);
            console.log(result.data);
            const action = GetListActivityAction();
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}