import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import styles from './style.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteLikeAction, PostLikeAction } from '../redux/actions/ActivityAction';
import { FollowAction, UnFollowAction } from '../redux/actions/FollowJoinAction';
export default function DetailActivity(props) {
    const { userID } = useSelector((root) => root.LoginReducer);
  const { item, dateTime } = props;
    console.log(item);
  console.log(props.item.like?.length === 0 ? true : false);
  console.log(props.item);
    const dispatch = useDispatch()
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
    const [like, setLike] = useState(false)

  const slides = props.item.media?.map((item, index) => {
    return (
      <div className={styles['carousel-item']} key={index}>
        <img src={item.linkMedia} alt="Slide 1" />
      </div>
    );
  });

    // [
    //     <div className={styles['carousel-item']} key={1}>
    //         <img src="https://picsum.photos/id/1/200/200" alt="Slide 1" />
    //     </div>,
    //     <div className={styles['carousel-item']} key={2}>
    //         <img src="https://picsum.photos/id/2/200/200" alt="Slide 2" />
    //     </div>,
    //     <div className={styles['carousel-item']} key={3}>
    //         <img src="https://picsum.photos/id/3/200/200" alt="Slide 3" />
    //     </div>,
    //     // Add more slides as needed
    // ];

    const [likeTemp, setLikeTemp] = useState(like);

    const handleClick = () => {
        setLikeTemp(false); // Thay đổi biến tạm thời
    };

    useEffect(() => {
        if (!likeTemp) {
            setLike(false)
            setDa(true)// Thực hiện setLike khi biến tạm thời thay đổi
        }
    }, [likeTemp]);
    const [da, setDa] = useState(true)
    const handleCha = () => {

        setDa(da => !da)
    }


    return (
        <div className="modal fade" id="img-comt">
            <div className="modal-dialog">
                <div className="modal-content">
                    {/* Modal Header */}
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" onClick={() => {
                            handleClick()
                            handleCha()
                        }}>×</button>
                    </div>
                    {/* Modal body */}
                    <div className="modal-body">
                        <div className="row merged">
                            <div className="col-lg-9">
                                <div className='pop-image'>
                                    <div className="pop-item">
                                        <div className="action-block">

                                        </div>

                    {/* <div>
                                            <figure><img src={props.item.media && props.item.media[0] && props.item.media[0].linkMedia} alt width={100} /></figure>
                                        </div> */}
                    <Slider {...settings} className={styles['slick-slider']}>
                      {slides}
                    </Slider>

                                        <div className="stat-tools">
                                            <div className="box">
                                                <div className="Like"><a className="Like__link" style={{ display: 'flex' }}>

                                                    {props.item.like?.length === 0 ? <div onClick={() => {
                                                        const action = PostLikeAction({
                                                            userId: userID,
                                                            activityId: props.item.activityId,
                                                        });
                                                        dispatch(action)
                                                        setLike(true)

                                                    }}>

                                                        <i className="icofont-like" />
                                                        {like ? 'Đã thích' : 'Thích'}</div> :
                                                        props.item.like?.map((item, index) => {

                                                            return item.userId === userID ? <div style={{ display: 'flex' }} onClick={() => {


                                                                handleCha()
                                                            }}> <i className="icofont-like" style={{ color: 'white' }} />{da ? <div onClick={() => {
                                                                const action = DeleteLikeAction({
                                                                    userId: userID,
                                                                    activityId: props.item.activityId,
                                                                })
                                                                dispatch(action)
                                                            }}>Đã thích</div> : <div onClick={() => {
                                                                const action = PostLikeAction({
                                                                    userId: userID,
                                                                    activityId: props.item.activityId,
                                                                })
                                                                dispatch(action)
                                                            }}>Thích</div>} </div> : <div onClick={() => {
                                                                const action = PostLikeAction({
                                                                    userId: userID,
                                                                    activityId: props.item.activityId,
                                                                })
                                                                dispatch(action)
                                                            }}>Thích</div>;

                                                        })
                                                    }


                                                </a>
                                                </div>
                                            </div>


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

                                                <p>{props.item.like?.length}+</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="commentbar">
                                    <div className="user">
                                        <figure><img src={props.item.user?.image} alt /></figure>
                                        <div className="user-information">
                                            <h4><a href="#" title>{props.item.user?.username}</a></h4>
                                            <span>{dateTime(item.createAt)}</span>
                                        </div>
                                        <div className='userfollow' title="Follow" data-ripple>
                                            {props.item.followJoinAvtivity?.length === 0 ? "Theo dõi" : props.item.followJoinAvtivity?.map((item1, index) => {
                                                return item1.userId === userID && item1.isFollow ? <div onClick={() => {
                                                    const action = UnFollowAction(

                                                        props.item1.activityId,
                                                        userID,
                                                    )
                                                    dispatch(action)
                                                }}>Đang theo dõi</div> : <div onClick={() => {
                                                    const action = FollowAction(

                                                        props.item1.activityId,
                                                        userID,
                                                    )
                                                    dispatch(action)
                                                }} style={{ cursor: 'pointer' }}>Theo dõi</div>
                                            })}
                                        </div>
                                    </div>
                                    <h3> {item.title}</h3>
                                    <p>{item.description}</p>

                                    <div className="new-comment" style={{ display: 'block' }}>
                                        <form method="post">
                                            <input type="text" placeholder="bình luận" />
                                            <button type="submit"><i className="icofont-paper-plane" /></button>
                                        </form>
                                        <div className="comments-area">
                                            <ul>
                                                {item.comment?.map((item, index) => {
                                                    return <li>
                                                        <figure><img alt src="images/resources/user1.jpg" /></figure>
                                                        <div className="commenter">
                                                            <h5><a title href="#">{item.userId}</a></h5>
                                                            <span>{dateTime(item.datetime)}</span>
                                                            <p>
                                                                {item.commentContent}
                                                            </p>
                                                            <span></span>
                                                            <a title href="#"></a>
                                                        </div>

                                                        <a title="Reply" href="#" className="reply-coment"><i className="icofont-reply" /></a>
                                                    </li>
                                                })}

                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
