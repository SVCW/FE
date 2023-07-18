import React from 'react'
import { Fragment } from 'react'
import { useSelector } from 'react-redux'

export default function Config () {
    const { message } = useSelector(root => root.ConfigActivityReducer)
    return (
        <Fragment>
            {localStorage.getItem('setError') === 'Đăng nhập thành công!' ?
                <div className='marquee'><span>{localStorage.getItem('setError')}{message}</span></div>
                :
                <div></div>
            }
        </Fragment>
    )
}
