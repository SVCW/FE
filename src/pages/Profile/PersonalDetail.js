import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetProfileByIdAction, UpdateProfileById } from "../../redux/actions/ProfileAction";
import { toast } from 'react-toastify';
import { useEffect } from "react";

const PersonalDetail = () => {

  const { getUserId } = useSelector(root => root.ProfileReducer)
  console.log(getUserId);
  useEffect(() => {
    const action = GetProfileByIdAction(localStorage.getItem('userID'));
    dispatch(action)
  }, []);
  const [userDetails, setUserDetails] = useState(JSON.parse(localStorage.getItem('getuserid')));
  const notify = () => toast("Wow so easy!", {
    theme: 'dark'
  });
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [info, setInfo] = useState({
    userId: userDetails?.userId,
    username: userDetails?.username,
    fullName: userDetails?.fullName,
    phone: userDetails?.phone,
    email: userDetails?.email,
    dataOfBirth: userDetails?.dataOfBirth,
    gender: userDetails?.gender === true ? "Nam" : "Nu",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo({
      ...info,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const action1 = UpdateProfileById(info);
    notify();
    await dispatch(action1);
    const action2 = GetProfileByIdAction(userDetails?.userId);
    await dispatch(action2);

    setUserDetails(JSON.parse(localStorage.getItem('getuserid')));
    setIsEditing(false);
  };

  if (!userDetails) return <p>Loading...</p>;

  return (
    <div className="main-wraper">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h5 className="main-title">
          {isEditing ? "Chỉnh sửa thông tin" : "Thông tin cá nhân"}
        </h5>
        <div style={{ width: "15%", alignSelf: "baseline" }}>
          {!isEditing && (
            <a className="ask-qst" onClick={() => setIsEditing(true)}>
              Chinh sua
            </a>
          )}
        </div>
      </div>
      <div className="info-block-list">
        {!isEditing ? (
          <ul>
            <li>
              Tài khoản: <span>{userDetails?.username}</span>
            </li>
            <li>
              Họ và tên: <span>{userDetails?.fullName}</span>
            </li>
            <li>
              Gioi tính: <span>{userDetails?.gender ? "Nam" : "Nu"}</span>
            </li>
            <li>
              Email: <span>{userDetails?.email}</span>
            </li>
            <li>
              {/* Ngày tháng năm sinh: <span>{new Date(userDetails.dateOfBirth).toUTCString()}</span> */}
            </li>
            <li>
              Số điện thoại: <span>{userDetails?.phone}</span>
            </li>
            <li>
              Địa chỉ: <span>175 nguyễn văn tăng</span>
            </li>
            <li>
              Ngày tham gia: <span>20/10/2022</span>
            </li>
            <li>
              Sự kiện đã tham gia: <span>10</span>
            </li>
            <li>
              Sự kiện hoàn thành: <span>8</span>
            </li>
          </ul>
        ) : (
          <form onSubmit={handleSubmit}>
            <div
              style={{ display: "flex", flexWrap: "wrap" }}
              className="info-block-list"
            >
              <div style={{ width: "50%" }}>
                <li>
                  Tài khoản:
                  <span>
                    <input
                      required
                      name="username"
                      value={info.username}
                      onChange={handleChange}
                    />
                  </span>
                </li>
              </div>
              <div style={{ width: "50%" }}>
                <li>
                  Họ và tên:
                  <span>
                    <input
                      required
                      name="fullName"
                      value={info.fullName}
                      onChange={handleChange}
                    />
                  </span>
                </li>
              </div>
              <div style={{ width: "50%" }}>
                <li>
                  Gioi tính:
                  <span>
                    <input
                      required
                      name="gender"
                      value={info.gender}
                      onChange={handleChange}
                    />
                  </span>
                </li>
              </div>
              <div style={{ width: "50%" }}>
                <li>
                  Email:
                  <span>
                    <input
                      disabled
                      name="email"
                      value={info.email}
                      onChange={handleChange}
                    />
                  </span>
                </li>
              </div>
              <div style={{ width: "50%" }}>
                <li>
                  Ngày tháng năm sinh:
                  <span>
                    <input
                      name="dateOfBirth"
                      value={info.dateOfBirth}
                      onChange={handleChange}
                    />
                  </span>
                </li>
              </div>
              <div style={{ width: "50%" }}>
                <li>
                  Số điện thoại:
                  <span>
                    <input
                      required
                      name="phone"
                      value={info.phone}
                      onChange={handleChange}
                    />
                  </span>
                </li>
              </div>
              <div style={{ width: "50%" }}>
                <li>
                  Địa chỉ:
                  <span>
                    <input />
                  </span>
                </li>
              </div>
            </div>
            <input type="submit" value="Submit" />
            <a className="ask-qst" onClick={() => setIsEditing(false)}>
              Huy
            </a>
          </form>
        )}
      </div>
    </div>
  );
};

export default PersonalDetail;
