import React from 'react'
import { Fragment } from 'react'
import { useSelector } from 'react-redux';

export default function Config () {
    console.log(localStorage.getItem('message'));
    const { msg } = useSelector(root => root.ConfigActivityReducer)
    return (
        <Fragment>
            {localStorage.getItem('setError') === 'Đăng nhập thành công!' ?
                <div className='marquee'><span>{localStorage.getItem('setError')}  {msg} </span></div>
                :
                <div></div>
            }
        </Fragment>
    )
}
