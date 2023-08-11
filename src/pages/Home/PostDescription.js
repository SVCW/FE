import React, { useState } from "react";

const PostDescription = ({ description }) => {
  const [isReadMore, setReadMore] = useState(false);

  return (
    <>
      {isReadMore ? (
        description.length > 100 ? <>{description} <span style={{fontWeight: 'bold'}} onClick={() => setReadMore(false)}>...Thu gon</span></> : <>{description}</>
      ) : description.length > 100 ? (
        <>
          {description.substring(0, 100)}
          <span style={{fontWeight: 'bold'}} onClick={() => setReadMore(true)}>...Xem thêm</span>
        </>
      ) : (
        <>{description}</>
      )}
    </>
  );
};

export default PostDescription;
