import React, { Fragment, useState } from 'react'
import { useEffect } from 'react'
import { DeleteLikeAction, GetActivityByIDAction, GetListEndActivityAction, PostLikeAction, ResultActivityAction } from '../../redux/actions/ActivityAction';
import { useDispatch, useSelector } from 'react-redux';
import { GetUserByIdAction } from '../../redux/actions/UserAction';
import moment from 'moment';
import { NavLink } from 'react-router-dom/cjs/react-router-dom';
import { CommentAction, CommentRepllyAction } from '../../redux/actions/CommentAction';
import { useFormik } from 'formik';
import Loading from '../../component/Loading';

export default function EndActivity () {
    const [detail, setDetail] = useState({});
    const [content, setContent] = useState("");
    const [tcss, setTcss] = useState('css');
    const [onID, setOnID] = useState("");
    const [cmt, setCmt] = useState([]);
    const [commentI, setCommentI] = useState("commentContent");
    const { userByID } = useSelector(root => root.UserReducer)
    const { activityId } = useSelector(root => root.ActivityReducer)
    console.log(activityId);
    const { arrActivity } = useSelector(root => root.EndActivityReducer)
    const { userID } = useSelector((root) => root.LoginReducer);
    const dispatch = useDispatch()
    useEffect(() => {
        const action5 = GetListEndActivityAction();
        dispatch(action5)
        const user = localStorage.getItem('userID')
        if (user) {
            // console.log('có user');
            const action = GetUserByIdAction(localStorage.getItem('userID'));
            dispatch(action)
        }
    }, []);


    const formik8 = useFormik({
        initialValues: {
            title: "",
            desciption: "",
            activityId: ""
        },
        onSubmit: (value) => {
            console.log(value);
            const action = ResultActivityAction(value);
            dispatch(action)
        }
    })
    console.log(arrActivity);
    const initialCommentData = JSON.parse(localStorage.getItem("activity"))?.map(
        (comment) => ({
            id: comment.activityId,
            isCmt: true,
            color: "#eae9ee",
        })
    );
    const [isOpen, setIsOpen] = useState(false);
    const popupStyle = {
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? "visible" : "hidden",
        overflow: isOpen ? "auto" : "hidden",

    };
    const handleClick = () => {
        setIsOpen((prevIsOpen) => !prevIsOpen);

    };
    const [isOpen1, setIsOpen1] = useState(false);
    const popupStyle1 = {
        opacity: isOpen1 ? 1 : 0,
        visibility: isOpen1 ? "visible" : "hidden",
        overflow: isOpen1 ? "auto" : "hidden",

    };
    const handleClick1 = () => {
        setIsOpen1((prevIsOpen) => !prevIsOpen);

    };
    const [commentData, setCommentData] = useState(initialCommentData);
    console.log(commentData);
    useEffect(() => {
        const updatedArrActivity = arrActivity.map((activity) => {
            const matchingComments = commentData?.filter((comment) => comment.id === activity.activityId);
            return { ...activity, commentData: matchingComments };
        });
        setCmt(updatedArrActivity)
    }, [commentData, arrActivity]);
    console.log(commentData);
    const handleCommentClick = (id) => {
        const updatedComments = commentData?.map(
            (comment) => {
                if (comment.id === id) {
                    return { ...comment, isCmt: !comment.isCmt };
                }
                return comment;
            },
            () => {
            }
        );

        setCommentData(updatedComments);
    };

    const DateTime = (item) => {
        const currentTime = moment();
        const inputTime = moment(item);
        const duration = moment.duration(currentTime.diff(inputTime));
        const hoursAgo = duration.asHours();
        let timeAgoString = "";
        if (hoursAgo < 1) {
            const daysAgo = Math.floor(duration.asMinutes());
            timeAgoString = `${daysAgo} phút trước`;
        } else if (hoursAgo >= 24) {
            const daysAgo = Math.floor(duration.asDays());
            timeAgoString = `${daysAgo} ngày trước`;
        } else {
            const hoursAgo = Math.floor(duration.asHours());
            timeAgoString = `${hoursAgo} giờ trước`;
        }
        return timeAgoString;
    };
    function calculateImageClass (imageCount) {
        let imageClass = "full-width";
        if (imageCount === 2) {
            imageClass = "half-width";
        } else if (imageCount === 3 || imageCount === 4) {
            imageClass = "quarter-width";
        }
        return imageClass;
    }
    const handleLikeClick = (id) => {
        const updatedComments = commentData.map((comment) => {
            if (comment.id === id) {
                if (comment.color === "rgb(117, 189, 240)") {
                    return { ...comment, color: "#eae9ee" };
                } else {
                    return { ...comment, color: "rgb(117, 189, 240)" };
                }
            }
            return comment;
        });
        let alreadyLiked = false;

        JSON.parse(localStorage.getItem("activity"))?.map((comment) => {
            if (comment.activityId === id && comment.like.length > 0) {
                comment.like.map((item) => {
                    if (item.userId === userID) {
                        alreadyLiked = true;
                    }
                });
            }
        });

        let action = null;

        if (alreadyLiked) {
            action = DeleteLikeAction({
                userId: userID,
                activityId: id,
            });
        } else {
            action = PostLikeAction({
                userId: userID,
                activityId: id,
            });
        }
        dispatch(action);

        setCommentData(updatedComments);
    };

    const formik2 = useFormik({
        enableReinitialize: true,
        initialValues: {
            userId: userID,
            activityId: "",
            commentContent: "",
            status: true,
            commentIdReply: "",
        },
        onSubmit: (value) => {
            if (value.commentIdReply === "") {
                const action = CommentAction(value);
                dispatch(action);
                formik2.setFieldValue("commentContent", "");
            } else {
                const action = CommentRepllyAction(value);
                dispatch(action);
                // formik2.setFieldValue('commentIdReply', '');
                // setCommentI('commentContent')
                // setContent(true)
                formik2.setFieldValue("commentContent", "");
                formik2.setFieldValue("commentIdReply", "");
            }
        },
    });
    const [isLoading, setIsLoading] = useState(false);
    const { isLoadingM } = useSelector((root) => root.LoadingReducer);
    return (

        <Fragment style={{ width: '100%' }}>
            {isLoadingM ? <Loading /> : <Fragment></Fragment>}
            <div className='gap' style={{}}>

                <div className='container'>
                    <div style={{ display: 'flex' }}>
                        <h3 style={{ paddingRight: '10px' }}><NavLink to="/home" style={{ TextDecoder: 'underline' }}>Trang chủ / </NavLink></h3>
                        <h3><a href='#'> Danh sách các chiến dịch đã kết thúc</a></h3>
                    </div>
                    <div style={{ width: '60%', margin: '0 auto' }}>
                        {cmt.map((item, index) => {
                            const detailItem = item;
                            let isAlreadyLiked = false;
                            // console.log(item);
                            item?.like?.map((user) => {
                                if (user.userId === userByID.userId) {
                                    console.log(user.userId === userByID.userId);
                                    //item?.like?
                                    isAlreadyLiked = true;
                                }
                            })
                            // console.log(isAlreadyLiked);
                            return (
                                <div className="main-wraper">
                                    <div className="user-post">
                                        <div className="friend-info">
                                            <figure>
                                                <em>
                                                    <svg
                                                        style={{ verticalAlign: "middle" }}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={15}
                                                        height={15}
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            fill="#7fba00"
                                                            stroke="#7fba00"
                                                            d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"
                                                        ></path>
                                                    </svg>
                                                </em>
                                                <img
                                                    style={{ height: "3rem", width: "3.5rem" }}
                                                    alt
                                                    src="images/avatar/uocAvatar.jpg"
                                                />
                                            </figure>
                                            <div className="friend-name">
                                                <div className="more">
                                                    <div className="more-post-optns">
                                                        <i className>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width={24}
                                                                height={24}
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="feather feather-more-horizontal"
                                                            >
                                                                <circle cx={12} cy={12} r={1} />
                                                                <circle cx={19} cy={12} r={1} />
                                                                <circle cx={5} cy={12} r={1} />
                                                            </svg>
                                                        </i>
                                                        <ul>
                                                            <li onClick={() => {
                                                                handleClick1()
                                                                const action = GetActivityByIDAction(item.activityId);
                                                                dispatch(action)
                                                            }}>
                                                                <i className="icofont-ban" />
                                                                Xem kết quả
                                                                <span>
                                                                    Xem chi tiết kết quả hoạt động
                                                                </span>
                                                            </li>
                                                            {userID === item.userId ? <li onClick={() => {
                                                                handleClick()
                                                                formik8.setFieldValue('activityId', item.activityId)
                                                            }}>
                                                                <i className="icofont-pen-alt-1" />
                                                                Cập nhật kết quả hoạt động
                                                                <span>
                                                                    Cập nhật chi tiết kết quả hoạt động
                                                                </span>
                                                            </li> : <div></div>}

                                                        </ul>
                                                    </div>
                                                </div>
                                                <ins>
                                                    <div title style={{ color: '#3f6ad8' }}>
                                                        {item.user?.username}
                                                    </div>
                                                </ins>
                                                <span>
                                                    {" "}
                                                    {DateTime(item.createAt)}{" "}
                                                    <i className="icofont-globe" />
                                                </span>
                                            </div>
                                            <div className="post-meta">
                                                {/* <em><a href="https://themeforest.net/item/winku-social-network-toolkit-responsive-template/22363538" title target="_blank">https://themeforest.net/item/winku-social-network-toolkit-responsive-template/22363538</a></em> */}

                                                {/* <a href="https://themeforest.net/item/winku-social-network-toolkit-responsive-template/22363538" className="post-title" target="_blank">{item.title}</a> */}
                                                {/* <p>
                                                                {item.description}
                                                            </p> */}

                                                {/* hình ảnh */}
                                                {item.process.length !== 0 ? (
                                                    <NavLink
                                                        to={`/detailprocess/${item.activityId}`}
                                                        style={{
                                                            fontSize: "20px",
                                                            fontWeight: "bold",
                                                            color: "#3f6ad8",
                                                            marginBottom: "20px",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => {
                                                            // handleClick2()
                                                            // const action = GetProcessByActivityAction(item.activityId);
                                                            // dispatch(action)
                                                        }}
                                                    >
                                                        Xem tiến trình
                                                    </NavLink>
                                                ) : (
                                                    <div></div>
                                                )}
                                                <figure style={{}}>
                                                    {/* <p style={{ width: '100%' }}>fetched-image</p> */}

                                                    <div className="image-gallery">
                                                        <div className="image-gallery">
                                                            {item.media?.map((image, index) => {
                                                                const imageClass = calculateImageClass(
                                                                    item.media.length
                                                                );
                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className={`image-container ${imageClass} `}
                                                                    >
                                                                        <a
                                                                            data-toggle="modal"
                                                                            data-target="#img-comt"
                                                                            href="images/resources/album1.jpg"
                                                                            onClick={() => {
                                                                                setDetail(detailItem);
                                                                            }}
                                                                        >
                                                                            <img
                                                                                src={image.linkMedia}
                                                                                alt={`Image ${image.id}`}
                                                                                className="gallery-image"
                                                                            />
                                                                        </a>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </figure>
                                                <div className="row">
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignContent: "center",
                                                        }}
                                                        className="col-lg-12"
                                                    >
                                                        <a
                                                            href=""
                                                            target="_blank"
                                                            style={{
                                                                fontSize: "25px",
                                                                fontWeight: "bold",
                                                                width: "450px",
                                                                wordWrap: "break-word",
                                                                color: "#3f6ad8",
                                                            }}
                                                            className="col-lg-8"
                                                        >
                                                            {item.title}
                                                        </a>
                                                        {/* bla bla bla theo dõi */}

                                                    </div>
                                                </div>
                                                <p className="mt-3">
                                                    <span
                                                        style={{
                                                            color: "black",
                                                            fontWeight: "bold",
                                                            fontSize: "15px",
                                                        }}
                                                    >

                                                    </span>{" "}
                                                    {item.description}
                                                </p>

                                                {item.targetDonation !== 0 ? (
                                                    <div className="mb-4">
                                                        <div>
                                                            {" "}
                                                            <span
                                                                style={{
                                                                    fontWeight: "bold",
                                                                    fontSize: "15px",
                                                                }}
                                                            >
                                                                {" "}
                                                                - Mục tiêu :{" "}
                                                            </span>{" "}
                                                            <span
                                                                style={{
                                                                    color: "blue",
                                                                    fontSize: "15px",
                                                                }}
                                                            >
                                                                {item.targetDonation.toLocaleString()}{" "}
                                                                vnđ
                                                            </span>{" "}
                                                        </div>
                                                        <div className="mb-3">
                                                            {" "}
                                                            <span
                                                                style={{
                                                                    fontWeight: "bold",
                                                                    fontSize: "15px",
                                                                }}
                                                            >
                                                                - Tổng Tiền Đã Nhận :{" "}
                                                            </span>{" "}
                                                            <span
                                                                style={{
                                                                    color: "blue",
                                                                    fontSize: "15px",
                                                                }}
                                                            >
                                                                {item.realDonation.toLocaleString()} vnđ
                                                            </span>{" "}
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max={item.targetDonation}
                                                            value={item.realDonation}
                                                            // onChange={handleChange}
                                                            className="range-slider"
                                                            style={{
                                                                background: `linear-gradient(to right,  #4287f5 0%, #4287f5  ${(item.realDonation /
                                                                    item.targetDonation) *
                                                                    100
                                                                    }%, #ddd ${(item.realDonation /
                                                                        item.targetDonation) *
                                                                    100
                                                                    }%, #ddd 100%)`,
                                                            }}
                                                        />
                                                        {/* <div className="range-value" style={{ position: 'absolute', left: `${((item.realDonation - 5) * 100) / (100 - 0)}%` }}>{item.realDonation}%</div> */}
                                                        {item.realDonation !== 0 ? (
                                                            <div></div>
                                                        ) : (
                                                            <div
                                                                className="range-value"
                                                                style={{ position: "absolute" }}
                                                            >
                                                                0
                                                            </div>
                                                        )}
                                                        {/* <div className="range-value" style={{ position: 'absolute' }}>0</div> */}
                                                        {/* {item.realDonation !== 0 ? <div className="range-value" style={{ position: 'absolute', left: `${((item.realDonation - 5) * 100) / (100 - 0)}%` }}>{((item.realDonation / item.targetDonation) * 100).toString().split('.')[0]}%</div> : <div className="range-value" style={{ position: 'absolute', left: `${((item.realDonation - 0) * 100) / (100 - 0)}%` }}>{((item.realDonation / item.targetDonation) * 100).toString().split('.')[0]}%</div>} */}
                                                        {item.realDonation === 0 ? (
                                                            <div></div>
                                                        ) : (
                                                            <div
                                                                className="range-value"
                                                                style={{
                                                                    position: "absolute",
                                                                    left: `${(item.realDonation /
                                                                        item.targetDonation) *
                                                                        100
                                                                        }%`,
                                                                }}
                                                            >
                                                                {" "}
                                                                {(item.realDonation /
                                                                    item.targetDonation) *
                                                                    100}
                                                                %
                                                            </div>
                                                        )}
                                                        <div
                                                            className="range-value"
                                                            style={{
                                                                position: "absolute",
                                                                right: "10px",
                                                            }}
                                                        >
                                                            100%
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div></div>
                                                )}



                                                <div className="we-video-info">
                                                    {/* <ul>
                                    <li>
                                      <span title="views" className="views">
                                        <i>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={16}
                                            height={16}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="feather feather-eye"
                                          >
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx={12} cy={12} r={3} />
                                          </svg>
                                        </i>
                                        <ins>1.2k</ins>
                                      </span>
                                    </li>
                                    <li>
                                      <span
                                        title="Comments"
                                        className="Recommend"
                                      >
                                        <i>
                                          <svg
                                            className="feather feather-message-square"
                                            strokeLinejoin="round"
                                            strokeLinecap="round"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            height={16}
                                            width={16}
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                          </svg>
                                        </i>
                                        <ins>54</ins>
                                      </span>
                                    </li>
                                    <li>
                                      <span title="follow" className="Follow">
                                        <i>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={16}
                                            height={16}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="feather feather-star"
                                          >
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                          </svg>
                                        </i>
                                        <ins>5k</ins>
                                      </span>
                                    </li>
                                    <li>
                                      <span className="share-pst" title="Share">
                                        <i>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={16}
                                            height={16}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="feather feather-share-2"
                                          >
                                            <circle cx={18} cy={5} r={3} />
                                            <circle cx={6} cy={12} r={3} />
                                            <circle cx={18} cy={19} r={3} />
                                            <line
                                              x1="8.59"
                                              y1="13.51"
                                              x2="15.42"
                                              y2="17.49"
                                            />
                                            <line
                                              x1="15.41"
                                              y1="6.51"
                                              x2="8.59"
                                              y2="10.49"
                                            />
                                          </svg>
                                        </i>
                                        <ins>205</ins>
                                      </span>
                                    </li>
                                  </ul> */}
                                                    <div
                                                        className="emoji-state"
                                                        style={{
                                                            display: "flex",
                                                            alignContent: "center",
                                                            paddingTop: "20px",
                                                        }}
                                                    >
                                                        <div className="popover_wrapper">
                                                            <a
                                                                className="popover_title"
                                                                href="#"
                                                                title
                                                            >
                                                                <img
                                                                    alt
                                                                    src="images/smiles/thumb.png"
                                                                />
                                                            </a>
                                                            <div className="popover_content">
                                                                <span>
                                                                    <img
                                                                        alt
                                                                        src="images/smiles/thumb.png"
                                                                    />
                                                                    Thích
                                                                </span>
                                                                {/* <ul className="namelist">
                                          <li>Jhon Doe</li>
                                          <li>Amara Sin</li>
                                          <li>Sarah K.</li>
                                          <li>
                                            <span>20+ more</span>
                                          </li>
                                        </ul> */}
                                                            </div>
                                                        </div>

                                                        <p>{item.like.length || 0}</p>
                                                        <div style={{ marginLeft: "20px" }}>
                                                            <div
                                                                style={{
                                                                    color: "blue",
                                                                    fontSize: "15px",
                                                                }}
                                                            >
                                                                <span>
                                                                    {item.comment.length} bình luận
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="stat-tools">
                                                    <div
                                                        className=""
                                                        style={{
                                                            backgroundColor: `${isAlreadyLiked ? 'rgb(117, 189, 240)' : '#eae9ee'}`,
                                                            borderRadius: "4px",
                                                            color: "#82828e",
                                                            display: "inline-block",
                                                            fontSize: "13px",
                                                            padding: "5px 20px",
                                                            verticalAlign: "middle",
                                                            transition: "all 0.2s linear 0s",
                                                            cursor: "pointer",
                                                        }}
                                                        //TODO
                                                        onClick={() => {
                                                            handleLikeClick(item.activityId);
                                                        }}
                                                    >
                                                        <div className="Like ">
                                                            <a className="Like__link">
                                                                <i className="icofont-like" /> Thích
                                                            </a>
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
                                                    <div
                                                        className="comment-to bg "
                                                        onClick={() =>
                                                            handleCommentClick(item.activityId)
                                                        }
                                                    >
                                                        <i className="icofont-comment" /> Bình luận
                                                    </div>
                                                    <a title href="#" className="share-to">
                                                        <i className="icofont-share-alt" /> Chia sẽ
                                                    </a>
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
                                                <div
                                                    className="new-comment"
                                                    style={{ display: "block" }}
                                                >
                                                    <form
                                                        method="post"
                                                        onSubmit={formik2.handleSubmit}
                                                        style={{ position: "relative" }}
                                                    >
                                                        <div style={{ paddingBottom: "10px" }}>
                                                            {onID === item.activityId ? (
                                                                <div
                                                                    className="commentT"
                                                                    style={{
                                                                        display: "flex",
                                                                        alignContent: "center",
                                                                    }}
                                                                >
                                                                    <span style={{ paddingTop: "6px" }}>
                                                                        Trả lời bình luận :{" "}
                                                                    </span>
                                                                    <div
                                                                        style={{ marginLeft: "10px" }}
                                                                        className="textcmt"
                                                                    >
                                                                        {" "}
                                                                        @{content}
                                                                        {setOnID === item.activityId ? (
                                                                            <span
                                                                                style={{
                                                                                    color: "red",
                                                                                    fontSize: "18px",
                                                                                    cursor: "pointer",
                                                                                    paddingLeft: "4px",
                                                                                }}
                                                                                onClick={() => {
                                                                                    setOnID("");
                                                                                    setTcss("35px");
                                                                                }}
                                                                            >
                                                                                x
                                                                            </span>
                                                                        ) : (
                                                                            <span
                                                                                style={{
                                                                                    color: "red",
                                                                                    fontSize: "18px",
                                                                                    cursor: "pointer",
                                                                                    paddingLeft: "4px",
                                                                                }}
                                                                                onClick={() => {
                                                                                    setOnID("");
                                                                                    setTcss("10px");
                                                                                }}
                                                                            >
                                                                                x
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    style={{
                                                                        paddingTop: "6px",
                                                                        paddingBottom: "10px",
                                                                    }}
                                                                ></div>
                                                            )}
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder=""
                                                            value={formik2.values.commentContent}
                                                            name={commentI}
                                                            onChange={formik2.handleChange}
                                                            className="input-comment"
                                                        />
                                                        {onID === item.activityId ? (
                                                            <button
                                                                style={{
                                                                    position: "absolute",
                                                                    top: "52px",
                                                                }}
                                                                type="submit"
                                                                onClick={async () => {
                                                                    // await setTextI(item.activityId)
                                                                    formik2.setFieldValue(
                                                                        "activityId",
                                                                        item.activityId
                                                                    );
                                                                }}
                                                            >
                                                                <i className="icofont-paper-plane" />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                style={{
                                                                    position: "absolute",
                                                                    top: "40px",
                                                                }}
                                                                type="submit"
                                                                onClick={async () => {
                                                                    // await setTextI(item.activityId)
                                                                    formik2.setFieldValue(
                                                                        "activityId",
                                                                        item.activityId
                                                                    );
                                                                }}
                                                            >
                                                                <i className="icofont-paper-plane" />
                                                            </button>
                                                        )}

                                                        {item?.commentData[0]?.isCmt ? (
                                                            <div></div>
                                                        ) : (
                                                            item.comment.map((item, index) => {
                                                                return (
                                                                    <div className="comments-area">
                                                                        <ul>
                                                                            <li>
                                                                                <figure>
                                                                                    <img
                                                                                        alt
                                                                                        src="images/resources/user1.jpg"
                                                                                    />
                                                                                </figure>
                                                                                <div className="commenter">
                                                                                    <h5>
                                                                                        <a title href="#">
                                                                                            {item.user?.username}
                                                                                        </a>
                                                                                    </h5>
                                                                                    <span>
                                                                                        {DateTime(item.datetime)}
                                                                                    </span>
                                                                                    <p>{item.commentContent}</p>
                                                                                    {/* <span>you can view the more detail via
                                                                                                link</span>
                                                                                            <a title href="#">https://www.youtube.com/watch?v=HpZgwHU1GcI</a> */}
                                                                                </div>
                                                                                {/* <span title="Like" onClick={() => {
                                                                                        }}><i className="icofont-heart" /></span> */}
                                                                                <a
                                                                                    title="Reply"
                                                                                    onClick={() => {
                                                                                        formik2.setFieldValue(
                                                                                            "commentIdReply",
                                                                                            item.commentId
                                                                                        );
                                                                                        // setCommentI('commentIdReply')
                                                                                        setContent(
                                                                                            item.user?.username
                                                                                        );
                                                                                        setOnID(item.activityId);
                                                                                    }}
                                                                                    className="reply-coment"
                                                                                >
                                                                                    <i className="icofont-reply" />
                                                                                </a>
                                                                            </li>
                                                                            <li>
                                                                                {item.inverseReply?.map(
                                                                                    (item, index) => {
                                                                                        return (
                                                                                            <div
                                                                                                key={index}
                                                                                                className="ml-5"
                                                                                            >
                                                                                                <figure>
                                                                                                    <img
                                                                                                        alt
                                                                                                        src="images/resources/user1.jpg"
                                                                                                    />
                                                                                                </figure>
                                                                                                <div className="commenter">
                                                                                                    <h5>
                                                                                                        <a title href="#">
                                                                                                            {
                                                                                                                item.user
                                                                                                                    ?.username
                                                                                                            }
                                                                                                        </a>
                                                                                                    </h5>
                                                                                                    <span>
                                                                                                        {DateTime(
                                                                                                            item.datetime
                                                                                                        )}
                                                                                                    </span>
                                                                                                    <p>
                                                                                                        {
                                                                                                            item.commentContent
                                                                                                        }
                                                                                                    </p>
                                                                                                    {/* <span>you can view the more detail via
                                                                                                link</span>
                                                                                            <a title href="#">https://www.youtube.com/watch?v=HpZgwHU1GcI</a> */}
                                                                                                </div>
                                                                                                {/* <span title="Like" onClick={() => {
                                                                                        }}><i className="icofont-heart" /></span> */}
                                                                                                {/* <a title="Reply" onClick={() => {
                                                                                                formik2.setFieldValue('commentIdReply', item.commentId)
                                                                                                // setCommentI('commentIdReply')
                                                                                                setContent(item.user?.username)
                                                                                                setOnID(item.activityId)

                                                                                            }} className="reply-coment"><i className="icofont-reply" /></a> */}
                                                                                            </div>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                );
                                                            })
                                                        )}
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {isOpen === true ? (
                    <div className="post-new-popup" style={popupStyle}>
                        <div
                            className="popup"
                            style={{ width: 600, zIndex: 80 }}
                        >
                            <span className="popup-closed" onClick={handleClick}>
                                <i className="icofont-close" />
                            </span>
                            <div className="popup-meta">
                                <div className="popup-head">
                                    <h5>
                                        <i>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={24}
                                                height={24}
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="feather feather-plus"
                                            >
                                                <line x1={12} y1={5} x2={12} y2={19} />
                                                <line x1={5} y1={12} x2={19} y2={12} />
                                            </svg>
                                        </i>
                                        Cập nhật kết quả
                                    </h5>
                                </div>
                            </div>

                            <div>
                                <form onSubmit={formik8.handleSubmit}>
                                    <div className="form row mt-3">
                                        <div className="form-group">
                                            <label >
                                                Tiêu đề
                                            </label>
                                            <input className="form-control" name='title' onChange={formik8.handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label >
                                                Chi tiết
                                            </label>
                                            <textarea id="message" className="form-control" rows="2" cols="50" name='desciption' onChange={formik8.handleChange}></textarea>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary btn-block"
                                                >
                                                    Cập nhật
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </form>

                            </div>
                        </div>
                    </div>
                ) : (
                    <div></div>
                )}
                {isOpen1 === true ? (
                    <div className="post-new-popup" style={popupStyle1}>
                        <div
                            className="popup"
                            style={{ width: 600, zIndex: 80 }}
                        >
                            <span className="popup-closed" onClick={handleClick1}>
                                <i className="icofont-close" />
                            </span>
                            <div className="popup-meta">
                                <div className="popup-head">
                                    <h5>
                                        <i>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={24}
                                                height={24}
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="feather feather-plus"
                                            >
                                                <line x1={12} y1={5} x2={12} y2={19} />
                                                <line x1={5} y1={12} x2={19} y2={12} />
                                            </svg>
                                        </i>
                                        Kết quả chiến dịch
                                    </h5>
                                </div>
                            </div>

                            <div>
                                {activityId?.activityResult?.map((item, index) => {
                                    return <div style={{ borderBottom: '1px solid black', padding: '10px 0' }} key={index}>
                                        <div style={{ display: 'flex', fontSize: '18px', alignContent: 'center' }}><span style={{ paddingRight: '5px' }}>Tiêu đề: </span> <h4 style={{ color: '#1572b8' }}> {item.title}</h4></div>
                                        <span style={{ fontSize: '18px' }}>Chi tiết: {item.desciption}</span>
                                    </div>
                                })}

                            </div>
                        </div>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        </Fragment>
    )
}
