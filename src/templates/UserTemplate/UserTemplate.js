
import { Fragment } from 'react'
import { Route, NavLink } from 'react-router-dom'
import Header from './Header/Header';
import SideBar from './SideBar/SideBar';
import ResponsiveHeader from './ResponsiveHeader/ResponsiveHeader';
import Carousel from './Carousel/Carousel';
import Config from '../../component/Config';
import { history } from '../../App';


export const UserTemplate = (props) => {
    const { Component, ...restProps } = props;
    return <Route {...restProps} render={(propsRoute) => {
        if (localStorage.getItem('userID') !== '') {
            return <div className='theme-layout'>
                <Config />
                <ResponsiveHeader />
                <Header />
                <Carousel />

                <SideBar />
                <Component {...propsRoute} />
            </div>
        }
        alert('Bạn không thể truy cập! Vui lòng đăng nhập');
        history.push('/')
        window.location.reload();
    }} />
}

