
import React, { Fragment, useEffect, useState } from 'react'
import { GetFanpageByIDAction } from '../../redux/actions/FanpageAction';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { NavLink } from 'react-router-dom/cjs/react-router-dom';
import { useFormik } from 'formik';
import { DonationAction } from '../../redux/actions/DonationAction';
import { FollowAction, JoinAction, UnFollowAction, UnJoinAction } from '../../redux/actions/FollowJoinAction';
import Swal from 'sweetalert2';
import { CommentAction, CommentFanpageAction, CommentRepllyAction, CommentRepllyFanpageAction } from '../../redux/actions/CommentAction';
import { DeleteLikeAction, PostLikeAction } from '../../redux/actions/ActivityAction';
import DetailActivity from '../../component/DetailActivity';
export default function GroupsDetail (props) {
    const [cmt, setCmt] = useState([])
    const { id } = props.match.params;
    const dispatch = useDispatch()
    const { fanpageId, fanpageActivity } = useSelector(root => root.FanpageReducer)
    const { userID } = useSelector(root => root.LoginReducer)
    console.log(fanpageId, fanpageActivity);
    useEffect(() => {
        const action = GetFanpageByIDAction(id);
        dispatch(action)
    }, []);
    const initialCommentData = JSON.parse(localStorage.getItem('fanpageactivity'))?.map((comment) => ({
        id: comment.activityId,
        isCmt: true,
        color: '#eae9ee'
    }));
    const [commentData, setCommentData] = useState(initialCommentData);
    useEffect(() => {
        const updatedArrActivity = JSON.parse(localStorage.getItem('fanpageactivity'))?.map((activity) => {
            const matchingComments = commentData?.filter((comment) => comment.id === activity.activityId);
            return { ...activity, commentData: matchingComments };
        });
        setCmt(updatedArrActivity)
    }, [commentData, fanpageActivity]);
    const DateTime = (item) => {
        const currentTime = moment();
        const inputTime = moment(item);
        const duration = moment.duration(currentTime.diff(inputTime));
        const hoursAgo = duration.asHours();
        let timeAgoString = '';
        if (hoursAgo < 1) {
            const daysAgo = Math.floor(duration.asMinutes());
            timeAgoString = `${daysAgo} phút trước`;
        }
        else if (hoursAgo >= 24) {
            const daysAgo = Math.floor(duration.asDays());
            timeAgoString = `${daysAgo} ngày trước`;
        } else {
            const hoursAgo = Math.floor(duration.asHours());
            timeAgoString = `${hoursAgo} giờ trước`;
        }
        return timeAgoString
    }
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [detail, setDetail] = useState({})
    const [tcss, setTcss] = useState('css');
    const [onID, setOnID] = useState('')
    const [commentI, setCommentI] = useState('commentContent')
    const [content, setContent] = useState('')
    const openPopup = () => {
        setPopupOpen(true);
    };
    const closePopup = () => {
        setPopupOpen(false);
    };
    const formik1 = useFormik({
        initialValues: {
            title: "",
            amount: 0,
            email: "",
            phone: "",
            name: "",
            isAnonymous: true,
            activityId: ""
        },
        onSubmit: async (value) => {
            console.log(value);
            const action = await DonationAction(value);
            await dispatch(action)
            setPopupOpen(false);
        }
    })
    function calculateImageClass (imageCount) {
        let imageClass = 'full-width';
        if (imageCount === 2) {
            imageClass = 'half-width';
        } else if (imageCount === 3 || imageCount === 4) {
            imageClass = 'quarter-width';
        }
        return imageClass;
    }
    const handleJoinClick = (index, activity, isJoin, title) => {
        setCmt((prevArray) => {
            const newArray = JSON.parse(JSON.stringify(prevArray));
            newArray[index].isJoin = !newArray[index].isJoin;
            localStorage.setItem(`activity`, JSON.stringify(newArray));

            return newArray;
        });
        if (isJoin) {
            console.log('Hủy Tham Gia');
            const action = UnJoinAction(activity, userID);
            dispatch(action)
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'error',
                title: `Bỏ Tham Gia Thành Công Sự Kiện ${title}`
            })


        }
        else {
            console.log('Tham Gia');
            const action = JoinAction(activity, userID);
            dispatch(action)
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'success',
                title: `Tham Gia Thành Công Sự Kiện ${title}`
            })
        }
    };
    const handleFollowClick = (index, activity, isFollow, title) => {
        setCmt((prevArray) => {
            const newArray = JSON.parse(JSON.stringify(prevArray));
            newArray[index].isFollow = !newArray[index].isFollow;
            localStorage.setItem(`activity`, JSON.stringify(newArray));

            return newArray;
        });
        if (isFollow) {
            console.log('Hủy Theo Dõi');
            const action = UnFollowAction(activity, userID);
            dispatch(action)
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'error',
                title: `Bỏ Theo Dõi Thành Công Sự Kiện ${title}`
            })


        }
        else {
            console.log('Theo Dõi');
            const action = FollowAction(activity, userID);
            dispatch(action)
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'success',
                title: `Theo Dõi Thành Công Sự Kiện ${title}`
            })
        }
    };
    const formik2 = useFormik({
        enableReinitialize: true,
        initialValues: {
            userId: userID,
            activityId: "",
            commentContent: "",
            status: true,
            commentIdReply: ""
        },
        onSubmit: (value) => {
            console.log(value);
            if (value.commentIdReply === "") {
                const action = CommentFanpageAction(value, id);
                dispatch(action)
                formik2.setFieldValue('commentContent', '');
            }
            else {
                const action = CommentRepllyFanpageAction(value, id);
                dispatch(action)
                // formik2.setFieldValue('commentIdReply', '');
                // setCommentI('commentContent')
                // setContent(true)
                formik2.setFieldValue('commentContent', '');
                formik2.setFieldValue('commentIdReply', '');
            }

        }
    })
    const handleCommentClick = async (id) => {
        console.log(id);
        const updatedComments = await commentData?.map((comment) => {
            if (comment.id === id) {
                return { ...comment, isCmt: !comment.isCmt };
            }
            return comment;
        }, () => {
            console.log(updatedComments);
        });

        setCommentData(updatedComments);
        console.log(commentData);
    };

    const handleLikeClick = (id) => {
        const updatedComments = commentData.map((comment) => {
            if (comment.id === id) {
                if (comment.color === 'rgb(117, 189, 240)') {
                    return { ...comment, color: '#eae9ee' };
                } else {
                    return { ...comment, color: 'rgb(117, 189, 240)' };
                }
            }
            return comment;
        });
        let alreadyLiked = false;

        JSON.parse(localStorage.getItem('activity'))?.map((comment) => {
            if (comment.activityId === id && comment.like.length > 0) {
                comment.like.map(item => {
                    console.log(item)
                    if (item.userId === userID) {
                        alreadyLiked = true
                    }
                })
            }
        });

        let action = null;

        if (alreadyLiked) {
            action = DeleteLikeAction({
                userId: userID,
                activityId: id
            });
        } else {
            action = PostLikeAction({
                userId: userID,
                activityId: id
            });
        }
        dispatch(action)


        setCommentData(updatedComments);
    };
    return (
        <Fragment>
            <section>
                <div className="gap">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div id="page-contents" className="row merged20">
                                    <div className="col-lg-3">
                                        <aside className="sidebar static left">
                                            {/* <div className="widget">
                                                <span><i className="icofont-globe" /> Sponsored</span>
                                                <ul className="sponsors-ad">
                                                    <li>
                                                        <figure><img alt src="images/resources/sponsor.jpg" /></figure>
                                                        <div className="sponsor-meta">
                                                            <h5><a title href="#">IQ Options Broker</a></h5>
                                                            <a target="_blank" title href="#">www.iqvie.com</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img alt src="images/resources/sponsor2.jpg" /></figure>
                                                        <div className="sponsor-meta">
                                                            <h5><a title href="#">BM Fashion Designer</a></h5>
                                                            <a target="_blank" title href="#">www.abcd.com</a>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div> */}
                                            {/* <div className="widget">
                                                <h4 className="widget-title">Sự kiện gần đây</h4>
                                                <ul className="ak-groups">
                                                    <li>
                                                        <figure><img alt src="images/resources/your-group1.jpg" /></figure>
                                                        <div className="your-grp">
                                                            <h5><a title href="group-detail.html">Hiến máu </a></h5>
                                                            <a title href="#"><i className="icofont-bell-alt" />Notifilactions <span>13</span></a>
                                                            <a className="promote" title href="group-feed.html">view feed</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img alt src="images/resources/your-group2.jpg" /></figure>
                                                        <div className="your-grp">
                                                            <h5><a title href="group-detail.html">E-course Group</a></h5>
                                                            <a title href="#"><i className="icofont-bell-alt" />Notifilactions <span>13</span></a>
                                                            <a className="promote" title href="group-feed.html">view feed</a>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="widget">
                                                <h4 className="widget-title">Đề xuất</h4>
                                                <div className="sug-caro">
                                                    <div className="friend-box">
                                                        <figure>
                                                            <img alt src="images/resources/sidebar-info.jpg" />
                                                            <span>Members: 505K</span>
                                                        </figure>
                                                        <div className="frnd-meta">
                                                            <img alt src="images/resources/frnd-figure2.jpg" />
                                                            <div className="frnd-name">
                                                                <a title href="#">Social Research</a>
                                                                <span>@biolabest</span>
                                                            </div>
                                                            <a className="main-btn2" href="#" title>Join Community</a>
                                                        </div>
                                                    </div>
                                                    <div className="friend-box">
                                                        <figure>
                                                            <img alt src="images/resources/sidebar-info2.jpg" />
                                                            <span>Members: 505K</span>
                                                        </figure>
                                                        <div className="frnd-meta">
                                                            <img alt src="images/resources/frnd-figure3.jpg" />
                                                            <div className="frnd-name">
                                                                <a title href="#">Bio Labest Group</a>
                                                                <span>@biolabest</span>
                                                            </div>
                                                            <a className="main-btn2" href="#" title>Join Community</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="widget">
                                                <h4 className="widget-title">Ask Research Question?</h4>
                                                <div className="ask-question">
                                                    <i className="icofont-question-circle" />
                                                    <h6>Ask questions in Q&amp;A to get help from experts in your field.</h6>
                                                    <a className="ask-qst" href="#" title>Ask a question</a>
                                                </div>
                                            </div>
                                            <div className="widget">
                                                <h4 className="widget-title">Explor Events <a className="see-all" href="#" title>See All</a></h4>
                                                <div className="rec-events bg-purple">
                                                    <i className="icofont-gift" />
                                                    <h6><a title href>BZ University good night event in columbia</a></h6>
                                                    <img alt src="images/clock.png" />
                                                </div>
                                                <div className="rec-events bg-blue">
                                                    <i className="icofont-microphone" />
                                                    <h6><a title href>The 3rd International Conference 2020</a></h6>
                                                    <img alt src="images/clock.png" />
                                                </div>
                                            </div>
                                            <div className="widget">
                                                <h4 className="widget-title">Group Terms</h4>
                                                <div className="grop-rules">
                                                    <p>
                                                        Hi! To ensure that this is a great place for everyone to have a wondefull time, we have some rules. Breaking them will result in a ban from the group.
                                                    </p>
                                                    <ol>
                                                        <li><i className="icofont-dotted-right" /> Be positive! Respect and help other viewers</li>
                                                        <li><i className="icofont-dotted-right" /> No insults, aggravations or any other bad languag</li>
                                                        <li><i className="icofont-dotted-right" /> No self promotions</li>
                                                        <li><i className="icofont-dotted-right" /> Avoid political or religious discussions</li>
                                                        <li><i className="icofont-dotted-right" /> No comment spamming</li>
                                                    </ol>
                                                </div>
                                            </div>
                                            <div className="widget stick-widget">
                                                <h4 className="widget-title">Featured Universities <a className="see-all" href="#" title>See All</a></h4>
                                                <ul className="featured-comp">
                                                    <li>
                                                        <a href="#" title="Color Hands inc" data-toggle="tooltip"><img src="images/resources/company1.png" alt /></a>
                                                    </li>
                                                    <li>
                                                        <a href="#" title="Macrosoft inc" data-toggle="tooltip"><img src="images/resources/company2.png" alt /></a>
                                                    </li>
                                                    <li>
                                                        <a href="#" title="EBM inc" data-toggle="tooltip"><img src="images/resources/company3.png" alt /></a>
                                                    </li>
                                                    <li>
                                                        <a href="#" title="Boogle inc" data-toggle="tooltip"><img src="images/resources/company4.png" alt /></a>
                                                    </li>
                                                    <li>
                                                        <a href="#" title="Color Hands inc" data-toggle="tooltip"><img src="images/resources/company5.png" alt /></a>
                                                    </li>
                                                    <li>
                                                        <a href="#" title="Macrosoft inc" data-toggle="tooltip"><img src="images/resources/company6.png" alt /></a>
                                                    </li>
                                                    <li>
                                                        <a href="#" title="EBM inc" data-toggle="tooltip"><img src="images/resources/company7.png" alt /></a>
                                                    </li>
                                                    <li>
                                                        <a href="#" title="Boogle inc" data-toggle="tooltip"><img src="images/resources/company8.png" alt /></a>
                                                    </li>
                                                </ul>
                                            </div> */}
                                        </aside>
                                    </div>
                                    <div className="col-lg-9">
                                        <div className="group-feed">
                                            <div className="group-avatar">
                                                <img src={fanpageId.coverImage} alt />
                                                {localStorage.getItem('userID') === fanpageId.fanpageId ? <div></div> : <a href="#" title><i className="icofont-check-circled" />Theo Dõi</a>}
                                                <figure className="group-dp"><img src={fanpageId.avatar} alt /></figure>
                                            </div>
                                            <div className="grp-info">
                                                <h4>{fanpageId.fanpageName} <span>@Cộng đồng</span></h4>
                                                <ul>
                                                    <li><span>Ngày Tạo: </span>{moment(fanpageId.createAt).format('DD-MM-YYYY')}</li>
                                                    <li><span>Số Điện Thoại: </span> {fanpageId.phone}</li>
                                                    <li><span>Bài Viết: </span> {fanpageActivity.length}</li>
                                                    <li><span>Lượt Theo Dõi:</span>{fanpageId.numberFollow}</li>
                                                </ul>
                                                <ul className="more-grp-info">
                                                    <li>
                                                        <form className="c-form" method="post">
                                                            <input type="text" placeholder="Tìm Kiếm" />
                                                            <i className="icofont-search-1" />
                                                        </form>
                                                    </li>
                                                    <li>
                                                        <div className="more">
                                                            <div className="more-post-optns">
                                                                <i className>
                                                                    <svg className="feather feather-more-horizontal" strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none" viewBox="0 0 24 24" height={24} width={24} xmlns="http://www.w3.org/2000/svg"><circle r={1} cy={12} cx={12} /><circle r={1} cy={12} cx={19} /><circle r={1} cy={12} cx={5} /></svg></i>
                                                                <ul>
                                                                    <li>
                                                                        <i className="icofont-pen-alt-1" />Edit Post
                                                                        <span>Edit This Post within a Hour</span>
                                                                    </li>
                                                                    <li>
                                                                        <i className="icofont-ban" />Hide Post
                                                                        <span>Hide This Post</span>
                                                                    </li>
                                                                    <li>
                                                                        <i className="icofont-ui-delete" />Delete Post
                                                                        <span>If inappropriate Post By Mistake</span>
                                                                    </li>
                                                                    <li>
                                                                        <i className="icofont-flag" />Report
                                                                        <span>Inappropriate content</span>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="main-wraper">
                                                <div className="grp-about">
                                                    <div className="row">
                                                        <div className="col-lg-8">
                                                            <h4>Chi Tiết</h4>
                                                            <p>{fanpageId.description}</p>
                                                        </div>
                                                        <div className="col-lg-4">
                                                            {/* <div className="share-article">
                                                                <span>Chia sẻ nhóm</span>
                                                                <a href="#" title className="facebook"><i className="icofont-facebook" /></a>
                                                                <a href="#" title className="pinterest"><i className="icofont-pinterest" /></a>
                                                                <a href="#" title className="instagram"><i className="icofont-instagram" /></a>
                                                                <a href="#" title className="twitter"><i className="icofont-twitter" /></a>
                                                                <a href="#" title className="google"><i className="icofont-google-plus" /></a>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-8">
                                                    {/* <div className="main-wraper">
                                                        <span className="new-title">Create New Post</span>
                                                        <div className="new-post">
                                                            <form method="post">
                                                                <i className="icofont-pen-alt-1" />
                                                                <input type="text" placeholder="Create New Post" />
                                                            </form>
                                                            <ul className="upload-media">
                                                                <li>
                                                                    <i><img src="images/image.png" alt /></i>
                                                                    <span>Photo/Video</span>
                                                                </li>
                                                                <li>
                                                                    <i><img src="images/activity.png" alt /></i>
                                                                    <span>Feeling/Activity</span>
                                                                </li>
                                                                <li>
                                                                    <i><img src="images/live-stream.png" alt /></i>
                                                                    <span>Live Stream</span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>create new post */}

                                                    {cmt.map((item, index) => {
                                                        const detailItem = item

                                                        return <div className="main-wraper">
                                                            <div className="user-post">
                                                                <div className="friend-info">
                                                                    <figure>
                                                                        <em>
                                                                            <svg style={{ verticalAlign: 'middle' }} xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 24 24">
                                                                                <path fill="#7fba00" stroke="#7fba00" d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z">
                                                                                </path>
                                                                            </svg></em>
                                                                        <img style={{ height: '3rem', width: '3.5rem' }} alt src="images/avatar/uocAvatar.jpg" />
                                                                    </figure>
                                                                    <div className="friend-name">
                                                                        <div className="more">
                                                                            <div className="more-post-optns">
                                                                                <i className>
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal">
                                                                                        <circle cx={12} cy={12} r={1} />
                                                                                        <circle cx={19} cy={12} r={1} />
                                                                                        <circle cx={5} cy={12} r={1} />
                                                                                    </svg></i>
                                                                                <ul>
                                                                                    <li>
                                                                                        <i className="icofont-pen-alt-1" />Edit Post
                                                                                        <span>Edit This Post within a Hour</span>
                                                                                    </li>
                                                                                    <li>
                                                                                        <i className="icofont-ban" />Hide Post
                                                                                        <span>Hide This Post</span>
                                                                                    </li>
                                                                                    <li>
                                                                                        <i className="icofont-ui-delete" />Delete Post
                                                                                        <span>If inappropriate Post By Mistake</span>
                                                                                    </li>
                                                                                    <li>
                                                                                        <i className="icofont-flag" />Report
                                                                                        <span>Inappropriate content</span>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                        <ins><a title href="">{item.user?.username}</a> </ins>
                                                                        <span>  {DateTime(item.createAt)} <i className="icofont-globe" /></span>
                                                                    </div>
                                                                    <div className="post-meta">
                                                                        {/* <em><a href="https://themeforest.net/item/winku-social-network-toolkit-responsive-template/22363538" title target="_blank">https://themeforest.net/item/winku-social-network-toolkit-responsive-template/22363538</a></em> */}


                                                                        {/* <a href="https://themeforest.net/item/winku-social-network-toolkit-responsive-template/22363538" className="post-title" target="_blank">{item.title}</a> */}
                                                                        {/* <p>
                                                                {item.description}
                                                            </p> */}

                                                                        {/* hình ảnh */}
                                                                        {item.process.length !== 0 ? <NavLink to={`/detailprocess/${item.activityId}`} style={{ fontSize: '20px', fontWeight: 'bold', color: '#3f6ad8', marginBottom: '20px', cursor: 'pointer' }} onClick={() => {
                                                                            // handleClick2()
                                                                            // const action = GetProcessByActivityAction(item.activityId);
                                                                            // dispatch(action)
                                                                        }}>Xem Tiến Trình</NavLink> : <div></div>}
                                                                        <figure style={{}}>
                                                                            {/* <p style={{ width: '100%' }}>fetched-image</p> */}
                                                                            {item.targetDonation !== 0 ? <button className='btn btn-primary mb-2' onClick={() => {
                                                                                // setActi(item.activityId)
                                                                                formik1.setFieldValue('activityId', item.activityId)
                                                                                openPopup()
                                                                            }}>Ủng Hộ</button> : <div></div>}
                                                                            <div className="image-gallery">
                                                                                <div className="image-gallery">
                                                                                    {item.media?.map((image, index) => {
                                                                                        const imageClass = calculateImageClass(item.media.length);
                                                                                        return <div key={index} className={`image-container ${imageClass} `}>
                                                                                            <a data-toggle="modal" data-target="#img-comt" href="images/resources/album1.jpg" onClick={() => {
                                                                                                setDetail(detailItem)
                                                                                            }}>
                                                                                                <img src={image.linkMedia} alt={`Image ${image.id}`} className="gallery-image" />
                                                                                            </a>
                                                                                        </div>
                                                                                    })}
                                                                                </div>
                                                                            </div>

                                                                        </figure>
                                                                        <div className='row'>
                                                                            <div style={{ display: 'flex', alignContent: 'center' }} className='col-lg-12'>


                                                                                <a href="" target="_blank" style={{ fontSize: '25px', fontWeight: 'bold', width: '450px', wordWrap: 'break-word', color: '#3f6ad8' }} className='col-lg-8'>{item.title}</a>
                                                                                <div className=" ml-3 mt-3 col-lg-4" style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline', textAlign: 'right' }} onClick={() => { handleFollowClick(index, item.activityId, item.isFollow, item.title) }}>{item?.isFollow ? "Hủy Theo Dõi" : "Theo Dõi"}</div>
                                                                            </div>
                                                                        </div>
                                                                        <p className='mt-3'>
                                                                            <span style={{ color: 'black', fontWeight: 'bold', fontSize: '15px' }}>Chi Tiết :</span> {item.description}
                                                                        </p>


                                                                        {item.targetDonation !== 0 ?
                                                                            <div className='mb-4'>
                                                                                <div> <span style={{ fontWeight: 'bold', fontSize: '15px' }}> - Mục Tiêu : </span> <span style={{ color: 'blue', fontSize: '15px' }}>{(item.targetDonation).toLocaleString()} vnđ</span> </div>
                                                                                <div className='mb-3'> <span style={{ fontWeight: 'bold', fontSize: '15px' }}>- Tổng Tiền Đã Nhận : </span> <span style={{ color: 'blue', fontSize: '15px' }}>{(item.realDonation).toLocaleString()} vnđ</span> </div>
                                                                                <input
                                                                                    type="range"
                                                                                    min="0"
                                                                                    max={item.targetDonation}
                                                                                    value={item.realDonation}
                                                                                    // onChange={handleChange}
                                                                                    className="range-slider"
                                                                                    style={{ background: `linear-gradient(to right,  #4287f5 0%, #4287f5  ${(item.realDonation / item.targetDonation) * 100}%, #ddd ${(item.realDonation / item.targetDonation) * 100}%, #ddd 100%)` }}
                                                                                />
                                                                                {/* <div className="range-value" style={{ position: 'absolute', left: `${((item.realDonation - 5) * 100) / (100 - 0)}%` }}>{item.realDonation}%</div> */}
                                                                                {item.realDonation !== 0 ? <div></div> : <div className="range-value" style={{ position: 'absolute' }}>0</div>}
                                                                                {/* <div className="range-value" style={{ position: 'absolute' }}>0</div> */}
                                                                                {/* {item.realDonation !== 0 ? <div className="range-value" style={{ position: 'absolute', left: `${((item.realDonation - 5) * 100) / (100 - 0)}%` }}>{((item.realDonation / item.targetDonation) * 100).toString().split('.')[0]}%</div> : <div className="range-value" style={{ position: 'absolute', left: `${((item.realDonation - 0) * 100) / (100 - 0)}%` }}>{((item.realDonation / item.targetDonation) * 100).toString().split('.')[0]}%</div>} */}
                                                                                {item.realDonation === 0 ? <div></div> : <div className="range-value" style={{ position: 'absolute', left: `${(item.realDonation / item.targetDonation) * 100}%` }}> {(item.realDonation / item.targetDonation) * 100}%</div>}
                                                                                <div className="range-value" style={{ position: 'absolute', right: '10px' }}>100%</div>

                                                                            </div>
                                                                            :
                                                                            <div></div>
                                                                        }

                                                                        <button className=' btn btn-success ml-3 mb-4 mt-4' onClick={() => { handleJoinClick(index, item.activityId, item.isJoin, item.title) }}>{item?.isJoin ? "Hủy Tham Gia" : "Tham Gia"}</button>
                                                                        <div className="we-video-info">
                                                                            <ul>
                                                                                <li>
                                                                                    <span title="views" className="views">
                                                                                        <i>
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye">
                                                                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z">
                                                                                                </path>
                                                                                                <circle cx={12} cy={12} r={3} />
                                                                                            </svg></i>
                                                                                        <ins>1.2k</ins>
                                                                                    </span>
                                                                                </li>
                                                                                <li>
                                                                                    <span title="Comments" className="Recommend">
                                                                                        <i>
                                                                                            <svg className="feather feather-message-square" strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none" viewBox="0 0 24 24" height={16} width={16} xmlns="http://www.w3.org/2000/svg">
                                                                                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                                                                            </svg></i>
                                                                                        <ins>54</ins>
                                                                                    </span>
                                                                                </li>
                                                                                <li>
                                                                                    <span title="follow" className="Follow">
                                                                                        <i>
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-star">
                                                                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
                                                                                                </polygon>
                                                                                            </svg></i>
                                                                                        <ins>5k</ins>
                                                                                    </span>
                                                                                </li>
                                                                                <li>
                                                                                    <span className="share-pst" title="Share">
                                                                                        <i>
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-share-2">
                                                                                                <circle cx={18} cy={5} r={3} />
                                                                                                <circle cx={6} cy={12} r={3} />
                                                                                                <circle cx={18} cy={19} r={3} />
                                                                                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                                                                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                                                                            </svg></i>
                                                                                        <ins>205</ins>
                                                                                    </span>
                                                                                </li>
                                                                            </ul>
                                                                            <div className="emoji-state" style={{ display: 'flex', alignContent: 'center', paddingTop: '20px' }}>
                                                                                <div className="popover_wrapper" >
                                                                                    <a className="popover_title" href="#" title><img alt src="images/smiles/thumb.png" /></a>
                                                                                    <div className="popover_content">
                                                                                        <span><img alt src="images/smiles/thumb.png" />
                                                                                            Thích</span>
                                                                                        <ul className="namelist">
                                                                                            <li>Jhon Doe</li>
                                                                                            <li>Amara Sin</li>
                                                                                            <li>Sarah K.</li>
                                                                                            <li><span>20+ more</span></li>
                                                                                        </ul>
                                                                                    </div>

                                                                                </div>

                                                                                <p>{item.numberLike}+</p>
                                                                                <div style={{ marginLeft: '20px' }}>
                                                                                    <div style={{ color: 'blue', fontSize: '15px' }}><span>{item.comment.length} bình luận</span></div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="stat-tools">
                                                                            <div className="" style={{
                                                                                backgroundColor: `${item.commentData[0]?.color}`,
                                                                                borderRadius: '4px',
                                                                                color: '#82828e',
                                                                                display: 'inline-block',
                                                                                fontSize: '13px',
                                                                                padding: '5px 20px',
                                                                                verticalAlign: 'middle',
                                                                                transition: 'all 0.2s linear 0s',
                                                                                cursor: 'pointer'
                                                                            }} onClick={() => {
                                                                                handleLikeClick(item.activityId)
                                                                            }}>
                                                                                <div className="Like "><a className="Like__link"><i className="icofont-like" /> Thích</a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="box">
                                                                                <div className="Emojis">
                                                                                    <div className="Emoji Emoji--like">
                                                                                        <div className="icon icon--like" />
                                                                                    </div>
                                                                                    <div className="Emoji Emoji--love">
                                                                                        <div className="icon icon--heart" />
                                                                                    </div>
                                                                                    <div className="Emoji Emoji--haha">
                                                                                        <div className="icon icon--haha" />
                                                                                    </div>
                                                                                    <div className="Emoji Emoji--wow">
                                                                                        <div className="icon icon--wow" />
                                                                                    </div>
                                                                                    <div className="Emoji Emoji--sad">
                                                                                        <div className="icon icon--sad" />
                                                                                    </div>
                                                                                    <div className="Emoji Emoji--angry">
                                                                                        <div className="icon icon--angry" />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="comment-to bg " onClick={() => handleCommentClick(item.activityId)}><i className="icofont-comment" /> Bình Luận</div>
                                                                            <a title href="#" className="share-to"><i className="icofont-share-alt" /> Chia Sẽ</a>
                                                                            {/* <div className="emoji-state" style={{ display: 'flex', alignContent: 'center' }}>
                                                                    <div className="popover_wrapper" >
                                                                        <a className="popover_title" href="#" title><img alt src="images/smiles/thumb.png" /></a>
                                                                        <div className="popover_content">
                                                                            <span><img alt src="images/smiles/thumb.png" />
                                                                                Likes</span>
                                                                            <ul className="namelist">
                                                                                <li>Jhon Doe</li>
                                                                                <li>Amara Sin</li>
                                                                                <li>Sarah K.</li>
                                                                                <li><span>20+ more</span></li>
                                                                            </ul>
                                                                        </div>

                                                                    </div>

                                                                    <p>{item.numberLike}+</p>
                                                                    <div style={{ marginLeft: '20px' }}>
                                                                        <div style={{ color: 'blue', fontSize: '15px' }}><span>{item.comment.length} bình luận</span></div>
                                                                    </div>
                                                                </div> */}

                                                                        </div>
                                                                        <div className="new-comment" style={{ display: 'block' }}>
                                                                            <form method="post" onSubmit={formik2.handleSubmit} style={{ position: 'relative' }}>
                                                                                <div style={{ paddingBottom: '10px' }}>{onID === item.activityId ?
                                                                                    <div className='commentT' style={{ display: 'flex', alignContent: 'center' }}>
                                                                                        <span style={{ paddingTop: '6px' }}>Trả Lời Bình Luận : </span>
                                                                                        <div style={{ marginLeft: '10px' }} className='textcmt'> @{content}
                                                                                            {setOnID === item.activityId ?
                                                                                                <span style={{ color: 'red', fontSize: '18px', cursor: 'pointer', paddingLeft: '4px' }} onClick={() => {
                                                                                                    setOnID('')
                                                                                                    setTcss('35px')
                                                                                                }}>x</span>
                                                                                                :
                                                                                                <span style={{ color: 'red', fontSize: '18px', cursor: 'pointer', paddingLeft: '4px' }} onClick={() => {
                                                                                                    setOnID('')
                                                                                                    setTcss('10px')
                                                                                                }}>x</span>}
                                                                                        </div>
                                                                                    </div>
                                                                                    :
                                                                                    <div style={{ paddingTop: '6px', paddingBottom: '10px' }}></div>}
                                                                                </div>
                                                                                <input type="text" placeholder="" value={formik2.values.commentContent} name={commentI} onChange={formik2.handleChange} className='input-comment' />
                                                                                {onID === item.activityId ?
                                                                                    <button style={{ position: 'absolute', top: '52px' }} type="submit" onClick={async () => {
                                                                                        console.log(item.activityId);
                                                                                        // await setTextI(item.activityId)
                                                                                        formik2.setFieldValue('activityId', item.activityId)
                                                                                    }}><i className="icofont-paper-plane" /></button>
                                                                                    :
                                                                                    <button style={{ position: 'absolute', top: '40px' }} type="submit" onClick={async () => {
                                                                                        console.log(item.activityId);
                                                                                        // await setTextI(item.activityId)
                                                                                        formik2.setFieldValue('activityId', item.activityId)
                                                                                    }}><i className="icofont-paper-plane" /></button>
                                                                                }

                                                                                {item?.commentData[0]?.isCmt ? <div></div> :
                                                                                    item.comment.map((item, index) => {
                                                                                        return <div className="comments-area">
                                                                                            <ul>
                                                                                                <li>
                                                                                                    <figure><img alt src="images/resources/user1.jpg" />
                                                                                                    </figure>
                                                                                                    <div className="commenter">
                                                                                                        <h5><a title href="#">{item.user?.username}</a>
                                                                                                        </h5>
                                                                                                        <span>{DateTime(item.datetime)}</span>
                                                                                                        <p>
                                                                                                            {item.commentContent}
                                                                                                        </p>
                                                                                                        {/* <span>you can view the more detail via
                                                                                                link</span>
                                                                                            <a title href="#">https://www.youtube.com/watch?v=HpZgwHU1GcI</a> */}
                                                                                                    </div>
                                                                                                    {/* <span title="Like" onClick={() => {
                                                                                            console.log(item);
                                                                                        }}><i className="icofont-heart" /></span> */}
                                                                                                    <a title="Reply" onClick={() => {
                                                                                                        console.log(item);
                                                                                                        formik2.setFieldValue('commentIdReply', item.commentId)
                                                                                                        // setCommentI('commentIdReply')
                                                                                                        setContent(item.user?.username)
                                                                                                        setOnID(item.activityId)

                                                                                                    }} className="reply-coment"><i className="icofont-reply" /></a>
                                                                                                </li>
                                                                                                <li >{item.inverseReply?.map((item, index) => {
                                                                                                    return <div key={index} className='ml-5'>
                                                                                                        <figure><img alt src="images/resources/user1.jpg" />
                                                                                                        </figure>
                                                                                                        <div className="commenter">
                                                                                                            <h5><a title href="#">{item.user?.username}</a>
                                                                                                            </h5>
                                                                                                            <span>{DateTime(item.datetime)}</span>
                                                                                                            <p>
                                                                                                                {item.commentContent}
                                                                                                            </p>
                                                                                                            {/* <span>you can view the more detail via
                                                                                                link</span>
                                                                                            <a title href="#">https://www.youtube.com/watch?v=HpZgwHU1GcI</a> */}
                                                                                                        </div>
                                                                                                        {/* <span title="Like" onClick={() => {
                                                                                            console.log(item);
                                                                                        }}><i className="icofont-heart" /></span> */}
                                                                                                        {/* <a title="Reply" onClick={() => {
                                                                                                console.log(item);
                                                                                                formik2.setFieldValue('commentIdReply', item.commentId)
                                                                                                // setCommentI('commentIdReply')
                                                                                                setContent(item.user?.username)
                                                                                                setOnID(item.activityId)

                                                                                            }} className="reply-coment"><i className="icofont-reply" /></a> */}
                                                                                                    </div>
                                                                                                })}</li>
                                                                                            </ul>
                                                                                        </div>

                                                                                    })
                                                                                }
                                                                            </form>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    })}

                                                    {/* <div className="loadmore">
                                                        <div className="sp sp-bars" />
                                                        <a href="#" title data-ripple>Load More..</a>
                                                    </div>loadmore buttons */}
                                                </div>
                                                <div className="col-lg-4">
                                                    <aside className="sidebar static left">
                                                        {/* <div className="advertisment-box">
                                                            <h4 className><i className="icofont-info-circle" /> advertisment</h4>
                                                            <figure>
                                                                <a href="#" title="Advertisment"><img src="images/resources/ad-widget2.gif" alt /></a>
                                                            </figure>
                                                        </div> */}
                                                        {/* <div className="widget">
                                                            <h4 className="widget-title">Members <a title href="#" className="see-all">See All</a></h4>
                                                            <ul className="invitepage">
                                                                <li>
                                                                    <figure>
                                                                        <img alt src="images/resources/friend-avatar.jpg" />
                                                                        <a href>Jack carter</a>
                                                                    </figure>
                                                                    <button className="sug-like"><i className="invit">Follow</i><i className="icofont-check-alt" /></button>
                                                                </li>
                                                                <li>
                                                                    <figure>
                                                                        <img alt src="images/resources/friend-avatar2.jpg" />
                                                                        <a href>Emma watson</a>
                                                                    </figure>
                                                                    <button className="sug-like"><i className="invit">Follow</i><i className="icofont-check-alt" /></button>
                                                                </li>
                                                                <li>
                                                                    <figure>
                                                                        <img alt src="images/resources/friend-avatar3.jpg" />
                                                                        <a href>Andrew</a>
                                                                    </figure>
                                                                    <button className="sug-like"><i className="invit">Follow</i><i className="icofont-check-alt" /></button>
                                                                </li>
                                                                <li>
                                                                    <figure>
                                                                        <img alt src="images/resources/friend-avatar4.jpg" />
                                                                        <a href>Moona Singh</a>
                                                                    </figure>
                                                                    <button className="sug-like"><i className="invit">Follow</i><i className="icofont-check-alt" /></button>
                                                                </li>
                                                                <li>
                                                                    <figure>
                                                                        <img alt src="images/resources/friend-avatar5.jpg" />
                                                                        <a href>Harry pooter</a>
                                                                    </figure>
                                                                    <button className="sug-like"><i className="invit">Follow</i><i className="icofont-check-alt" /></button>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="widget">
                                                            <h4 className="widget-title">Recent Media</h4>
                                                            <div className="recent-media">
                                                                <figure>
                                                                    <img alt src="images/resources/course-3.jpg" />
                                                                    <a href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title" data-fancybox className="play-btn"><i className="icofont-play" /></a>
                                                                    <span>Angular Js Tutorial</span>
                                                                </figure>
                                                                <figure>
                                                                    <img alt src="images/resources/course-4.jpg" />
                                                                    <a href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title" data-fancybox className="play-btn"><i className="icofont-play" /></a>
                                                                    <span>Css3 2020 Tutorial</span>
                                                                </figure>
                                                            </div>
                                                        </div> */}
                                                        {/* <div className="widget stick-widget">
                                                            <h4 className="widget-title">You May Like Groups</h4>
                                                            <ul className="suggestd">
                                                                <li>
                                                                    <a className="sug-pic" href="#" title><img src="images/resources/sug-page-1.jpg" alt /></a>
                                                                    <a className="sug-title" href="#" title>Physics Shop</a>
                                                                    <button className="sug-like"><i className="icofont-like" /><i className="icofont-check-alt" /></button>
                                                                </li>
                                                                <li>
                                                                    <a className="sug-pic" href="#" title><img src="images/resources/sug-page-2.jpg" alt /></a>
                                                                    <a className="sug-title" href="#" title>Sun Rise</a>
                                                                    <button className="sug-like"><i className="icofont-like" /><i className="icofont-check-alt" /></button>
                                                                </li>
                                                                <li>
                                                                    <a className="sug-pic" href="#" title><img src="images/resources/sug-page-3.jpg" alt /></a>
                                                                    <a className="sug-title" href="#" title>Big Botny</a>
                                                                    <button className="sug-like"><i className="icofont-like" /><i className="icofont-check-alt" /></button>
                                                                </li>
                                                                <li>
                                                                    <a className="sug-pic" href="#" title><img src="images/resources/sug-page-4.jpg" alt /></a>
                                                                    <a className="sug-title" href="#" title>King Work</a>
                                                                    <button className="sug-like"><i className="icofont-like" /><i className="icofont-check-alt" /></button>
                                                                </li>
                                                                <li>
                                                                    <a className="sug-pic" href="#" title><img src="images/resources/sug-page-5.jpg" alt /></a>
                                                                    <a className="sug-title" href="#" title>18teen Guys</a>
                                                                    <button className="sug-like"><i className="icofont-like" /><i className="icofont-check-alt" /></button>
                                                                </li>
                                                            </ul>
                                                        </div> */}
                                                    </aside>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>{/* content */}
            <figure className="bottom-mockup"><img alt src="images/footer.png" /></figure>
            <div className="bottombar">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            {/* <span className>© copyright All rights reserved by socimo 2020</span> */}
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
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg></i> Invite Colleagues</h5>
                        </div>
                        <div className="invitation-meta">
                            <p>
                                Enter an email address to invite a colleague or co-author to join you on socimo. They will receive an email and, in some cases, up to two reminders.
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
                                <svg className="feather feather-message-square" strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none" viewBox="0 0 24 24" height={24} width={24} xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></i> Send Message</h5>
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
            <div className="post-new-popup">
                <div className="popup" style={{ width: 800 }}>
                    <span className="popup-closed"><i className="icofont-close" /></span>
                    <div className="popup-meta">
                        <div className="popup-head">
                            <h5><i>
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus"><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg></i>Create New Post</h5>
                        </div>
                        <div className="post-new">
                            <div className="post-newmeta">
                                <ul className="post-categoroes">
                                    <li><i className="icofont-camera" /> Photo / Video</li>
                                    <li><i className="icofont-google-map" /> Post Location</li>
                                    <li><i className="icofont-file-gif" /> Post Gif</li>
                                    <li><i className="icofont-ui-tag" /> Tag to Friend</li>
                                    <li><i className="icofont-users" /> Share in Group</li>
                                    <li><i className="icofont-link" /> Share Link</li>
                                    <li><i className="icofont-video-cam" /> Go Live</li>
                                    <li><i className="icofont-sale-discount" /> Post Online Course</li>
                                    <li><i className="icofont-read-book" /> Post A Book</li>
                                    <li><i className="icofont-globe" /> Post an Ad</li>
                                </ul>
                                <form method="post" className="dropzone" action="/upload-target">
                                    <div className="fallback">
                                        <input name="file" type="file" multiple />
                                    </div>
                                </form>
                            </div>
                            <form method="post" className="c-form">
                                <textarea id="emojionearea1" placeholder="What's On Your Mind?" defaultValue={""} />
                                <div className="activity-post">
                                    <div className="checkbox">
                                        <input type="checkbox" id="checkbox" defaultChecked />
                                        <label htmlFor="checkbox"><span>Activity Feed</span></label>
                                    </div>
                                    <div className="checkbox">
                                        <input type="checkbox" id="checkbox2" defaultChecked />
                                        <label htmlFor="checkbox2"><span>My Story</span></label>
                                    </div>
                                </div>
                                <div className="select-box">
                                    <div className="select-box__current" tabIndex={1}>
                                        <div className="select-box__value"><input className="select-box__input" type="radio" id={0} defaultValue={1} name="Ben" defaultChecked="checked" />
                                            <p className="select-box__input-text"><i className="icofont-globe-alt" /> Public</p>
                                        </div>
                                        <div className="select-box__value"><input className="select-box__input" type="radio" id={1} defaultValue={2} name="Ben" defaultChecked="checked" />
                                            <p className="select-box__input-text"><i className="icofont-lock" /> Private</p>
                                        </div>
                                        <div className="select-box__value"><input className="select-box__input" type="radio" id={2} defaultValue={3} name="Ben" defaultChecked="checked" />
                                            <p className="select-box__input-text"><i className="icofont-user" /> Specific Friend</p>
                                        </div>
                                        <div className="select-box__value"><input className="select-box__input" type="radio" id={3} defaultValue={4} name="Ben" defaultChecked="checked" />
                                            <p className="select-box__input-text"><i className="icofont-star" /> Only Friends</p>
                                        </div>
                                        <div className="select-box__value"><input className="select-box__input" type="radio" id={4} defaultValue={5} name="Ben" defaultChecked="checked" />
                                            <p className="select-box__input-text"><i className="icofont-users-alt-3" /> Joined Groups</p>
                                        </div>
                                        <img className="select-box__icon" src="images/arrow-down.svg" alt="Arrow Icon" aria-hidden="true" />
                                    </div>
                                    <ul className="select-box__list">
                                        <li><label className="select-box__option" htmlFor={0}><i className="icofont-globe-alt" /> Public</label></li>
                                        <li><label className="select-box__option" htmlFor={1}><i className="icofont-lock" /> Private</label></li>
                                        <li><label className="select-box__option" htmlFor={2}><i className="icofont-user" /> Specific Friend</label></li>
                                        <li><label className="select-box__option" htmlFor={3}><i className="icofont-star" /> Only Friends</label></li>
                                        <li><label className="select-box__option" htmlFor={4}><i className="icofont-users-alt-3" /> Joined Groups</label></li>
                                    </ul>
                                </div>
                                <input className="schedule-btn" type="text" id="datetimepicker" readOnly />
                                <input type="text" placeholder="https://www.youtube.com/watch?v=vgvsuiFlA-Y&t=56s" />
                                <button type="submit" className="main-btn">Publish</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>{/* New post popup */}
            <div className="new-question-popup">
                <div className="popup">
                    <span className="popup-closed"><i className="icofont-close" /></span>
                    <div className="popup-meta">
                        <div className="popup-head">
                            <h5><i>
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-help-circle"><circle cx={12} cy={12} r={10} /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1={12} y1={17} x2="12.01" y2={17} /></svg></i> Ask Question</h5>
                        </div>
                        <div className="post-new">
                            <form method="post" className="c-form">
                                <input type="text" placeholder="Question Title" />
                                <textarea placeholder="Write Question" defaultValue={""} />
                                <select>
                                    <option>Select Your Question Type</option>
                                    <option>Article</option>
                                    <option>Book</option>
                                    <option>Chapter</option>
                                    <option>Code</option>
                                    <option>conference Paper</option>
                                    <option>Cover Page</option>
                                    <option>Data</option>
                                    <option>Exprement Finding</option>
                                    <option>Method</option>
                                    <option>Poster</option>
                                    <option>Preprint</option>
                                    <option>Technicial Report</option>
                                    <option>Thesis</option>
                                    <option>Research</option>
                                </select>
                                <div className="uploadimage">
                                    <i className="icofont-eye-alt-alt" />
                                    <label className="fileContainer">
                                        <input type="file" />Upload File
                                    </label>
                                </div>
                                <button type="submit" className="main-btn">Post</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>{/* ask question */}

            <div className="share-wraper">
                <div className="share-options">
                    <span className="close-btn"><i className="icofont-close-circled" /></span>
                    <h5><i>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-share"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1={12} y1={2} x2={12} y2={15} /></svg></i>Share To!</h5>
                    <form method="post">
                        <textarea placeholder="Write Something" defaultValue={""} />
                    </form>
                    <ul>
                        <li><a title href="#">Your Timeline</a></li>
                        <li className="friends"><a title href="#">To Friends</a></li>
                        <li className="socialz"><a className="active" title href="#">Social Media</a></li>
                    </ul>
                    <div style={{ display: 'block' }} className="social-media">
                        <ul>
                            <li><a title href="#" className="facebook"><i className="icofont-facebook" /></a></li>
                            <li><a title href="#" className="twitter"><i className="icofont-twitter" /></a></li>
                            <li><a title href="#" className="instagram"><i className="icofont-instagram" /></a></li>
                            <li><a title href="#" className="pinterest"><i className="icofont-pinterest" /></a></li>
                            <li><a title href="#" className="youtube"><i className="icofont-youtube" /></a></li>
                            <li><a title href="#" className="dribble"><i className="icofont-dribbble" /></a></li>
                            <li><a title href="#" className="behance"><i className="icofont-behance-original" /></a></li>
                        </ul>
                    </div>
                    <div style={{ display: 'none' }} className="friends-to">
                        <div className="follow-men">
                            <figure><img className="mCS_img_loaded" src="images/resources/user1.jpg" alt /></figure>
                            <div className="follow-meta">
                                <h5><a href="#" title>Jack Carter</a></h5>
                                <span>family member</span>
                            </div>
                            <a href="#" title>Share</a>
                        </div>
                        <div className="follow-men">
                            <figure><img className="mCS_img_loaded" src="images/resources/user2.jpg" alt /></figure>
                            <div className="follow-meta">
                                <h5><a href="#" title>Xang Ching</a></h5>
                                <span>Close Friend</span>
                            </div>
                            <a href="#" title>Share</a>
                        </div>
                        <div className="follow-men">
                            <figure><img className="mCS_img_loaded" src="images/resources/user3.jpg" alt /></figure>
                            <div className="follow-meta">
                                <h5><a href="#" title>Emma Watson</a></h5>
                                <span>Matul Friend</span>
                            </div>
                            <a href="#" title>Share</a>
                        </div>
                    </div>
                    <button type="submit" className="main-btn">Publish</button>
                </div>
            </div>{/* share post */}
            <div className="cart-product">
                <a href="product-cart.html" title="View Cart" data-toggle="tooltip"><i className="icofont-cart-alt" /></a>
                <span>03</span>
            </div>{/* view cart button */}
            <div className="chat-live">
                <a className="chat-btn" href="#" title="Start Live Chat" data-toggle="tooltip"><i className="icofont-facebook-messenger" /></a>
                <span>07</span>
            </div>{/* chat button */}
            <div className="chat-box">
                <div className="chat-head">
                    <h4>New Messages</h4>
                    <span className="clozed"><i className="icofont-close-circled" /></span>
                    <form method="post">
                        <input type="text" placeholder="To.." />
                    </form>
                </div>
                <div className="user-tabs">
                    <ul className="nav nav-tabs">
                        <li className="nav-item"><a className="active" href="#link1" data-toggle="tab">All Friends</a></li>
                        <li className="nav-item"><a className href="#link2" data-toggle="tab">Active</a><em>3</em></li>
                        <li className="nav-item"><a className href="#link3" data-toggle="tab">Groups</a></li>
                    </ul>
                    {/* Tab panes */}
                    <div className="tab-content">
                        <div className="tab-pane active fade show " id="link1">
                            <div className="friend">
                                <a href="#" title>
                                    <figure>
                                        <img src="images/resources/user1.jpg" alt />
                                        <span className="status online" />
                                    </figure>
                                    <span>Oliver</span>
                                    <i className><img src="images/resources/user1.jpg" alt /></i>
                                </a>
                                <a href="#" title>
                                    <figure>
                                        <img src="images/resources/user2.jpg" alt />
                                        <span className="status away" />
                                    </figure>
                                    <span>Amelia</span>
                                    <i className="icofont-check-circled" />
                                </a>
                                <a href="#" title>
                                    <figure>
                                        <img src="images/resources/user3.jpg" alt />
                                        <span className="status offline" />
                                    </figure>
                                    <span>George</span>
                                    <i className><img src="images/resources/user3.jpg" alt /></i>
                                </a>
                                <a href="#" title>
                                    <figure>
                                        <img src="images/resources/user4.jpg" alt />
                                        <span className="status online" />
                                    </figure>
                                    <span>Jacob</span>
                                    <i className="icofont-check-circled" />
                                </a>
                                <a href="#" title>
                                    <figure>
                                        <img src="images/resources/user5.jpg" alt />
                                        <span className="status away" />
                                    </figure>
                                    <span>Poppy</span>
                                    <i className="icofont-check-circled" />
                                </a>
                                <a href="#" title>
                                    <figure>
                                        <img src="images/resources/user6.jpg" alt />
                                        <span className="status online" />
                                    </figure>
                                    <span>Sophia</span>
                                    <i className><img src="images/resources/user6.jpg" alt /></i>
                                </a>
                                <a href="#" title>
                                    <figure>
                                        <img src="images/resources/user7.jpg" alt />
                                        <span className="status away" />
                                    </figure>
                                    <span>Leo king</span>
                                    <i className><img src="images/resources/user7.jpg" alt /></i>
                                </a>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="link2">
                            <div className="friend">
                                <a href="#" title>
                                    <figure>
                                        <img src="images/resources/user1.jpg" alt />
                                        <span className="status online" />
                                    </figure>
                                    <span>Samu Jane</span>
                                    <i className><img src="images/resources/user1.jpg" alt /></i>
                                </a>
                                <a href="#" title>
                                    <figure>
                                        <img src="images/resources/user6.jpg" alt />
                                        <span className="status online" />
                                    </figure>
                                    <span>Tina Mark</span>
                                    <i className><img src="images/resources/user6.jpg" alt /></i>
                                </a>
                                <a href="#" title>
                                    <figure>
                                        <img src="images/resources/user7.jpg" alt />
                                        <span className="status online" />
                                    </figure>
                                    <span>Ak William</span>
                                    <i className><img src="images/resources/user7.jpg" alt /></i>
                                </a>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="link3">
                            <div className="friend">
                                <a href="#" title>
                                    <figure className="group-chat">
                                        <img src="images/resources/user5.jpg" alt />
                                        <img className="two" src="images/resources/user3.jpg" alt />
                                        <span className="status online" />
                                    </figure>
                                    <span>Boys World</span>
                                    <i className="icofont-check-circled" />
                                </a>
                                <a href="#" title>
                                    <figure className="group-chat">
                                        <img src="images/resources/user2.jpg" alt />
                                        <img className="two" src="images/resources/user3.jpg" alt />
                                        <span className="status online" />
                                    </figure>
                                    <span>KK university Fellows</span>
                                    <i className="icofont-check-circled" />
                                </a>
                                <a href="#" title>
                                    <figure className="group-chat">
                                        <img src="images/resources/user3.jpg" alt />
                                        <img className="two" src="images/resources/user2.jpg" alt />
                                        <span className="status away" />
                                    </figure>
                                    <span>Education World</span>
                                    <i className="icofont-check-circled" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="chat-card">
                    <div className="chat-card-head">
                        <img src="images/resources/user13.jpg" alt />
                        <h6>George Floyd</h6>
                        <div className="frnd-opt">
                            <div className="more">
                                <div className="more-post-optns">
                                    <i className>
                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg></i>
                                    <ul>
                                        <li>
                                            <i className="icofont-pen-alt-1" />Edit Post
                                            <span>Edit This Post within a Hour</span>
                                        </li>
                                        <li>
                                            <i className="icofont-ban" />Hide Chat
                                            <span>Hide This Post</span>
                                        </li>
                                        <li>
                                            <i className="icofont-ui-delete" />Delete Chat
                                            <span>If inappropriate Post By Mistake</span>
                                        </li>
                                        <li>
                                            <i className="icofont-flag" />Report
                                            <span>Inappropriate Chat</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <span className="close-mesage"><i className="icofont-close" /></span>
                        </div>
                    </div>
                    <div className="chat-list">
                        <ul>
                            <li className="me">
                                <div className="chat-thumb"><img src="images/resources/chatlist1.jpg" alt /></div>
                                <div className="notification-event">
                                    <div className="chat-message-item">
                                        <figure><img src="images/resources/album5.jpg" alt /></figure>
                                        <div className="caption">4.5kb <i className="icofont-download" title="Download" /></div>
                                    </div>
                                    <span className="notification-date">
                                        <time dateTime="2004-07-24T18:18" className="entry-date updated">Yesterday at 8:10pm</time>
                                        <i><img src="images/d-tick.png" alt /></i>
                                    </span>
                                </div>
                            </li>
                            <li className="me">
                                <div className="chat-thumb"><img src="images/resources/chatlist1.jpg" alt /></div>
                                <div className="notification-event">
                                    <span className="chat-message-item">
                                        Hi James! Please remember to buy the food for tomorrow! I’m gonna be handling the gifts and Jake’s gonna get the drinks
                                    </span>
                                    <span className="notification-date">
                                        <time dateTime="2004-07-24T18:18" className="entry-date updated">Yesterday at 8:10pm</time>
                                        <i><img src="images/d-tick.png" alt /></i>
                                    </span>
                                </div>
                            </li>
                            <li className="you">
                                <div className="chat-thumb"><img src="images/resources/chatlist2.jpg" alt /></div>
                                <div className="notification-event">
                                    <span className="chat-message-item">
                                        Hi James! Please remember to buy the food for tomorrow! I’m gonna be handling the gifts and Jake’s gonna get the drinks
                                    </span>
                                    <span className="notification-date">
                                        <time dateTime="2004-07-24T18:18" className="entry-date updated">Yesterday at 8:10pm</time>
                                        <i><img src="images/d-tick.png" alt /></i>
                                    </span>
                                </div>
                            </li>
                            <li className="me">
                                <div className="chat-thumb"><img src="images/resources/chatlist1.jpg" alt /></div>
                                <div className="notification-event">
                                    <span className="chat-message-item">
                                        Hi James! Please remember to buy the food for tomorrow! I’m gonna be handling the gifts and Jake’s gonna get the drinks
                                    </span>
                                    <span className="notification-date">
                                        <time dateTime="2004-07-24T18:18" className="entry-date updated">Yesterday at 8:10pm</time>
                                        <i><img src="images/d-tick.png" alt /></i>
                                    </span>
                                </div>
                            </li>
                        </ul>
                        <form className="text-box">
                            <textarea placeholder="Write Mesage..." defaultValue={""} />
                            <div className="add-smiles">
                                <span><img src="images/smiles/happy-3.png" alt /></span>
                            </div>
                            <div className="smiles-bunch">
                                <i><img src="images/smiles/thumb.png" alt /></i>
                                <i><img src="images/smiles/angry-1.png" alt /></i>
                                <i><img src="images/smiles/angry.png" alt /></i>
                                <i><img src="images/smiles/bored-1.png" alt /></i>
                                <i><img src="images/smiles/confused-1.png" alt /></i>
                                <i><img src="images/smiles/wink.png" alt /></i>
                                <i><img src="images/smiles/weep.png" alt /></i>
                                <i><img src="images/smiles/tongue-out.png" alt /></i>
                                <i><img src="images/smiles/suspicious.png" alt /></i>
                                <i><img src="images/smiles/crying-1.png" alt /></i>
                                <i><img src="images/smiles/crying.png" alt /></i>
                                <i><img src="images/smiles/embarrassed.png" alt /></i>
                                <i><img src="images/smiles/emoticons.png" alt /></i>
                                <i><img src="images/smiles/happy-2.png" alt /></i>
                            </div>
                            <button type="submit"><i className="icofont-paper-plane" /></button>
                        </form>
                    </div>
                </div>
            </div>{/* chat box */}
            <div className="createroom-popup">
                <div className="popup">
                    <span className="popup-closed"><i className="icofont-close" /></span>
                    <div className="popup-meta">
                        <div className="popup-head text-center">
                            <h5 className="only-icon"><i className="icofont-video-cam" /></h5>
                        </div>
                        <div className="room-meta">
                            <h4>Create Your Room</h4>
                            <ul>
                                <li>
                                    <i className="icofont-hand" />
                                    <div>
                                        <h6>Room Activity</h6>
                                        <span>Jack's Room</span>
                                    </div>
                                    <div className="checkbox">
                                        <input type="checkbox" id="checkbox3" />
                                        <label htmlFor="checkbox3" />
                                    </div>
                                </li>
                                <li>
                                    <i className="icofont-clock-time" />
                                    <div>
                                        <h6>Start Time</h6>
                                        <span>Now</span>
                                    </div>
                                    <div className="checkbox">
                                        <input type="checkbox" id="checkbox4" />
                                        <label htmlFor="checkbox4" />
                                    </div>
                                </li>
                                <li>
                                    <i className="icofont-users-alt-4" />
                                    <div>
                                        <h6>Invite to All Friends</h6>
                                        <span>Allow All friends to see this room</span>
                                    </div>
                                    <div className="checkbox">
                                        <input type="checkbox" id="checkbox5" />
                                        <label htmlFor="checkbox5" />
                                    </div>
                                </li>
                            </ul>
                            <span>Your room isn't visible until you invite people after you've created it.</span>
                            <a href="#" title className="main-btn full-width">Create Room</a>
                        </div>
                    </div>
                </div>
            </div>{/* create new room */}
            <div className="modal fade" id="img-comt">
                <div className="modal-dialog">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">×</button>
                        </div>
                        {/* Modal body */}
                        <div className="modal-body">
                            <div className="row merged">
                                <div className="col-lg-9">
                                    <div className="pop-image">
                                        <div className="pop-item">
                                            <div className="action-block">
                                                <a className="action-button">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-tag"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1={7} y1={7} x2="7.01" y2={7} /></svg>
                                                </a>
                                                <a className="action-button">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx={12} cy={10} r={3} /></svg>
                                                </a>
                                                <a className="action-button">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-down"><line x1={12} y1={5} x2={12} y2={19} /><polyline points="19 12 12 19 5 12" /></svg>
                                                </a>
                                                <a className="action-button">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx={12} cy={12} r={1} /><circle cx={12} cy={5} r={1} /><circle cx={12} cy={19} r={1} /></svg>
                                                </a>
                                            </div>
                                            <figure><img src="images/resources/blog-detail.jpg" alt /></figure>
                                            <div className="stat-tools">
                                                <div className="box">
                                                    <div className="Like"><a className="Like__link"><i className="icofont-like" /> Like</a>
                                                        <div className="Emojis">
                                                            <div className="Emoji Emoji--like">
                                                                <div className="icon icon--like" />
                                                            </div>
                                                            <div className="Emoji Emoji--love">
                                                                <div className="icon icon--heart" />
                                                            </div>
                                                            <div className="Emoji Emoji--haha">
                                                                <div className="icon icon--haha" />
                                                            </div>
                                                            <div className="Emoji Emoji--wow">
                                                                <div className="icon icon--wow" />
                                                            </div>
                                                            <div className="Emoji Emoji--sad">
                                                                <div className="icon icon--sad" />
                                                            </div>
                                                            <div className="Emoji Emoji--angry">
                                                                <div className="icon icon--angry" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="box">
                                                    <div className="Emojis">
                                                        <div className="Emoji Emoji--like">
                                                            <div className="icon icon--like" />
                                                        </div>
                                                        <div className="Emoji Emoji--love">
                                                            <div className="icon icon--heart" />
                                                        </div>
                                                        <div className="Emoji Emoji--haha">
                                                            <div className="icon icon--haha" />
                                                        </div>
                                                        <div className="Emoji Emoji--wow">
                                                            <div className="icon icon--wow" />
                                                        </div>
                                                        <div className="Emoji Emoji--sad">
                                                            <div className="icon icon--sad" />
                                                        </div>
                                                        <div className="Emoji Emoji--angry">
                                                            <div className="icon icon--angry" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <a title href="#" className="share-to"><i className="icofont-share-alt" /> Share</a>
                                                <div className="emoji-state">
                                                    <div className="popover_wrapper">
                                                        <a className="popover_title" href="#" title><img alt src="images/smiles/thumb.png" /></a>
                                                        <div className="popover_content">
                                                            <span><img alt src="images/smiles/thumb.png" /> Likes</span>
                                                            <ul className="namelist">
                                                                <li>Jhon Doe</li>
                                                                <li>Amara Sin</li>
                                                                <li>Sarah K.</li>
                                                                <li><span>20+ more</span></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="popover_wrapper">
                                                        <a className="popover_title" href="#" title><img alt src="images/smiles/heart.png" /></a>
                                                        <div className="popover_content">
                                                            <span><img alt src="images/smiles/heart.png" /> Love</span>
                                                            <ul className="namelist">
                                                                <li>Amara Sin</li>
                                                                <li>Jhon Doe</li>
                                                                <li><span>10+ more</span></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="popover_wrapper">
                                                        <a className="popover_title" href="#" title><img alt src="images/smiles/smile.png" /></a>
                                                        <div className="popover_content">
                                                            <span><img alt src="images/smiles/smile.png" /> Happy</span>
                                                            <ul className="namelist">
                                                                <li>Sarah K.</li>
                                                                <li>Jhon Doe</li>
                                                                <li>Amara Sin</li>
                                                                <li><span>100+ more</span></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="popover_wrapper">
                                                        <a className="popover_title" href="#" title><img alt src="images/smiles/weep.png" /></a>
                                                        <div className="popover_content">
                                                            <span><img alt src="images/smiles/weep.png" /> Dislike</span>
                                                            <ul className="namelist">
                                                                <li>Danial Carbal</li>
                                                                <li>Amara Sin</li>
                                                                <li>Sarah K.</li>
                                                                <li><span>15+ more</span></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <p>10+</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="commentbar">
                                        <div className="user">
                                            <figure><img src="images/resources/user1.jpg" alt /></figure>
                                            <div className="user-information">
                                                <h4><a href="#" title>Danile Walker</a></h4>
                                                <span>2 hours ago</span>
                                            </div>
                                            <a href="#" title="Follow" data-ripple>Follow</a>
                                        </div>
                                        <div className="we-video-info">
                                            <ul>
                                                <li>
                                                    <span title="Comments" className="liked">
                                                        <i>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg></i>
                                                        <ins>52</ins>
                                                    </span>
                                                </li>
                                                <li>
                                                    <span title="Comments" className="comment">
                                                        <i>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></i>
                                                        <ins>52</ins>
                                                    </span>
                                                </li>
                                                <li>
                                                    <span>
                                                        <a title="Share" href="#" className>
                                                            <i>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-share-2"><circle cx={18} cy={5} r={3} /><circle cx={6} cy={12} r={3} /><circle cx={18} cy={19} r={3} /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg></i>
                                                        </a>
                                                        <ins>20</ins>
                                                    </span>
                                                </li>
                                            </ul>
                                            <div className="users-thumb-list">
                                                <a href="#" title data-toggle="tooltip" data-original-title="Anderw">
                                                    <img src="images/resources/userlist-1.jpg" alt />
                                                </a>
                                                <a href="#" title data-toggle="tooltip" data-original-title="frank">
                                                    <img src="images/resources/userlist-2.jpg" alt />
                                                </a>
                                                <a href="#" title data-toggle="tooltip" data-original-title="Sara">
                                                    <img src="images/resources/userlist-1.jpg" alt />
                                                </a>
                                                <a href="#" title data-toggle="tooltip" data-original-title="Amy">
                                                    <img src="images/resources/userlist-2.jpg" alt />
                                                </a>
                                                <span><strong>You</strong>, <b>Sarah</b> and <a title href="#">24+ more</a> liked</span>
                                            </div>
                                        </div>
                                        <div className="new-comment" style={{ display: 'block' }}>
                                            <form method="post">
                                                <input type="text" placeholder="write comment" />
                                                <button type="submit"><i className="icofont-paper-plane" /></button>
                                            </form>
                                            <div className="comments-area">
                                                <ul>
                                                    <li>
                                                        <figure><img alt src="images/resources/user1.jpg" /></figure>
                                                        <div className="commenter">
                                                            <h5><a title href="#">Jack Carter</a></h5>
                                                            <span>2 hours ago</span>
                                                            <p>
                                                                i think that some how, we learn who we really are and then live with that decision, great post!
                                                            </p>
                                                            <span>you can view the more detail via link</span>
                                                            <a title href="#">https://www.youtube.com/watch?v=HpZgwHU1GcI</a>
                                                        </div>
                                                        <a title="Like" href="#"><i className="icofont-heart" /></a>
                                                        <a title="Reply" href="#" className="reply-coment"><i className="icofont-reply" /></a>
                                                    </li>
                                                    <li>
                                                        <figure><img alt src="images/resources/user2.jpg" /></figure>
                                                        <div className="commenter">
                                                            <h5><a title href="#">Ching xang</a></h5>
                                                            <span>2 hours ago</span>
                                                            <p>
                                                                i think that some how, we learn who we really are and then live with that decision, great post!
                                                            </p>
                                                        </div>
                                                        <a title="Like" href="#"><i className="icofont-heart" /></a>
                                                        <a title="Reply" href="#" className="reply-coment"><i className="icofont-reply" /></a>
                                                    </li>
                                                    <li>
                                                        <figure><img alt src="images/resources/user3.jpg" /></figure>
                                                        <div className="commenter">
                                                            <h5><a title href="#">Danial Comb</a></h5>
                                                            <span>2 hours ago</span>
                                                            <p>
                                                                i think that some how, we learn who we really are and then live with that decision, great post!
                                                            </p>
                                                        </div>
                                                        <a title="Like" href="#"><i className="icofont-heart" /></a>
                                                        <a title="Reply" href="#" className="reply-coment"><i className="icofont-reply" /></a>
                                                    </li>
                                                    <li>
                                                        <figure><img alt src="images/resources/user4.jpg" /></figure>
                                                        <div className="commenter">
                                                            <h5><a title href="#">Jack Carter</a></h5>
                                                            <span>2 hours ago</span>
                                                            <p>
                                                                i think that some how, we learn who we really are and then live with that decision, great post!
                                                            </p>
                                                        </div>
                                                        <a title="Like" href="#"><i className="icofont-heart" /></a>
                                                        <a title="Reply" href="#" className="reply-coment"><i className="icofont-reply" /></a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <DetailActivity item={detail} dateTime={DateTime} />
            </div>{/* The Scrolling Modal image with comment */}
        </Fragment>
    )
}

