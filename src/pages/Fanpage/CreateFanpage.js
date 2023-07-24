
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { storage_bucket } from './../../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect } from 'react';
import { CreateFanpageAction } from '../../redux/actions/FanpageAction';
export default function CreateFanpage (props) {
    const dispatch = useDispatch()
    const { userID } = useSelector(root => root.LoginReducer)
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isLoading1, setIsLoading1] = useState(false);
    const [uploadProgress1, setUploadProgress1] = useState(0);
    const formik = useFormik({
        initialValues: {
            fanpageName: "",
            avatar: "",
            coverImage: "",
            description: "",
            mst: "",
            email: "",
            phone: "",
            userId: userID
        },
        onSubmit: (value) => {
            console.log(value);
            const action = CreateFanpageAction(value, props);
            dispatch(action)
        }
    })
    const [avartar, setAvatar] = useState('')
    useEffect(() => {


    }, [formik.values.avatar, formik.values.coverImage]);
    console.log(avartar);


    const uploadFile = (e) => {
        setIsLoading(true);
        let file = e.target.files[0];
        let fileRef = ref(storage_bucket, file.name);

        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            // console.log(snapshot);
            // setShowInput(false);
            setUploadProgress(progress);
        },
            (err) => console.log(err),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log(url);
                    // const updatedProduct = { ...product, achivementLogo: url }; // Update achivementLogo property in product object
                    // setProduct(updatedProduct);
                    formik.setFieldValue('avatar', url)
                });
            });
        setIsLoading(false);
        setUploadProgress(0);
    };
    const uploadFile1 = (e) => {
        setIsLoading1(true);
        let file = e.target.files[0];
        let fileRef = ref(storage_bucket, file.name);

        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            // console.log(snapshot);
            // setShowInput(false);
            setUploadProgress1(progress);
        },
            (err) => console.log(err),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log(url);
                    // const updatedProduct = { ...product, achivementLogo: url }; // Update achivementLogo property in product object
                    // setProduct(updatedProduct);
                    formik.setFieldValue('coverImage', url)
                });
            });
        setIsLoading1(false);
        setUploadProgress1(0);
    };
    return (
        <div>
            <section>
                <div className="gap">
                    <div className="container">
                        <div className="row">

                            <form method='post' onSubmit={formik.handleSubmit}>
                                <div className="col-lg-12" >
                                    <div id="page-contents" className="row" style={{ display: 'flex' }}>
                                        <div className="col-lg-8">
                                            <div className="main-wraper">
                                                <h4 className="main-title"><i className="icofont-bill" /> Tạo Mới Fanpage</h4>
                                                <div className="billing">
                                                    <div className="row">
                                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
                                                            <input className="uk-input" name='fanpageName' onChange={formik.handleChange} type="text" placeholder="Tên Fanpage" />
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
                                                            <input className="uk-input" type="text" name='mst' onChange={formik.handleChange} placeholder="Nhập Mã Số Thuế" />
                                                        </div>
                                                        <div className="col-lg-12 col-md-12 col-sm-12 mb-4">
                                                            <input className="uk-input" type="email" name='email' onChange={formik.handleChange} placeholder="Nhập Email" />
                                                        </div>
                                                        <div className="col-lg-12 col-md-12 col-sm-12 mb-4">
                                                            <input className="uk-input" type="text" name='phone' onChange={formik.handleChange} placeholder="Nhập Số Điện Thoại" />
                                                        </div>
                                                        <div className="col-lg-12 col-md-12 col-sm-12 mb-4">
                                                            <textarea className="uk-textarea" name='description' onChange={formik.handleChange} rows={5} placeholder="Nhập Mô Tả" defaultValue={""} />
                                                        </div>
                                                    </div>


                                                </div>
                                            </div>
                                            <button type='submit' className="main-btn purchase-btn" href="#" title>Tạo Fanpage</button>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="main-wraper stick-widget" style={{ position: 'relative' }}>
                                                <div className="cart-summary">
                                                    <h4 className="main-title">Ảnh Đại Diện</h4>
                                                    <div className="wrapper" onChange={(e) => uploadFile(e)} >
                                                        <div className="file-upload">
                                                            <input type="file" />
                                                            <i className="fa fa-arrow-up" />
                                                        </div>
                                                    </div>
                                                    {isLoading && (
                                                        <div>
                                                            <div className="progress-bar-container">
                                                                <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                                                            </div>
                                                            <div className="progress-percentage">{uploadProgress}%</div>
                                                        </div>
                                                    )}
                                                    {formik.values.avatar !== '' ?
                                                        <div style={{ paddingTop: '20px', textAlign: 'center' }}>
                                                            <img src={formik.values.avatar} style={{ width: '200px', height: '200px', borderRadius: '50%' }} />
                                                        </div>
                                                        :
                                                        <div>
                                                        </div>
                                                    }


                                                </div>
                                            </div>
                                            <div className="main-wraper stick-widget">
                                                <div className="cart-summary">
                                                    <h4 className="main-title">Ảnh Bìa</h4>
                                                    <div className="wrapper">
                                                        <div className="file-upload" onChange={(e) => uploadFile1(e)}>
                                                            <input type="file" />
                                                            <i className="fa fa-arrow-up" />
                                                        </div>
                                                    </div>
                                                    {isLoading1 && (
                                                        <div>
                                                            <div className="progress-bar-container">
                                                                <div className="progress-bar" style={{ width: `${uploadProgress1}%` }}></div>
                                                            </div>
                                                            <div className="progress-percentage">{uploadProgress1}%</div>
                                                        </div>
                                                    )}
                                                    {formik.values.coverImage !== '' ?
                                                        <div style={{ paddingTop: '20px', textAlign: 'center' }}>
                                                            <img src={formik.values.coverImage} style={{ width: '100%', height: '200px' }} />
                                                        </div>
                                                        :
                                                        <div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>


                                        </div>
                                    </div>


                                </div>

                            </form>
                        </div>
                    </div>
                </div >

            </section >
            <footer>
                <div className="gap">
                    <div className="bg-image" style={{ backgroundImage: 'url(images/resources/footer-bg.png)' }} />
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="web-info">
                                    <a href="#" title><img src="images/logo.png" alt /></a>
                                    <p>Subscribe our newsletter for getting notifications and alerts</p>
                                    <div className="contact-little">
                                        <span><i className="icofont-phone-circle" /> +1-235-099-34</span>
                                        <span><i className="icofont-email" /> info@akedmic.com</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-3 col-sm-6">
                                <div className="widget">
                                    <div className="widget-title">
                                        <h4>Company</h4>
                                    </div>
                                    <ul className="quick-links">
                                        <li><a href="#" title>About Us</a></li>
                                        <li><a href="#" title>Career</a></li>
                                        <li><a href="#" title>Privacy</a></li>
                                        <li><a href="#" title>Terms</a></li>
                                        <li><a href="#" title>FAQ</a></li>
                                        <li><a href="#" title>Contact</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-3 col-sm-6">
                                <div className="widget">
                                    <div className="widget-title">
                                        <h4>Quick Links</h4>
                                    </div>
                                    <ul className="quick-links">
                                        <li><a href="#" title>Product</a></li>
                                        <li><a href="#" title>Market</a></li>
                                        <li><a href="#" title>Courses</a></li>
                                        <li><a href="#" title>Services</a></li>
                                        <li><a href="#" title>Enterprise</a></li>
                                        <li><a href="#" title>Sitemap</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-6">
                                <div className="widget">
                                    <div className="widget-title">
                                        <h4>Follow Us</h4>
                                    </div>
                                    <ul className="quick-links">
                                        <li><a href="#" title><i className="icofont-facebook" />facebook</a></li>
                                        <li><a href="#" title><i className="icofont-twitter" />twitter</a></li>
                                        <li><a href="#" title><i className="icofont-instagram" />instagram</a></li>
                                        <li><a href="#" title><i className="icofont-google-plus" />google +</a></li>
                                        <li><a href="#" title><i className="icofont-whatsapp" />whatsapp</a></li>
                                        <li><a href="#" title><i className="icofont-reddit" />reddit</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="widget">
                                    <div className="widget-title">
                                        <h4>Newsletter</h4>
                                    </div>
                                    <div className="news-lettr">
                                        <form className="newsletter">
                                            <input type="text" placeholder="Email Address" />
                                            <button type="submit"><i className="icofont-paper-plane" /></button>
                                        </form>
                                        <p>
                                            it is a long established fact that a reader will be distracted by.
                                        </p>
                                        <h5>Download App</h5>
                                        <a href="#" title><img src="images/android.png" alt /></a>
                                        <a href="#" title><img src="images/apple.png" alt /></a>
                                        <a href="#" title><img src="images/windows.png" alt /></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div >
    )
}

