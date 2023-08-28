import { SendEmail } from "../../utils/emailService";
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

            const action1 = {
                type: "CHECK_MODERATOR",
                msg: ''
            }
            dispatch(action1)
            localStorage.setItem('createmoderator', '')
            SendEmail(value.email, 'Đăng kí tài khoản người quản lý WSCV thành công', `<!DOCTYPE html>\n<html lang='vi'>\n<head>\n    <meta charset='UTF-8'>\n    <meta name='viewport' content='width=device-width,initial-scale=1'>\n    <title>Chúc Mừng Tạo Tài Khoản Mới Thành Công</title>\n    <style>\n        body {\n            font-family: Arial, sans-serif;\n        }\n        .container {\n            max-width: 600px;\n            margin: 0 auto;\n            padding: 20px;\n            border: 1px solid #ccc;\n            border-radius: 5px;\n        }\n        .header {\n            background-color: #18dcff;\n            color: #fff;\n            text-align: center;\n            padding: 10px;\n        }\n        .content {\n            padding: 20px;\n        }\n        .tk {\n            font-size: 20px;\n            margin: 10px 0;\n        }\n        .tk span {\n            font-weight: bold;\n        }\n    </style>\n</head>\n\n<body>\n    <div class='container'>\n        <div class='header'>\n            <h1>Chúc Mừng Tạo Tài Khoản Mới Thành Công</h1>\n        </div>\n        <div class='content'>\n            <p>Xin chào <span>${value.fullName}</span>,</p>\n            <p>Chào mừng bạn đến với SVCW!</p>\n            <div class='tk'><span>Tài khoản :</span> ${value.username}</div>\n            <div class='tk'><span>Mật khẩu :</span> ${value.password}</div>\n            <p>Chúng tôi rất vui mừng vì bạn đã tham gia vào cộng đồng. Bạn đã trở thành một\n                phần quan trọng của cộng đồng, và chúng tôi mong rằng bạn sẽ có những trải nghiệm thú vị và tìm kiếm\n                được các hoạt động phù hợp.</p>\n            <p>Giờ đây, bạn đã có thể truy cập vào tài khoản của mình và bắt đầu khám phá những tính năng và cơ hội\n                mà chúng tôi cung cấp.</p>\n            <p>Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, đừng ngần ngại hãy liên hệ với đội người hỗ trợ của chúng\n                tôi.</p>\n            <p>Chúc bạn có những trải nghiệm tuyệt vời!</p>\n            <p>Trân trọng,<br>SVCW</p>\n        </div>\n    </div>\n</body>\n\n</html>`)
        } catch (error) {

            const action = {
                type: "CREATE_MODERATOR",
                msg: error.response?.data?.message
            }
            dispatch(action)
            localStorage.setItem('createmoderator', error.response?.data?.message)
            console.log(error.response);
        }
    }
}

export const DeleteModeratorAction = (value) => {
    return async (dispatch) => {
        try {
            let result = await http.delete(`/ Moderator / delete? id = ${value}`);
            console.log(result.data.data);
            const action = GetListModeratorAction()
            dispatch(action)

        } catch (error) {
            console.log(error.response);
        }
    }
}