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
import Swal from 'sweetalert2';
import Slider from 'react-slick';

export default function Login (props) {
    const dispatch = useDispatch()
    const { msg } = useSelector(root => root.LoginReducer)
    const [isMatch, setIsMatch] = useState(false);
    useEffect(() => {
        const action = GetListActivityAction();
        dispatch(action)
        const action1 = GetListFanpageAction();
        dispatch(action1)
        const stringToCompare = 'host';

        // Get the current URL
        const currentUrl = window.location.href;

        // Check if the current URL contains the given string
        const match = currentUrl.includes(stringToCompare);

        // Set the state based on the result
        setIsMatch(match);
        // if (match) {
        //     Swal.fire({
        //         title: 'Good job!',
        //         text: 'You matched the string!',
        //         icon: 'success',
        //     }).then((result) => {
        //         props.history.push('/home')

        //         // Reset isMatch to false
        //         setIsMatch(false);
        //     });
        // }
    }, []);

    console.log(isMatch);
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
    const CustomPrevArrow = (props) => {
        const { onClick } = props;
        return <div className="custom-arrow prev-arrow" onClick={onClick} />;
    };

    // Custom next arrow component
    const CustomNextArrow = (props) => {
        const { onClick } = props;
        return <div className="custom-arrow next-arrow" onClick={onClick} />;
    };
    const [currentSlide, setCurrentSlide] = useState(0);
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        autoplay: true, // Add autoplay to make the slider change slides automatically
        autoplaySpeed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        beforeChange: (current, next) => {
            setCurrentSlide(next);
        },

    };
    const slides = [
        { imgSrc: "images/tu thien 1.jpg", text: "Trường học tình thương", text2: 'Dự án này được lên xây dựng lên nhầm kêu gọi cộng đồng chung tay đưa những con chữ đến với trẻ em vùng cao.' },
        { imgSrc: "images/tu thien_4.jpg", text: "Cho đi là còn mãi", text2: 'Dự án nhầm kêu gọi cộng đồng gây quỹ từ thiện cho những cựu chiến binh, bà mẹ Việt Nam anh hùng và những người bị dính chất độc màu da cam,.... Qũy này giúp cho cựu chiến binh, bà mẹ việt nam anh hùng,.... sẽ cảm thấy được an ủi một phần mất mác đã trải qua.' },
        { imgSrc: "images/tu thien_2.jpg", text: "Miền trung thân thương", text2: ' Hoạt động nhầm kêu gọi mọi người hướng về miền trung' },
        // Add more images and texts as needed
    ];
    return (
        <div className="theme-layout">
            <div className="authtication bluesh high-opacity">
                <div className="bg-image" style={{ backgroundImage: 'url(images/avatar/20.jpg)' }} />
                {/* <ul className="welcome-caro">
                    <li className="welcome-box">
                        <figure><img style={{ width: 600, height: 400 }} src="images/tu thien 1.jpg" alt /></figure>
                        <h4>Trường học tình thương</h4>
                        <p>
                            Dự án này được lên xây dựng lên nhầm kêu gọi cộng đồng chung tay đưa những con chữ đến với trẻ em vùng cao.
                        </p>
                    </li>
                    <li className="welcome-box">
                        <figure><img style={{ width: 600, height: 400 }} src="images/tu thien_4.jpg" alt /></figure>
                        <h4>Cho đi là còn mãi</h4>
                        <p>
                            Dự án nhầm kêu gọi cộng đồng gây quỹ từ thiện cho những cựu chiến binh, bà mẹ Việt Nam anh hùng và những người bị dính chất độc màu da cam,....
                            Qũy này giúp cho cựu chiến binh, bà mẹ việt nam anh hùng,.... sẽ cảm thấy được an ủi một phần mất mác đã trải qua.
                        </p>
                    </li>
                    <li className="welcome-box">
                        <figure><img style={{ width: 600, height: 400 }} src="images/tu thien_2.jpg" alt /></figure>
                        <h4>Miền trung thân thương</h4>
                        <p>
                            Hoạt động nhầm kêu gọi mọi người hướng về miền trung
                        </p>
                    </li>
                </ul> */}


                <ul className='welcome-caro' style={{ zIndex: '99!important', opacity: 1 }}>
                    <Slider {...settings} >
                        {slides.map((slide, index) => (
                            <div key={index} className='welcome-box' style={{ zIndex: '99!important', opacity: 1 }}>
                                <img src={slide.imgSrc} style={{ width: 600, height: 400, borderRadius: '10px', objectFit: 'cover' }} alt={`Slide ${index + 1}`} />
                                <h4 className='text-center pb-3 ' style={{ color: 'black' }}>{slide.text}</h4>
                                <p className='text-center' style={{ color: 'black' }}>{slide.text2}</p>
                            </div>
                        ))}
                    </Slider>
                </ul>

            </div>
            <div className="auth-login">
                <div className="logo"><img src="images/logo.png" alt /><span>SVCW</span></div>
                <div className="mockup left-bottom"><img src="images/mockup.png" alt /></div>
                <div className="verticle-center">
                    <div className="login-form">
                        <h4><i className="icofont-key-hole" /> Đăng nhập</h4>
                        <form method="post" className="c-form" onSubmit={formik.handleSubmit}>
                            <input type="text" placeholder="Tài khoản" />
                            <input type="password" placeholder="Mật khẩu" />
                            <div className="checkbox">
                                <input type="checkbox" id="checkbox" defaultChecked />
                                <label htmlFor="checkbox"><span>Nhớ tài khoản</span></label>
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
                                    width: "50%",
                                    cursor: "pointer",
                                    fontWeight:"500",
                                }}
                                onClick={signInWithGoogle}
                            >

 Đăng nhập với google
                            </p>
                        </form>
                    </div>
                </div>
                <div className="mockup right"><img src="images/star-shape.png" alt /></div>
            </div>

        </div>

    )
}
