import React, { useState } from "react";

const PostDescription = ({ description }) => {
  const [isReadMore, setReadMore] = useState(false);

  return (
    <>
      {isReadMore ? (
        description.length > 100 ? <>{description} <span style={{fontWeight: 'bold', color:"#2f3640"}} onClick={() => setReadMore(false)}>...Thu gọn</span></> : <>{description}</>
      ) : description.length > 100 ? (
        <>
          {description.substring(0, 100)}
          <span style={{fontWeight: 'bold', color:"#2f3640"}} onClick={() => setReadMore(true)}>...Xem thêm</span>
        </>
      ) : (
        <>{description}</>
      )}
    </>
  );
};

export default PostDescription;
