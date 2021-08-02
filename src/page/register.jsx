import React, { useRef, useState } from 'react'
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import { fetch_, updateContactAndGroup } from '../utils';
import socket from '../data/socket';

function Register({ login }) {
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const passwordConfirmRef = useRef(null);
    const [registerFailMsg, setRegisterFailMsg] = useState('');
    const history = useHistory();

    const click = async (e) => {
        e.preventDefault();
        const username = usernameRef.current.value.trim();
        const password = passwordRef.current.value.trim();
        const password_confirm = passwordConfirmRef.current.value.trim();
        console.log(username);
        console.log(password);
        if (username === '') {
            setRegisterFailMsg('用户名不能为空');
            return;
        }
        if (password !== password_confirm) {
            setRegisterFailMsg('密码与确认密码不一致');
            return;
        }
        if (password.length < 4) {
            setRegisterFailMsg('密码需4位以上');
            return;
        }
        const res = await fetch_('/register', 'post', { username, password });
        if (res.success) {
            document.cookie = `token=${res.token};path=/;max-age=2592000`; // 1 month to expire
            setRegisterFailMsg("");
            login(res.user);
            updateContactAndGroup();
            socket.auth.token = res.token;
            socket.disconnect().connect();
            history.push("/");
        } else {
            setRegisterFailMsg(res.reason);
        }
    }

    return (
        <div className='p-4'>
            <h3 className='text-center'>注册</h3>
            <p className='text-warning'> {registerFailMsg}</p>
            <form>
                <div className="mb-3">
                    <label className="form-label">用户名:</label>
                    <input ref={usernameRef} type="text" className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">密码:</label>
                    <input ref={passwordRef} type="password" className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">确认密码:</label>
                    <input ref={passwordConfirmRef} type="password" className="form-control" />
                </div>
                <div className="text-center">
                    <button className="btn btn-primary" onClick={click}>
                        注册
                    </button>
                </div>
            </form>
        </div>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        login: (user) => { dispatch({ type: 'LOGIN', user }) },
    }
}

export default connect(null, mapDispatchToProps)(Register)