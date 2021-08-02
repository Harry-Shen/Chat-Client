import React, { useRef } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';

import socket from '../data/socket';
import { getCookie, ENDPOINT } from '../utils';

import Portrait from '../widget/portrait';

function Me({ logged_in, user, logout, round_screen, setRoundScreen }) {
    const profileRef = useRef(null);

    const logout_ = () => {
        document.cookie = "token=;path=/;";
        socket.auth.token = "";
        socket.disconnect().connect();
        logout();
    };

    const openUpload = () => {
        profileRef.current.click();
    }

    const upload = (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        console.log(file);

        fetch(ENDPOINT + '/upload-profile', {
            method: 'POST',
            headers: {
                Authorization: getCookie("token"),
            },
            body: formData,
        }).then(res => res.json()).then(res => {
            if (res.success) {
                window.location.href = '/me';
            }
        })
    }

    let button;
    if (logged_in) {
        button = <button className="btn btn-primary" onClick={logout_}>退出登录</button>;
    } else {
        button = (<Link to='/login' > <button className="btn btn-primary">登录</button> </Link>)
    }

    return (
        <div className="page text-center">
            <h3 className=' mb-3'>{logged_in ? user.username : '未登录'}</h3>
            {logged_in ? <p className='mb-4'>{user.intro}</p> : null}
            <div className='avatar mb-4' onClick={openUpload} style={{ cursor: 'pointer' }}>
                {logged_in ? <Portrait id={user.id} avatar={true} /> : null}
            </div>
            <div className="w-100 d-flex justify-content-center">
                {button}
            </div>
            <div className="text-center mt-4">
                <Link className='me-4' to='/search-user'>搜索用户</Link>
                <Link to='/all-group'>所有群</Link>
            </div>
            <form action={`${ENDPOINT}/upload-profile`} method='post' className='text-center'>
                <input accept="image/*" type="file" hidden name='profile' ref={profileRef} onChange={upload} />
            </form>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        user: state.info.user,
        logged_in: state.info.login,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        login: (user) => { dispatch({ type: 'LOGIN', user }) },
        logout: () => { dispatch({ type: 'LOGOUT' }) },
        setContact: (contact) => { dispatch({ type: 'SET-CONTACT', contact }) },
        setGroup: (group) => { dispatch({ type: 'SET-GROUP', group }) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Me)
