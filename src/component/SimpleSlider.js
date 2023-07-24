import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { GetFanpageByIDAction } from '../redux/actions/FanpageAction';
import { NavLink } from 'react-router-dom'

function SimpleSlider (props) {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <Slider {...settings}>
            {props.arrFanpage.map((item, index) => {
                return <div className='suggested-caro'>
                    <li >
                        {/* <figure style={{ cursor: 'pointer' }} ><img src={item.avatar} style={{ height: '80px' }} /></figure> */}
                        <NavLink to={`/fanpage/${item.fanpageId}`} style={{ cursor: 'pointer', backgroundColor: "white" }}  >
                            <figure ><img src={item.avatar} style={{ height: '80px' }} /></figure>
                        </NavLink>
                        <span>{item.fanpageName}</span>
                        {/* <ins>{(item.description).slice(0, 200)}</ins> */}
                        <a href="#" title data-ripple><i className="icofont-star" />
                            Theo Dõi</a>
                    </li>
                </div>
            })}

        </Slider >
    );
}

export default SimpleSlider;
