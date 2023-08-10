import React, { useEffect, useState } from "react";
import moment from "moment";

import DetailActivity from "../../component/DetailActivity";

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [detail, setDetail] = useState({});

  console.log(albums)

  const initialCommentData = JSON.parse(localStorage.getItem("activity"))?.map(
    (comment) => ({
      id: comment.activityId,
      isCmt: true,
      color: "#eae9ee",
    })
  );
  const [commentData, setCommentData] = useState(initialCommentData);

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

  useEffect(() => {
    const updatedArrActivity = JSON.parse(
      localStorage.getItem("activity")
    )?.map((activity) => {
      const matchingComments = commentData?.filter(
        (comment) => comment.id === activity.activityId
      );
      return { ...activity, commentData: matchingComments };
    });
    setAlbums(updatedArrActivity);
  }, []);

  if (albums.length === 0) return <p>Chua co album nao</p>;

  const handleRenderAlbums = () => {
    return albums.map((album) => {
      return (
        <div
          className="col-lg-3 col-md-4 col-sm-6"
        >
          <div className="uzr-pictures">
            <a
              data-target="#img-comt"
              data-toggle="modal"
              onClick={() => {
                setDetail(album);
              }}
            >
              <img
                alt={album.media[0]?.mediaId}
                src={album.media[0]?.linkMedia}
                style={{
                    height: "200px",
                    maxHeight: "200px",
                    width:
                      "100%" /* Allow the width to adjust according to aspect ratio */,
                    objectFit: "fill" /* Resize and crop images to cover the container */,
                  }}
              />
            </a>
            <ul className="hover-action">
              <li>
                <a title>
                  {album.media.length > 0 ? (
                    <>
                      <i className="icofont-plus" /> {album.media.length - 1}{" "}
                    </>
                  ) : null}
                </a>
              </li>
            </ul>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <div className="tab-pane fade" id="pictures">
        <h5 className="tab-title">
          Hình ảnh
        </h5>
        <div className="row merged-10" style={{maxHeight: '100px'}}>{handleRenderAlbums()}</div>
      </div>
      <DetailActivity item={detail} dateTime={DateTime} />
    </>
  );
};

export default Albums;
