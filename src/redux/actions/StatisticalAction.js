import { http } from "../../utils/reponse";

export const GetStatisticalAction = (id) => {
    return async (dispatch) => {

        try {
            const months = [
                { name: 'Tháng 1', start: '2023-01-01', end: '2023-01-31' },
                { name: 'Tháng 2', start: '2023-02-01', end: '2023-02-28' },
                { name: 'Tháng 3', start: '2023-03-01', end: '2023-03-31' },
                { name: 'Tháng 4', start: '2023-04-01', end: '2023-04-30' },
                { name: 'Tháng 5', start: '2023-05-01', end: '2023-05-31' },
                { name: 'Tháng 6', start: '2023-06-01', end: '2023-06-30' },
                { name: 'Tháng 7', start: '2023-07-01', end: '2023-07-31' },
                { name: 'Tháng 8', start: '2023-08-01', end: '2023-08-31' },
                { name: 'Tháng 9', start: '2023-09-01', end: '2023-09-30' },
                { name: 'Tháng 10', start: '2023-10-01', end: '2023-10-31' },
                { name: 'Tháng 11', start: '2023-11-01', end: '2023-11-30' },
                { name: 'Tháng 12', start: '2023-12-01', end: '2023-12-31' }
            ];

            const allMonthsData = [];

            for (const month of months) {
                let result = await http.post(`/Statistical/statistical?userId=${id}&start=${month.start}&end=${month.end}`);
                const monthData = result.data.data;
                allMonthsData.push(monthData);
            }
            dispatch({
                type: "GET_STATICAL",
                arrStatical: allMonthsData,
            });
            console.log(allMonthsData.userData);
            localStorage.setItem('statistical', JSON.stringify(allMonthsData))
            console.log(allMonthsData);
        } catch (error) {
            console.log(error);
        }
    }
}