import React from 'react'
import { useSelector } from 'react-redux';
import Slider from 'react-slick';
import styles from "./RecommentActivity.module.css";
export default function RecommentActivity () {
    const { arrActivityRecomment } = useSelector((root) => root.ActivityReducer);
    console.log("comment", arrActivityRecomment);
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        appendDots: `
      .slick-dots {
        bottom: 10px;
      }

      .slick-dots li button:before {
        font-size: 10px;
        color: #999;
      }

      .slick-dots li.slick-active button:before {
        color: #333;
      }
    `,
        appendArrows: `
      .slick-prev, .slick-next {
        background-color: #ddd;
        color: #333;
      }
    `,
        appendCss: `
      .slick-slider {
        overflow: hidden;
      }

      .slick-list {
        position: relative;
        display: block;
        overflow: hidden;
        margin: 0;
        padding: 0;
      }
    `,


    };
    return (
        <div style={{ position: 'relative' }}>
            <Slider {...settings}>

                {arrActivityRecomment.map((item, index) => {

                    return <div className="widget">
                        <h4 className="widget-title">Đề xuất tìm kiếm</h4>
                        <h3 className="widget-title" style={{ color: ' #1572b8' }}>{item.title}</h3>

                        <div className="sug-caro">

                            <div className="friend-box">
                                <figure>
                                    <img
                                        style={{
                                            width: "310px",
                                            height: "110px",
                                            objectFit: "cover",
                                        }}
                                        alt
                                        src={item.media[0]?.linkMedia}
                                    />
                                    <span>Lượt thích: {item.numberJoin}</span>
                                </figure>
                                <div className="frnd-meta">
                                    <img
                                        style={{
                                            width: "70px",
                                            height: "70px",
                                            objectfit: "cover",
                                            display: "block",
                                        }}
                                        alt
                                        src={item.media[0]?.linkMedia}
                                    />
                                    <div className="frnd-name" style={{ paddingTop: '10px' }}>

                                        <span>@{item.user?.username}</span>
                                    </div>
                                    <a className="main-btn2" href="#" title>
                                        Theo dõi
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                })}

            </Slider>
        </div>
    )
}
