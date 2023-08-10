import React, { useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { GetStatisticalAction } from './redux/actions/StatisticalAction';
import { useDispatch } from 'react-redux';

const MultiStepForm = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const action = GetStatisticalAction(localStorage.getItem('userID'));
        dispatch(action)
    }, []);
    const series = [
        {
            name: 'Desktops',
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        },
    ];

    const options = {
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'straight',
        },
        title: {
            text: 'Product Trends by Month',
            align: 'left',
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5,
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        },
    };

    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="line" height={350} />
        </div>
    );
};

export default MultiStepForm;