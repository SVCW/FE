import React from 'react'
import { CreateProcess1Action, CreateProcessAction, DeleteProcessByIdAction, GetProcessByActivityAction, UpdateProcessAction } from '../../redux/actions/ProcessAction';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useState } from 'react';
import moment from 'moment';
import Slider from "react-slick";
import { NavLink } from 'react-router-dom/cjs/react-router-dom';
import { useFormik } from 'formik';
import { GetListProcessTypeAction } from '../../redux/actions/ProcessTypeAction';
import { getStorage, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage_bucket } from '../../firebase';
import Swal from 'sweetalert2';
export default function DetailProcess (props) {
    const [settings] = useState({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    });
    const currentTime = moment();

    const dispatch = useDispatch()
    const { id } = props.match.params;
    const { processactivity, processType } = useSelector(root => root.ProcessTypeReducer)
    useEffect(() => {
        const action = GetProcessByActivityAction(id);
        dispatch(action)
        const action1 = GetListProcessTypeAction();
        dispatch(action1)
    }, []);
    console.log(processType);
    const DateTime = (value) => {
        const currentTime = moment(value).format('DD-MM-YYYY HH:mm');
        return currentTime;
    }
    console.log(processactivity);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, processactivity.length - 1));
    };

    const [create, setCreate] = useState(true)
    const currentObject = processactivity[currentIndex];
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    console.log(currentObject);
    const [isOpen, setIsOpen] = useState(false);
    const popupStyle = {
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? "visible" : "hidden",
        overflow: isOpen ? "auto" : "hidden",
    };
    const [images, setImages] = useState([]);
    const [isOpen1, setIsOpen1] = useState(false);
    const [files, setFiles] = useState('');
    const handleImageChange = async (e) => {
        setIsLoading(true);
        const fileList = e.target.files;
        const newImages = [];

        for (let i = 0;i < fileList.length;i++) {
            const file = fileList[i];
            const imageUrl = URL.createObjectURL(file);
            newImages.push({ file, url: imageUrl });

            try {
                const fileRef = ref(storage_bucket, file.name);
                const uploadTask = uploadBytesResumable(fileRef, file);

                uploadTask.on('state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                });

                const snapshot = await uploadTask;

                if (snapshot.state === 'success') {
                    const downloadURL = await getDownloadURL(snapshot.ref);
                    const updatedImages = [...newImages];
                    updatedImages[i].url = downloadURL;
                    setImages((prevImages) => [...prevImages, ...updatedImages]);

                }

            } catch (error) {
                console.log(error);
            }
        }
        setIsLoading(false);
        setUploadProgress(0);
    };
    const handleImageDelete = (index) => {
        setImages((prevImages) => {
            const updatedImages = [...prevImages];
            updatedImages.splice(index, 1);
            return updatedImages;
        });

    };
    const popupStyle1 = {
        opacity: isOpen1 ? 1 : 0,
        visibility: isOpen1 ? "visible" : "hidden",
        overflow: isOpen1 ? "auto" : "hidden",
    };
    const handleClick1 = () => {
        setIsOpen1((prevIsOpen) => !prevIsOpen);

    };
    const handleClick = () => {
        setIsOpen((prevIsOpen) => !prevIsOpen);

    };
    const formik = useFormik({
        initialValues: {
            processId: currentObject?.processId,
            processTitle: currentObject?.processTitle,
            description: currentObject?.description,
            startDate: currentObject?.startDate,
            endDate: currentObject?.endDate,
            processTypeId: currentObject?.processTypeId
        },
        enableReinitialize: true,
        onSubmit: async (value) => {
            console.log(value);
            const action = await UpdateProcessAction(value);
            await dispatch(action);
            const action1 = GetProcessByActivityAction(id);
            dispatch(action1)
            handleClick()
        }
    })

    const formik1 = useFormik({
        initialValues: {
            processTitle: "",
            description: "",
            startDate: "",
            endDate: "",
            activityId: id,
            processTypeId: "",
            isKeyProcess: true,
            processNo: processactivity.length + 1,
            media: []
        },
        onSubmit: async (value) => {
            console.log(value);
            const action = await CreateProcess1Action(value, id);
            await dispatch(action)
            setIsOpen1((prevIsOpen) => !prevIsOpen);
        }
    })

    useEffect(() => {
        const arrMedia = images.map((image) => ({
            linkMedia: image.url,
            type: "string"
        }));
        formik1.setFieldValue('media', arrMedia);
        console.log(arrMedia);
    }, [images]);

    const DeleteProcess = (id) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: 'Bạn đã chắc chắn?',
            text: "Bạn muốn xóa tiến trình này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng Ý!',
            cancelButtonText: 'Hủy Bỏ!',
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const action = await DeleteProcessByIdAction(currentObject.processId);
                await dispatch(action)
                setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, processactivity.length - 1));
                const action1 = GetProcessByActivityAction(id);
                dispatch(action1)

                swalWithBootstrapButtons.fire(
                    'Xóa!',
                    'Xóa Thành Công Tiến Trình.',
                    'success'
                )

            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Hủy Bỏ',
                    'Hủy Bỏ Xóa Tiến Trình',
                    'error'
                )
            }
        })
    }
    return (
        <div>
            <section>
                <div className="gap">
                    <div className="container">
                        <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'space-between' }}>
                            <NavLink to="/home" className="blog-title" style={{ width: '200px' }} >
                                <div style={{ color: '#00a6d3', display: 'flex', alignContent: 'center', position: 'relative', width: '200px' }}>
                                    <div className='pre' title>
                                        <i className="icofont-curved-double-left" style={{ fontSize: '23px', paddingTop: '5px' }} />
                                    </div>
                                    <h4 style={{ position: 'absolute', left: '28px', top: '-3px' }} >Home</h4>
                                </div>


                            </NavLink>
                            <div className="more">
                                <div className="more-post-optns">
                                    <i className>
                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal">
                                            <circle cx={12} cy={12} r={1} />
                                            <circle cx={19} cy={12} r={1} />
                                            <circle cx={5} cy={12} r={1} />
                                        </svg></i>
                                    <ul>
                                        <li onClick={handleClick1}>
                                            <i className="icofont-pen-alt-1" />Thêm Mới
                                            <span>Thêm Mới Tiến Trình</span>
                                        </li>
                                        <li onClick={handleClick}>
                                            <i className="icofont-pen-alt-1" />Chỉnh Sửa
                                            <span>Chỉnh Sửa Tiến Trình</span>
                                        </li>
                                        <li onClick={() => {
                                            DeleteProcess(currentObject.processId)
                                        }}>
                                            <i className="icofont-ban" />Xóa
                                            <span>Xóa Tiến Trình</span>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                        </div>
                        {processactivity.length === 0 ?
                            <h2 style={{ textAlign: 'center', paddingTop: '50px', fontWeight: 'bold', color: '#3f6ad8' }}>Chưa Có Tiến Trình</h2>
                            :
                            <div className="row">
                                <div className="offset-lg-1 col-lg-10">
                                    <div className="blog-detail">
                                        <div className="next-prev-posts" style={{ display: 'flex', alignContent: 'center', paddingBottom: '50px' }}>
                                            <div className={`prev ${currentIndex === 0 ? 'disabled' : ''}`} style={{ cursor: 'pointer' }} onClick={handlePrevious}  >
                                                <div className='prem' title>
                                                    <i style={{ color: '#00a6d3' }} className="icofont-curved-double-left" />
                                                    <div className="translate">
                                                        <span style={{ color: '#00a6d3' }} className='pe'>Trang trước</span>
                                                        <p>Xem lại tiến trình trước.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`next ${currentIndex === processactivity.length - 1 ? 'disabled' : ''}`} style={{ cursor: 'pointer' }} onClick={handleNext} >
                                                <div className='pre' title>
                                                    <i style={{ color: '#00a6d3' }} className="icofont-curved-double-right" />
                                                    <div className="translate">
                                                        <span className='per' style={{ color: '#00a6d3' }}>Trang sau</span>
                                                        <p>Xem tiếp tiến trình sau.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="blog-title" style={{ display: 'flex', alignContent: 'center', fontSize: '40px', textAlign: 'center', paddingBottom: '50px', color: '#00a6d3' }}>
                                            <h2>Tiến Trình : {currentObject?.processNo}</h2>
                                        </div>
                                        <div className="blog-title" style={{ textAlign: 'center' }}>
                                            {/* <h2 style={{ width: '250px', fontWeight: 'bold' }}>Tiêu Đề : </h2> */}
                                            <h2 style={{ color: '#00a6d3', width: '300px' }}>{currentObject?.processTitle}</h2>
                                        </div>
                                        <div className="blog-details-meta">
                                            {/* <figure><img src="https://picsum.photos/200" alt style={{ height: '300px' }} /></figure> */}
                                            {currentObject?.media?.length !== 0 ?

                                                <Slider {...settings}>
                                                    {currentObject?.media?.map((item, index) => {
                                                        return <figure key={index}><img src={item.linkMedia} alt style={{ height: '500px', width: '100%' }} /></figure>
                                                    })}
                                                </Slider>
                                                :
                                                <div></div>
                                            }
                                            <ul style={{ paddingTop: '50px' }}>

                                                <li style={{ display: 'flex', fontSize: '20px', paddingBottom: '20px' }}>
                                                    <div style={{ paddingRight: '10px', color: 'black' }}>- Ngày Bắt Đầu :</div>
                                                    <i style={{ fontSize: '20px' }}>

                                                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar">
                                                            <rect x={3} y={4} width={18} height={18} rx={2} ry={2} />
                                                            <line x1={16} y1={2} x2={16} y2={6} />
                                                            <line x1={8} y1={2} x2={8} y2={6} />
                                                            <line x1={3} y1={10} x2={21} y2={10} />
                                                        </svg></i> {DateTime(currentObject?.startDate)}</li>
                                                <li style={{ display: 'flex', fontSize: '20px' }}>
                                                    <div style={{ paddingRight: '10px', color: 'black' }}>- Ngày Kết Thúc:</div>
                                                    <i style={{ fontSize: '20px' }}>

                                                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar">
                                                            <rect x={3} y={4} width={18} height={18} rx={2} ry={2} />
                                                            <line x1={16} y1={2} x2={16} y2={6} />
                                                            <line x1={8} y1={2} x2={8} y2={6} />
                                                            <line x1={3} y1={10} x2={21} y2={10} />
                                                        </svg></i> {DateTime(currentObject?.endDate)}</li>
                                            </ul>

                                            <h3 style={{ fontWeight: 'bold' }}>Thông Tin Chi Tiết :</h3>
                                            <p style={{ paddingLeft: '20px' }}>
                                                - {currentObject?.description}
                                            </p>

                                            {/* <h4>Did you have any prior on- or offline research experience prior to publishing
                                    your course?</h4> */}
                                            {/* <p>
                                    Morbi lectus nunc, lacinia ut consequat a, semper vel erat. Duis ut lacus nec
                                    dui sodales mattis. Mauris tellus dolor, pulvinar sit amet pretium a, malesuada
                                    sed tellus. Aliquam ultrices elit neque, quis lacinia ex porttitor non. Donec ac
                                    iaculis turpis. Nulla lacinia enim quis orci aliquam, non cursus urna
                                    pellentesque. Class aptent taciti sociosqu ad litora torquent per conubia
                                    nostra, per inceptos himenaeos. Phasellus in mi a nisi auctor interdum. Vivamus
                                    faucibus magna sed elit interdum consequat. Vestibulum eu tortor vel ante
                                    feugiat faucibus quis et urna. Quisque interdum ac enim eu tempus. Fusce
                                    viverra, lectus egestas tincidunt cursus, tortor sapien convallis metus, vitae
                                    auctor risus metus vel nisi. Aenean dapibus bibendum mauris ut iaculis.
                                </p>
                                <h4>What are the most rewarding aspects of teaching on Cursus?</h4>
                                <p>
                                    Quisque et bibendum urna, eget consequat sapien. Integer sed condimentum nibh.
                                    Integer id neque tristique, lobortis massa ac, dapibus nibh. Donec nulla odio,
                                    porttitor ac rutrum eget, volutpat a velit. Curabitur et enim quis diam congue
                                    dictum et vitae dui. Nulla tortor orci, luctus a pretium vel, ultrices porta
                                    nisl.
                                </p> */}
                                            {/* <div className="tag-n-cat">
                                    <div className="tags">
                                        <span><i className><span><i className><svg className="feather feather-tag" strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none" viewBox="0 0 24 24" height={18} width={18} xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                            <line y2={7} x2={7} y1={7} x1={7} />
                                        </svg></i></span></i> Post Tags:</span>
                                        <a title href="#">News</a>
                                        <a title href="#">ideas</a>
                                        <a title href="#">collection</a>
                                        <a title href="#">exclusive</a>
                                        <a title href="#">features</a>
                                    </div>
                                    <div className="tags">
                                        <span><i className>
                                            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-filter">
                                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3">
                                                </polygon>
                                            </svg></i> Post Categories:</span>
                                        <a title href="#">News</a>
                                        <a title href="#">ideas</a>
                                        <a title href="#">collection</a>
                                        <a title href="#">exclusive</a>
                                        <a title href="#">features</a>
                                    </div>
                                </div> */}
                                        </div>
                                        <div className="next-prev-posts" style={{ display: 'flex', alignContent: 'center' }}>
                                            <div className={`prev ${currentIndex === 0 ? 'disabled' : ''}`} style={{ cursor: 'pointer' }} onClick={handlePrevious}  >
                                                <div className='prem' title>
                                                    <i style={{ color: '#00a6d3' }} className="icofont-curved-double-left" />
                                                    <div className="translate">
                                                        <span className='pe' style={{ color: '#00a6d3' }}>Trang trước</span>
                                                        <p>Xem lại tiến trình trước.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`next ${currentIndex === processactivity.length - 1 ? 'disabled' : ''}`} style={{ cursor: 'pointer' }} onClick={handleNext} >
                                                <div className='pre' title>
                                                    <i style={{ color: '#00a6d3' }} className="icofont-curved-double-right" />
                                                    <div className="translate">
                                                        <span className='per' style={{ color: '#00a6d3' }} >Trang sau</span>
                                                        <p>Xem tiếp tiến trình sau.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </section>
            {/* <figure className="bottom-mockup"><img src="images/footer.png" alt /></figure> */}
            <div className="bottombar">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <span className>© SVCW</span>
                        </div>
                    </div>
                </div>
            </div>{/* bottombar */}
            <div className="wraper-invite">
                <div className="popup">
                    <span className="popup-closed"><i className="icofont-close" /></span>
                    <div className="popup-meta">
                        <div className="popup-head">
                            <h5><i>
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z">
                                    </path>
                                    <polyline points="22,6 12,13 2,6" />
                                </svg></i> Invite Colleagues</h5>
                        </div>
                        <div className="invitation-meta">
                            <p>
                                Enter an email address to invite a colleague or co-author to join you on socimo. They will
                                receive an email and, in some cases, up to two reminders.
                            </p>
                            <form method="post" className="c-form">
                                <input type="text" placeholder="Enter Email" />
                                <button type="submit" className="main-btn">Invite</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>{/* invite colleague popup */}
            <div className="popup-wraper">
                <div className="popup">
                    <span className="popup-closed"><i className="icofont-close" /></span>
                    <div className="popup-meta">
                        <div className="popup-head">
                            <h5><i>
                                <svg className="feather feather-message-square" strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none" viewBox="0 0 24 24" height={24} width={24} xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg></i> Send Message</h5>
                        </div>
                        <div className="send-message">
                            <form method="post" className="c-form">
                                <input type="text" placeholder="Enter Name.." />
                                <input type="text" placeholder="Subject" />
                                <textarea placeholder="Write Message" defaultValue={""} />
                                <div className="uploadimage">
                                    <i className="icofont-file-jpg" />
                                    <label className="fileContainer">
                                        <input type="file" />Attach file
                                    </label>
                                </div>
                                <button type="submit" className="main-btn">Send</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>{/* send message popup */}
            <div className="side-slide">
                <span className="popup-closed"><i className="icofont-close" /></span>
                <div className="slide-meta">
                    <ul className="nav nav-tabs slide-btns">
                        <li className="nav-item"><a className="active" href="#messages" data-toggle="tab">Messages</a></li>
                        <li className="nav-item"><a className href="#notifications" data-toggle="tab">Notifications</a></li>
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane active fade show" id="messages">
                            <h4><i className="icofont-envelope" /> messages</h4>
                            <a href="#" className="send-mesg" title="New Message" data-toggle="tooltip"><i className="icofont-edit" /></a>
                            <ul className="new-messages">
                                <li>
                                    <figure><img src="images/resources/user1.jpg" alt /></figure>
                                    <div className="mesg-info">
                                        <span>Ibrahim Ahmed</span>
                                        <a href="#" title>Helo dear i wanna talk to you</a>
                                    </div>
                                </li>
                                <li>
                                    <figure><img src="images/resources/user2.jpg" alt /></figure>
                                    <div className="mesg-info">
                                        <span>Fatima J.</span>
                                        <a href="#" title>Helo dear i wanna talk to you</a>
                                    </div>
                                </li>
                                <li>
                                    <figure><img src="images/resources/user3.jpg" alt /></figure>
                                    <div className="mesg-info">
                                        <span>Fawad Ahmed</span>
                                        <a href="#" title>Helo dear i wanna talk to you</a>
                                    </div>
                                </li>
                                <li>
                                    <figure><img src="images/resources/user4.jpg" alt /></figure>
                                    <div className="mesg-info">
                                        <span>Saim Turan</span>
                                        <a href="#" title>Helo dear i wanna talk to you</a>
                                    </div>
                                </li>
                                <li>
                                    <figure><img src="images/resources/user5.jpg" alt /></figure>
                                    <div className="mesg-info">
                                        <span>Alis wells</span>
                                        <a href="#" title>Helo dear i wanna talk to you</a>
                                    </div>
                                </li>
                            </ul>
                            <a href="#" title className="main-btn" data-ripple>view all</a>
                        </div>
                        <div className="tab-pane fade" id="notifications">
                            <h4><i className="icofont-bell-alt" /> notifications</h4>
                            <ul className="notificationz">
                                <li>
                                    <figure><img src="images/resources/user5.jpg" alt /></figure>
                                    <div className="mesg-info">
                                        <span>Alis wells</span>
                                        <a href="#" title>recommend your post</a>
                                    </div>
                                </li>
                                <li>
                                    <figure><img src="images/resources/user4.jpg" alt /></figure>
                                    <div className="mesg-info">
                                        <span>Alis wells</span>
                                        <a href="#" title>share your post <strong>a good time today!</strong></a>
                                    </div>
                                </li>
                                <li>
                                    <figure><img src="images/resources/user2.jpg" alt /></figure>
                                    <div className="mesg-info">
                                        <span>Alis wells</span>
                                        <a href="#" title>recommend your post</a>
                                    </div>
                                </li>
                                <li>
                                    <figure><img src="images/resources/user1.jpg" alt /></figure>
                                    <div className="mesg-info">
                                        <span>Alis wells</span>
                                        <a href="#" title>share your post <strong>a good time today!</strong></a>
                                    </div>
                                </li>
                                <li>
                                    <figure><img src="images/resources/user3.jpg" alt /></figure>
                                    <div className="mesg-info">
                                        <span>Alis wells</span>
                                        <a href="#" title>recommend your post</a>
                                    </div>
                                </li>
                            </ul>
                            <a href="#" title className="main-btn" data-ripple>view all</a>
                        </div>
                    </div>
                </div>
            </div>{/* side slide message & popup */}


            {isOpen === true ?
                <div className="post-new-popup" style={popupStyle}>
                    <div className="popup" style={{ width: 800, marginTop: '100px', zIndex: 80 }}>
                        <span className="popup-closed" onClick={handleClick}><i className="icofont-close" /></span>
                        <div className="popup-meta">
                            <div className="popup-head">
                                <h5><i>
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
                                        <line x1={12} y1={5} x2={12} y2={19} />
                                        <line x1={5} y1={12} x2={19} y2={12} />
                                    </svg></i>Chỉnh Sửa Tiến Trình</h5>
                            </div>
                        </div>

                        <div className="form1">
                            <header className="header">

                            </header>
                            <div className="form-wrap">
                                <form id="survey-form" method="post" onSubmit={formik.handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label id="name-label" htmlFor="name">Tên Tiến Trình</label>
                                                <input type="text" name='processTitle' onChange={formik.handleChange} value={formik.values.processTitle} id="name" placeholder="Nhập Tên Tiến Trình" className="form-control" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label id="email-label" htmlFor="email">Mô Tả Tiến Trình</label>
                                                <input type="text" name='description' onChange={formik.handleChange} value={formik.values.description} id="email" placeholder="Nhập Mô Tả" className="form-control" required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label id="name-label" htmlFor="name">Ngày Bắt Đầu</label>
                                                <input type="datetime-local" name='startDate' onChange={formik.handleChange} value={formik.values.startDate} id="name" className="form-control" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label id="name-label" htmlFor="name">Ngày Kết Thúc</label>
                                                <input type="datetime-local" name='endDate' onChange={formik.handleChange} value={formik.values.endDate} id="name" placeholder="Nhập Nơi Diễn Ra" className="form-control" required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label id="name-label" htmlFor="name">Loại Tiến Trình</label>
                                                <select data-te-select-init data-te-select-visible-options="3" name='processTypeId' onChange={formik.handleChange} value={formik.values.processTypeId} id="name" className="form-control">
                                                    <option value={currentObject.processTypeId}>abc</option>
                                                    {processType.map((item, index) => {
                                                        return <option value={item.processTypeId} key={index}>{item.processTypeName}</option>
                                                    })}
                                                </select>

                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4">
                                            <button type="submit" id="submit" className="btn btn-primary btn-block">Hoàn Thành</button>
                                        </div>
                                    </div>
                                </form>

                            </div>

                        </div>

                    </div>
                </div>

                :
                <div></div>
            }


            {isOpen1 === true ?
                <div className="post-new-popup" style={popupStyle1}>
                    <div className="popup" style={{ width: 800, marginTop: '100px', zIndex: 80 }}>
                        <span className="popup-closed" onClick={handleClick1}><i className="icofont-close" /></span>
                        <div className="popup-meta">
                            <div className="popup-head">
                                <h5><i>
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
                                        <line x1={12} y1={5} x2={12} y2={19} />
                                        <line x1={5} y1={12} x2={19} y2={12} />
                                    </svg></i>Thêm MớiTiến Trình</h5>
                            </div>
                        </div>

                        <div className="form1">
                            <header className="header">

                            </header>
                            <div className="form-wrap">
                                <form id="survey-form" method="post" onSubmit={formik1.handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label id="name-label" htmlFor="name">Tên Tiến Trình</label>
                                                <input type="text" name='processTitle' onChange={formik1.handleChange} id="name" placeholder="Nhập Tên Tiến Trình" className="form-control" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label id="email-label" htmlFor="email">Mô Tả Tiến Trình</label>
                                                <input type="text" name='description' onChange={formik1.handleChange} id="email" placeholder="Nhập Mô Tả" className="form-control" required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label id="name-label" htmlFor="name">Ngày Bắt Đầu</label>
                                                <input type="datetime-local" name='startDate' onChange={formik1.handleChange} id="name" className="form-control" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label id="name-label" htmlFor="name">Ngày Kết Thúc</label>
                                                <input type="datetime-local" name='endDate' onChange={formik1.handleChange} id="name" placeholder="Nhập Nơi Diễn Ra" className="form-control" required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label id="name-label" htmlFor="name">Loại Tiến Trình</label>
                                                <select data-te-select-init data-te-select-visible-options="3" name='processTypeId' onChange={formik1.handleChange} id="name" className="form-control">
                                                    <option value={""} >Chọn loại tiến trình</option>
                                                    {processType.map((item, index) => {
                                                        return <option value={item.processTypeId} key={index}>{item.processTypeName}</option>
                                                    })}
                                                </select>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label>Hình Ảnh</label>
                                                <div>
                                                    <form>
                                                        <fieldset className="upload_dropZone text-center mb-3 p-4" >
                                                            <legend className="visually-hidden">Tải Lên Hình Ảnh</legend>
                                                            <svg className="upload_svg" width={60} height={60} aria-hidden="true">
                                                                <use href="#icon-imageUpload" />
                                                            </svg>
                                                            <p className="small my-2">Kéo &amp; Thả (các) hình nền bên trong vùng nét đứt<br /><i>hoặc</i></p>
                                                            <input

                                                                id="upload_image_background"
                                                                // ref={fileInputRef}
                                                                data-post-name="image_background"
                                                                data-post-url="https://someplace.com/image/uploads/backgrounds/"
                                                                className="position-absolute invisible"
                                                                type="file"
                                                                multiple
                                                                onChange={handleImageChange}
                                                                accept="image/jpeg, image/png, image/svg+xml"
                                                            />
                                                            <label className="btn btn-upload mb-3" htmlFor="upload_image_background">Chọn Hình Ảnh</label>
                                                            <div className="upload_gallery d-flex flex-wrap justify-content-center gap-3 mb-0" />
                                                        </fieldset>

                                                    </form>
                                                    <svg style={{ display: 'none' }}>
                                                        <defs>
                                                            <symbol id="icon-imageUpload" clipRule="evenodd" viewBox="0 0 96 96">
                                                                <path d="M47 6a21 21 0 0 0-12.3 3.8c-2.7 2.1-4.4 5-4.7 7.1-5.8 1.2-10.3 5.6-10.3 10.6 0 6 5.8 11 13 11h12.6V22.7l-7.1 6.8c-.4.3-.9.5-1.4.5-1 0-2-.8-2-1.7 0-.4.3-.9.6-1.2l10.3-8.8c.3-.4.8-.6 1.3-.6.6 0 1 .2 1.4.6l10.2 8.8c.4.3.6.8.6 1.2 0 1-.9 1.7-2 1.7-.5 0-1-.2-1.3-.5l-7.2-6.8v15.6h14.4c6.1 0 11.2-4.1 11.2-9.4 0-5-4-8.8-9.5-9.4C63.8 11.8 56 5.8 47 6Zm-1.7 42.7V38.4h3.4v10.3c0 .8-.7 1.5-1.7 1.5s-1.7-.7-1.7-1.5Z M27 49c-4 0-7 2-7 6v29c0 3 3 6 6 6h42c3 0 6-3 6-6V55c0-4-3-6-7-6H28Zm41 3c1 0 3 1 3 3v19l-13-6a2 2 0 0 0-2 0L44 79l-10-5a2 2 0 0 0-2 0l-9 7V55c0-2 2-3 4-3h41Z M40 62c0 2-2 4-5 4s-5-2-5-4 2-4 5-4 5 2 5 4Z" />
                                                            </symbol>
                                                        </defs>
                                                    </svg>
                                                </div>

                                                <div className="image-container">
                                                    {images.map((image, index) => (
                                                        <div className="image-item" key={index}>
                                                            <img src={image.url} alt={`Image ${index}`} className="image-preview" />
                                                            <button className="delete-button" onClick={() => handleImageDelete(index)}>
                                                                <span>&times;</span>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>

                                                {isLoading && (
                                                    <div>
                                                        <div className="progress-bar-container">
                                                            <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                                                        </div>
                                                        <div className="progress-percentage">{uploadProgress}%</div>
                                                    </div>
                                                )}

                                                {files !== '' ? <img src={files} style={{ height: '300px' }} /> : <div></div>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <button type="submit" id="submit" className="btn btn-primary btn-block">Hoàn Thành</button>
                                        </div>
                                    </div>
                                </form>

                            </div>

                        </div>

                    </div>
                </div>

                :
                <div></div>
            }

        </div>

    )
}
