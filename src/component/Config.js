import React from 'react'
import { Fragment } from 'react'

export default function Config () {
    return (
        <Fragment>
            {localStorage.getItem('config') !== "" ?
                <div className='marquee'><span>{localStorage.getItem('config')}</span></div>
                :
                <div></div>
            }
        </Fragment>
    )
}
