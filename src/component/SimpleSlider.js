import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FollowFanpageAction,
  GetFanpageByIDAction,
  UnFollowFanpageAction,
} from "../redux/actions/FanpageAction";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

function SimpleSlider (props) {
  const { userID } = useSelector((root) => root.LoginReducer);
  const dispatch = useDispatch();
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
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const [cmt, setCmt] = useState(
    JSON.parse(localStorage.getItem("arrFanpage"))
  );
  const handleFollowClick = (index, activity, isFollow, title) => {
    console.log(index, activity, isFollow, title);
    console.log(userID);
    setCmt((prevArray) => {
      const newArray = JSON.parse(JSON.stringify(prevArray));
      newArray[index].isFollow = !newArray[index].isFollow;
      localStorage.setItem(`arrFanpage`, JSON.stringify(newArray));

      return newArray;
    });
    if (isFollow) {
      console.log("Hủy theo dõi");
      const action = UnFollowFanpageAction(userID, activity);
      dispatch(action);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "error",
        title: `Bỏ theo dõi thành công chiến dịch ${title}`,
      });
    } else {
      console.log("Theo dõi");
      const action = FollowFanpageAction(userID, activity);
      dispatch(action);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "success",
        title: `Theo dõi thành công chiến dịch ${title}`,
      });
    }
  };

  console.log(cmt);
  return (
    <Slider {...settings}>
      {cmt.map((item, index) => {
        return (
          <div className="suggested-caro">
            <li>
              {/* <figure style={{ cursor: 'pointer' }} ><img src={item.avatar} style={{ height: '80px' }} /></figure> */}
              <NavLink
                to={`/fanpage/${item.fanpageId}`}
                style={{ cursor: "pointer", backgroundColor: "white" }}
              >
                <figure>
                  <img
                    src={item.avatar}
                    style={{
                      margin:"0 2.5rem",
                      height: "80px",
                      width: "90px",
                      objectFit: "cover",
                    }}
                  />
                </figure>
              </NavLink>
              <span className="title-suggest " style={{ paddingLeft: '25px', width: '150px' }}>{item.fanpageName}</span>
              {/* <ins>{(item.description).slice(0, 200)}</ins> */}
              <div
                style={{
                  width: "110px",
                  background: "#088dcd none repeat scroll 0 0",
                  borderRadius: "16px",
                  color: "#fff",
                  display: "block",
                  marginLeft: '30px',
                  fontSize: "12px",
                  marginTop: "10px",
                  padding: " 5px 10px",
                  cursor: "pointer",
                }}
                title
                data-ripple
                onClick={() => {
                  handleFollowClick(
                    index,
                    item.fanpageId,
                    item.isFollow,
                    item.fanpageName
                  );
                }}
              >
                <i className="icofont-star" />
                {item?.isFollow ? "Hủy theo dõi" : "Theo dõi"}
              </div>
            </li>
          </div>
        );
      })}
    </Slider>
  );
}

export default SimpleSlider;
