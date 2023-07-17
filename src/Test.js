import React from 'react'
import Swal from 'sweetalert2'
export default function Test () {
    return (
        <div onClick={() => {
            Swal.fire('Any fool can use a computer')
        }}>avc</div>
    )
}
