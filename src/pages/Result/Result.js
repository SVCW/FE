
import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HistoryFollowJoinAction } from '../../redux/actions/HistoryAction';
import moment from 'moment';
import { HistoryDonationAction } from '../../redux/actions/DonationAction';
export default function Result () {

    const { arrFollowJoin } = useSelector(root => root.HistoryReducer)
    const { arrDonation } = useSelector(root => root.DonationReducer)
    const { userID } = useSelector(root => root.LoginReducer)
    const dispatch = useDispatch()
    const DateTime = (item) => {
        const currentTime = moment();
        const inputTime = moment(item);
        const duration = moment.duration(currentTime.diff(inputTime));
        const hoursAgo = duration.asHours();
        let timeAgoString = '';
        if (hoursAgo < 1) {
            const daysAgo = Math.floor(duration.asMinutes());
            timeAgoString = `${daysAgo} Phút Trước`;
        }
        else if (hoursAgo >= 24) {
            const daysAgo = Math.floor(duration.asDays());
            timeAgoString = `${daysAgo} days ago`;
        } else {
            const hoursAgo = Math.floor(duration.asHours());
            timeAgoString = `${hoursAgo} hours ago`;
        }
        return timeAgoString
    }
    useEffect(() => {
        const action = HistoryFollowJoinAction(userID)
        dispatch(action)
        const action1 = HistoryDonationAction(userID)
        dispatch(action1)
    }, []);
    console.log(arrFollowJoin);
    console.log(arrDonation);
    return (
        <div className="theme-layout">

            <section>
                <div className="top-area bluesh high-opacity">
                    <div className="bg-image" style={{ backgroundImage: 'url(images/resources/top-bg.jpg)' }} />
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="post-subject">
                                    <div className="university-tag">
                                        <div className="Search-result">
                                            <h4>Kết quả tìm kiếm cho  <strong>"Lịch Sử"</strong></h4>
                                        </div>
                                    </div>
                                    <ul className="nav nav-tabs post-detail-btn">
                                        <li className="nav-item"><a className="active" href="#allposts" data-toggle="tab">Sự Kiện Tham Gia</a></li>
                                        <li className="nav-item"><a className href="#members" data-toggle="tab">Sự Kiện Theo Dõi</a></li>
                                        <li className="nav-item"><a className href="#depart" data-toggle="tab">Số Tiền Ủng Hộ</a></li>
                                        {/* <li className="nav-item"><a className href="#photos" data-toggle="tab">Photos</a></li>
                                        <li className="nav-item"><a className href="#videos" data-toggle="tab">Videos</a></li>
                                        <li className="nav-item"><a className href="#groups" data-toggle="tab">Groups</a></li> */}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div className="gap">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div id="page-contents" className="row merged20">
                                    <div className="col-lg-8">
                                        <div className="tab-content">
                                            <div className="tab-pane fade active show" id="allposts">
                                                <div className="main-wraper">
                                                    <div className="main-title">Sự Kiện Tham Gia</div>
                                                    {arrFollowJoin.filter(item => item.isJoin === true).length === 0 ? <div>Chưa Tham Gia Sự Kiện Nào</div>
                                                        :
                                                        <div> {arrFollowJoin.filter(item => item.isJoin === true).map((item, index) => {
                                                            return <div className="blog-posts mb-3">
                                                                {/* <figure><img src={item?.media?.linkMedia} alt /></figure> */}

                                                                {item.activity?.media?.map((item, index) => {
                                                                    return <figure key={index}><img src={item.linkMedia} alt /></figure>
                                                                })}
                                                                <div className="blog-post-meta">
                                                                    <ul>
                                                                        <li><i className="icofont-read-book" /><a title="Reads" href="#">{item.activity?.numberLike}</a></li>
                                                                        <li><i className="icofont-comment" /><a title="comments" href="#">33</a></li>
                                                                    </ul>
                                                                    <h4>{item.activity?.title}</h4>
                                                                    <p>
                                                                        {item.activity?.description}
                                                                    </p>
                                                                    <span><i className="icofont-clock-time" />{DateTime(item.activity?.createAt)}</span>
                                                                    <a href="blog-detail.html" title className="button primary circle">Chi Tiết</a>
                                                                </div>
                                                            </div>
                                                        })
                                                        }</div>
                                                    }

                                                    {/* <div className="load mt-5 mb-4">
                                                        <ul className="pagination">
                                                            <li><a href="#" title><i className="icofont-arrow-left" /></a></li>
                                                            <li><a className="active" href="#" title>1</a></li>
                                                            <li><a href="#" title>2</a></li>
                                                            <li><a href="#" title>3</a></li>
                                                            <li><a href="#" title>4</a></li>
                                                            <li><a href="#" title>5</a></li>
                                                            <li>....</li>
                                                            <li><a href="#" title>10</a></li>
                                                            <li><a href="#" title><i className="icofont-arrow-right" /></a></li>
                                                        </ul>
                                                    </div> */}
                                                </div>


                                            </div>
                                            <div className="tab-pane fade" id="depart">
                                                <div className="main-wraper">
                                                    <h4 className="main-title">Lịch Sử Thanh Toán</h4>
                                                    <div className="dept-info">
                                                        <ul>
                                                            {arrDonation.length === 0 ?
                                                                <div>Chưa Ủng Hộ Cho Sự Kiện Nào</div>
                                                                :
                                                                <Fragment>
                                                                    {arrDonation.map((item, index) => {
                                                                        return <li>
                                                                            <h6>Hoạt Động : <span style={{ fontWeight: 'bold' }}>{item.activity.title}</span></h6>
                                                                            <div>Thời Gian Thanh Toán : {DateTime(item.datetime)}</div>
                                                                            <div>Số Tiền : <span> <i>{(item.amount.toLocaleString())} vnđ</i></span></div>
                                                                        </li>
                                                                    })}
                                                                </Fragment>

                                                            }

                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-pane fade" id="members">
                                                <div className="main-wraper">
                                                    <div className="main-title">Sự Kiện Theo Dõi</div>
                                                    {arrFollowJoin.filter(item => item.isFollow === true).length === 0 ? <div>Chưa Theo Dõi Sự Kiện Nào</div>
                                                        :
                                                        <div>
                                                            {arrFollowJoin.filter(item => item.isFollow === true).map((item, index) => {
                                                                return <div className="blog-posts mt-4">
                                                                    {item.activity?.media?.map((item, index) => {
                                                                        return <figure key={index}><img src={item.linkMedia} alt /></figure>
                                                                    })}
                                                                    <div className="blog-post-meta">
                                                                        <ul>
                                                                            <li><i className="icofont-read-book" /><a title="Reads" href="#">{item.activity?.numberLike}</a></li>
                                                                            <li><i className="icofont-comment" /><a title="comments" href="#">33</a></li>
                                                                        </ul>
                                                                        <h4>{item.activity?.title}</h4>
                                                                        <p>
                                                                            {item.activity?.description}
                                                                        </p>
                                                                        <span><i className="icofont-clock-time" />{DateTime(item.activity?.createAt)}</span>
                                                                        <a href="blog-detail.html" title className="button primary circle">Chi Tiết</a>
                                                                    </div>
                                                                </div>
                                                            })}
                                                        </div>}

                                                    {/* <div className="load mt-5 mb-4">
                                                        <ul className="pagination">
                                                            <li><a href="#" title><i className="icofont-arrow-left" /></a></li>
                                                            <li><a className="active" href="#" title>1</a></li>
                                                            <li><a href="#" title>2</a></li>
                                                            <li><a href="#" title>3</a></li>
                                                            <li><a href="#" title>4</a></li>
                                                            <li><a href="#" title>5</a></li>
                                                            <li>....</li>
                                                            <li><a href="#" title>10</a></li>
                                                            <li><a href="#" title><i className="icofont-arrow-right" /></a></li>
                                                        </ul>
                                                    </div> */}
                                                </div>
                                            </div>
                                            <div className="tab-pane fade" id="photos">
                                                <div className="main-wraper">
                                                    <h4 className="main-title">Photos <a href="#" title>view all</a></h4>
                                                    <div className="row merged-10 remove-ext20">
                                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                                            <div className="images-post">
                                                                <a className="uk-inline" href="images/elements/light.jpg" data-fancybox>
                                                                    <img src="images/elements/light.jpg" alt />
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                                            <div className="images-post">
                                                                <a className="uk-inline" href="images/elements/dark.jpg" data-fancybox>
                                                                    <img src="images/elements/dark.jpg" alt />
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                                            <div className="images-post">
                                                                <a className="uk-inline" href="images/elements/image.jpg" data-fancybox>
                                                                    <img src="images/elements/image.jpg" alt />
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                                            <div className="images-post">
                                                                <a className="uk-inline" href="images/elements/image2.jpg" data-fancybox>
                                                                    <img src="images/elements/image2.jpg" alt />
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                                            <div className="images-post">
                                                                <a className="uk-inline" href="images/elements/image3.jpg" data-fancybox>
                                                                    <img src="images/elements/image3.jpg" alt />
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                                            <div className="images-post">
                                                                <a className="uk-inline" href="images/elements/image4.jpg" data-fancybox>
                                                                    <img src="images/elements/image4.jpg" alt />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-pane fade" id="videos">
                                                <div className="main-wraper">
                                                    <h4 className="main-title">Videos <a href="#" title>view all</a></h4>
                                                    <div className="row merged-10 remove-ext20">
                                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                                            <div className="video-posts">
                                                                <img src="images/resources/post-video1.jpg" alt />
                                                                <a className="play-btn" data-fancybox href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"><i className="icofont-play" /></a>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                                            <div className="video-posts">
                                                                <img src="images/resources/post-video2.jpg" alt />
                                                                <a className="play-btn" data-fancybox href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"><i className="icofont-play" /></a>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                                            <div className="video-posts">
                                                                <img src="images/resources/post-video3.jpg" alt />
                                                                <a className="play-btn" data-fancybox href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"><i className="icofont-play" /></a>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                                            <div className="video-posts">
                                                                <img src="images/resources/post-video4.jpg" alt />
                                                                <a className="play-btn" data-fancybox href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"><i className="icofont-play" /></a>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                                            <div className="video-posts">
                                                                <img src="images/resources/post-video5.jpg" alt />
                                                                <a className="play-btn" data-fancybox href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"><i className="icofont-play" /></a>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                                            <div className="video-posts">
                                                                <img src="images/resources/post-video6.jpg" alt />
                                                                <a className="play-btn" data-fancybox href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"><i className="icofont-play" /></a>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                                            <div className="video-posts">
                                                                <img src="images/resources/post-video6.jpg" alt />
                                                                <a className="play-btn" data-fancybox href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"><i className="icofont-play" /></a>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                                            <div className="video-posts">
                                                                <img src="images/resources/post-video8.jpg" alt />
                                                                <a className="play-btn" data-fancybox href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"><i className="icofont-play" /></a>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                                            <div className="video-posts">
                                                                <img src="images/resources/post-video9.jpg" alt />
                                                                <a className="play-btn" data-fancybox href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"><i className="icofont-play" /></a>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                                            <div className="video-posts">
                                                                <img src="images/resources/post-video10.jpg" alt />
                                                                <a className="play-btn" data-fancybox href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"><i className="icofont-play" /></a>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                                            <div className="video-posts">
                                                                <img src="images/resources/post-video11.jpg" alt />
                                                                <a className="play-btn" data-fancybox href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"><i className="icofont-play" /></a>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                                            <div className="video-posts">
                                                                <img src="images/resources/post-video6.jpg" alt />
                                                                <a className="play-btn" data-fancybox href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"><i className="icofont-play" /></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-pane fade" id="groups">
                                                <div className="main-wraper">
                                                    <h4 className="main-title">Groups</h4>
                                                    <div className="row col-xs-6">
                                                        <div className="col-lg-3 col-md-4 col-sm-4">
                                                            <div className="group-box">
                                                                <figure><img alt src="images/resources/group1.jpg" /></figure>
                                                                <a title href="#">Sports Punch</a>
                                                                <span>125M Members</span>
                                                                <button>join group</button>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-4 col-sm-4">
                                                            <div className="group-box">
                                                                <figure><img src="images/resources/group2.jpg" alt /></figure>
                                                                <a href="#" title>Asian Girls</a>
                                                                <span>12k Members</span>
                                                                <button>join group</button>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-4 col-sm-4">
                                                            <div className="group-box">
                                                                <figure><img src="images/resources/group3.jpg" alt /></figure>
                                                                <a href="#" title>Graphic Design</a>
                                                                <span>125M Members</span>
                                                                <button>join group</button>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-4 col-sm-4">
                                                            <div className="group-box">
                                                                <figure><img src="images/resources/group4.jpg" alt /></figure>
                                                                <a href="#" title>Family Lovers</a>
                                                                <span>1M Members</span>
                                                                <button>join group</button>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-4 col-sm-4">
                                                            <div className="group-box">
                                                                <figure><img src="images/resources/group5.jpg" alt /></figure>
                                                                <a href="#" title>School Mates</a>
                                                                <span>22M Members</span>
                                                                <button>join group</button>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-4 col-sm-4">
                                                            <div className="group-box">
                                                                <figure><img src="images/resources/group6.jpg" alt /></figure>
                                                                <a href="#" title>Panama Beach</a>
                                                                <span>5M Members</span>
                                                                <button>join group</button>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-4 col-sm-4">
                                                            <div className="group-box">
                                                                <figure><img src="images/resources/group7.jpg" alt /></figure>
                                                                <a href="#" title>Online Teching</a>
                                                                <span>52k Members</span>
                                                                <button>join group</button>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-4 col-sm-4">
                                                            <div className="group-box">
                                                                <figure><img src="images/resources/group8.jpg" alt /></figure>
                                                                <a href="#" title>Child Cares</a>
                                                                <span>1M Members</span>
                                                                <button>join group</button>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-4 col-sm-4">
                                                            <div className="group-box">
                                                                <figure><img src="images/resources/group9.jpg" alt /></figure>
                                                                <a href="#" title>Fun Art</a>
                                                                <span>35k Members</span>
                                                                <button>join group</button>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-4 col-sm-4">
                                                            <div className="group-box">
                                                                <figure><img src="images/resources/group10.jpg" alt /></figure>
                                                                <a href="#" title>Kids Players</a>
                                                                <span>10M Members</span>
                                                                <button>join group</button>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-4 col-sm-4">
                                                            <div className="group-box">
                                                                <figure><img src="images/resources/group11.jpg" alt /></figure>
                                                                <a href="#" title>Goldi Friends</a>
                                                                <span>14M Members</span>
                                                                <button>join group</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="col-lg-4">
                                        <aside className="sidebar static right">
                                            <div className="widget">
                                                <h4 className="widget-title">Lịch Sử</h4>
                                                <ul className="widget-analytics">
                                                    <li>Sự Kiện Tham Gia <span>{arrFollowJoin.filter(item => item.isFollow === true).length}</span></li>
                                                    <li>Sự Kiện Theo Dõi <span>{arrFollowJoin.filter(item => item.isFollow === true).length}</span></li>
                                                    <li>Số Lần Ủng Hộ <span>{arrDonation.length}</span></li>
                                                </ul>
                                            </div>
                                            {/* <div className="widget">
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
                                            <div className="widget stick-widget">
                                                <h4 className="widget-title">Who's follownig</h4>
                                                <ul className="followers">
                                                    <li>
                                                        <figure><img alt src="images/resources/friend-avatar.jpg" /></figure>
                                                        <div className="friend-meta">
                                                            <h4>
                                                                <a title href="time-line.html">Kelly Bill</a>
                                                                <span>Dept colleague</span>
                                                            </h4>
                                                            <a className="underline" title href="#">Follow</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img alt src="images/resources/friend-avatar2.jpg" /></figure>
                                                        <div className="friend-meta">
                                                            <h4>
                                                                <a title href="time-line.html">Issabel</a>
                                                                <span>Dept colleague</span>
                                                            </h4>
                                                            <a className="underline" title href="#">Follow</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img alt src="images/resources/friend-avatar3.jpg" /></figure>
                                                        <div className="friend-meta">
                                                            <h4>
                                                                <a title href="time-line.html">Andrew</a>
                                                                <span>Dept colleague</span>
                                                            </h4>
                                                            <a className="underline" title href="#">Follow</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img alt src="images/resources/friend-avatar4.jpg" /></figure>
                                                        <div className="friend-meta">
                                                            <h4>
                                                                <a title href="time-line.html">Sophia</a>
                                                                <span>Dept colleague</span>
                                                            </h4>
                                                            <a className="underline" title href="#">Follow</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img alt src="images/resources/friend-avatar5.jpg" /></figure>
                                                        <div className="friend-meta">
                                                            <h4>
                                                                <a title href="time-line.html">Allen</a>
                                                                <span>Dept colleague</span>
                                                            </h4>
                                                            <a className="underline" title href="#">Follow</a>
                                                        </div>
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
            </section>
            <figure className="bottom-mockup"><img src="images/footer.png" alt /></figure>

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
        </div>
    )
}

