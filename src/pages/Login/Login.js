import React, { useEffect } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../../firebase';
import { history } from '../../App';
import { useState } from 'react';
import { useFormik } from 'formik'
import { ConfigActivityAction } from '../../redux/actions/ConfigActivityAction';
import { useDispatch, useSelector } from 'react-redux';
import { GetListActivityAction } from '../../redux/actions/ActivityAction';
import { LoginUserAction } from '../../redux/actions/LoginAction';
import { GetListFanpageAction } from '../../redux/actions/FanpageAction';
export default function Login (props) {
    const dispatch = useDispatch()
    const { msg } = useSelector(root => root.LoginReducer)
    useEffect(() => {
        const action = GetListActivityAction();
        dispatch(action)
        const action1 = GetListFanpageAction();
        dispatch(action1)
    }, []);

    const formik = useFormik({
        initialValues: {

        },
        onSubmit: (value) => {
            console.log(value);
        }
    })
    const signInWithGoogle = async () => {
        signInWithPopup(auth, provider).then((result) => {
            const email = {
                "email": result.user?.email
            }
            console.log(result);

            localStorage.setItem('username', result.user?.displayName)
            const action1 = LoginUserAction(email, props);
            dispatch(action1)


            // props.history.push('/home')
            // console.log(result);
            // console.log(result.user.accessToken);
            // axios({
            //     url: 'https://old-stuff-exchange.azurewebsites.net/api/users/login',
            //     method: 'POST',
            //     data: {
            //         token: result.user.accessToken,
            //     }
            // }).then((value) => {
            //     console.log(value);
            // })

            // console.log(result.user.accessToken);
            // localStorage.setItem('a', result.user.displayName);
            // localStorage.setItem('userlogin', result.user.email);
            // // console.log(result.user.displayName);
            // // <Redirect to="/admin/dashboard" />

            // props.history.push("/home");
            console.log(localStorage.getItem('userLogin'));
            // if (localStorage.getItem('userLogin') !== 104) {
            //     // const action = ConfigActivityAction(email)
            //     // dispatch(action)
            //     props.history.push("/home");
            // } else {

            // }
        })
            .catch((error) => {
                console.log(error);
            })



    }
    return (
        <div className="theme-layout">
            <div className="authtication bluesh high-opacity">
                <div className="bg-image" style={{ backgroundImage: 'url(images/resources/login-bg3.jpg)' }} />
                <ul className="welcome-caro">
                    <li className="welcome-box">
                        <figure><img style={{ width: 600, height: 400 }} src="images/tu thien 1.jpg" alt /></figure>
                        <h4>Trường Học Tình Thương</h4>
                        <p>
                            Dự án này được lên xây dựng lên nhầm kêu gọi cộng đồng chung tay đưa những con chữ đến với trẻ em vùng cao.
                        </p>
                    </li>
                    <li className="welcome-box">
                        <figure><img style={{ width: 600, height: 400 }} src="images/tu thien_4.jpg" alt /></figure>
                        <h4>Cho Đi Là Còn Mãi</h4>
                        <p>
                            Dự án nhầm kêu gọi cộng đồng gây quỹ từ thiện cho những cựu chiến binh, bà mẹ Việt Nam anh hùng và những người bị dính chất độc màu da cam,....
                            Qũy này giúp cho cựu chiến binh, bà mẹ việt nam anh hùng,.... sẽ cảm thấy được an ủi một phần mất mác đã trải qua.
                        </p>
                    </li>
                    <li className="welcome-box">
                        <figure><img style={{ width: 600, height: 400 }} src="images/tu thien_2.jpg" alt /></figure>
                        <h4>Miền Trung Thân Thương</h4>
                        <p>
                            Hoạt động nhầm kêu gọi mọi người hướng về miền trung
                        </p>
                    </li>
                </ul>
            </div>
            <div className="auth-login">
                <div className="logo"><img src="images/logo.png" alt /><span>SVCW</span></div>
                <div className="mockup left-bottom"><img src="images/mockup.png" alt /></div>
                <div className="verticle-center">
                    <div className="login-form">
                        <h4><i className="icofont-key-hole" /> Đăng Nhập</h4>
                        <form method="post" className="c-form" onSubmit={formik.handleSubmit}>
                            <input type="text" placeholder="Tài Khoản" />
                            <input type="password" placeholder="Mật Khẩu" />
                            <div className="checkbox">
                                <input type="checkbox" id="checkbox" defaultChecked />
                                <label htmlFor="checkbox"><span>Ghi Nhớ</span></label>
                            </div>

                            <button className="main-btn" type="submit" onClick={() => {
                                props.history.push('/achivement')
                            }}><i className="icofont-key" /> Đăng nhập</button>

                            {msg !== '' ? <div style={{ color: 'red' }}>{localStorage.getItem('setError')}</div> : <div></div>}
                            <p
                                style={{
                                    marginTop: 20,
                                    fontSize: 16,
                                    borderBottom: "2px solid #17a2b8",
                                    paddingBottom: 4,
                                    width: "max-content",
                                    cursor: "pointer",
                                }}
                                onClick={signInWithGoogle}
                            >

                                Đăng nhập với Google
                            </p>
                        </form>
                    </div>
                </div>
                <div className="mockup right"><img src="images/star-shape.png" alt /></div>
            </div>

        </div>

    )
}
