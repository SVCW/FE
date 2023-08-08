
import React, { useEffect } from 'react'
import { GetActivityAction } from '../../redux/actions/ActivityAction';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { FollowAction, JoinAction, UnFollowAction, UnJoinAction } from '../../redux/actions/FollowJoinAction';
export default function Home1 () {
    const dispatch = useDispatch()
    const { arrListActivity } = useSelector(root => root.ActivityReducer)
    useEffect(() => {
        const action = GetActivityAction()
        dispatch(action)
    }, []);
    console.log(arrListActivity);

    const handleLikeClick = (id) => {
        return (dispatch) => {
            const cmt = arrListActivity.map((item, index) => {
                if (item.activityId === id) {
                    item.followJoinAvtivity.forEach((comment, index) => {
                        console.log(comment.isJoin);
                        if (comment.isJoin === false) {
                            const action = JoinAction(id, 'USRc276d32');
                            dispatch(action);
                        } else {
                            const action = UnJoinAction(id, 'USRc276d32');
                            dispatch(action);
                        }
                    });
                }
            });
        };
    };
    return (
        <section>
            <div className="gap">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div id="page-contents" className="row merged20">

                                <div className="col-lg-6">





                                    {arrListActivity.map((item, index) => {
                                        let isJoin = false;
                                        let isFollow = false;
                                        let isLike = false;
                                        let isCmt = false;
                                        item?.like?.map((user) => {
                                            if (user.userId === 'USRc276d32') {
                                                isLike = true;
                                            }
                                        });

                                        item?.followJoinAvtivity?.map((user) => {
                                            if (user.userId === 'USRc276d32') {
                                                isFollow = user.isFollow;
                                                isJoin = user.isJoin;
                                            }
                                        });
                                        return <div className="main-wraper">
                                            <div className="user-post">
                                                <div className="friend-info">
                                                    <figure>
                                                        <em>
                                                            <svg style={{ verticalAlign: 'middle' }} xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 24 24">
                                                                <path fill="#7fba00" stroke="#7fba00" d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z">
                                                                </path>
                                                            </svg></em>
                                                        <img alt src="images/resources/user3.jpg" />
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
                                                        <ins><a title href="time-line.html">Turgut Alp</a> Create
                                                            Post</ins>
                                                        <span><i className="icofont-globe" /> published: Sep,15 2020</span>
                                                    </div>
                                                    <div className="post-meta">
                                                        <figure>
                                                            <a data-toggle="modal" data-target="#img-comt" href="images/resources/album1.jpg">
                                                                <img src="images/resources/study.jpg" alt />
                                                            </a>
                                                        </figure>
                                                        <a href="post-detail.html" className="post-title">{item.title}</a>
                                                        <p>
                                                            {item.description}
                                                        </p>
                                                        <div>
                                                            <button className={`btn ${isJoin ? 'btn-danger' : 'btn-success'}`} onClick={() => {
                                                                const action = handleLikeClick(item.activityId);
                                                                console.log(isJoin);
                                                                dispatch(action)
                                                            }}> {isJoin
                                                                ? "Hủy Tham Gia"
                                                                : "Tham Gia"}</button>
                                                            <button className={`btn ${isFollow ? 'btn-success' : 'btn-danger'}`}> {isFollow
                                                                ? "Theo Dõi"
                                                                : "Hủy Theo Dõi"}</button>
                                                        </div>
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
                                                            <a title href="#" className="comment-to"><i className="icofont-comment" /> Comment</a>
                                                            <a title href="#" className="share-to"><i className="icofont-share-alt" /> Share</a>
                                                            <div className="emoji-state">
                                                                <div className="popover_wrapper">
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
                                                                <div className="popover_wrapper">
                                                                    <a className="popover_title" href="#" title><img alt src="images/smiles/heart.png" /></a>
                                                                    <div className="popover_content">
                                                                        <span><img alt src="images/smiles/heart.png" />
                                                                            Love</span>
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
                                                                        <span><img alt src="images/smiles/smile.png" />
                                                                            Happy</span>
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
                                                                        <span><img alt src="images/smiles/weep.png" />
                                                                            Dislike</span>
                                                                        <ul className="namelist">
                                                                            <li>Danial Carbal</li>
                                                                            <li>Amara Sin</li>
                                                                            <li>Sarah K.</li>
                                                                            <li><span>15+ more</span></li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                                <p>30+</p>
                                                            </div>
                                                            <div className="new-comment" style={{ display: 'none' }}>
                                                                <form method="post">
                                                                    <input type="text" placeholder="write comment" />
                                                                    <button type="submit"><i className="icofont-paper-plane" /></button>
                                                                </form>
                                                                <div className="comments-area">
                                                                    <ul>
                                                                        <li>
                                                                            <figure><img alt src="images/resources/user1.jpg" />
                                                                            </figure>
                                                                            <div className="commenter">
                                                                                <h5><a title href="#">Jack Carter</a>
                                                                                </h5>
                                                                                <span>2 hours ago</span>
                                                                                <p>
                                                                                    i think that some how, we learn who we
                                                                                    really are and then live with that
                                                                                    decision, great post!
                                                                                </p>
                                                                                <span>you can view the more detail via
                                                                                    link</span>
                                                                                <a title href="#">https://www.youtube.com/watch?v=HpZgwHU1GcI</a>
                                                                            </div>
                                                                            <a title="Like" href="#"><i className="icofont-heart" /></a>
                                                                            <a title="Reply" href="#" className="reply-coment"><i className="icofont-reply" /></a>
                                                                        </li>
                                                                        <li>
                                                                            <figure><img alt src="images/resources/user2.jpg" />
                                                                            </figure>
                                                                            <div className="commenter">
                                                                                <h5><a title href="#">Ching xang</a></h5>
                                                                                <span>2 hours ago</span>
                                                                                <p>
                                                                                    i think that some how, we learn who we
                                                                                    really are and then live with that
                                                                                    decision, great post!
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
                                    })}

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
