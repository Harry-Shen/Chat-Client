import { useState } from "react";
import { useHistory } from "react-router";
import { connect } from "react-redux";

import socket from '../data/socket'
import { fetch_, updateContactAndGroup } from "../utils";

function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginFailMsg, setLoginFailMsg] = useState('');
    const history = useHistory();

    const click = async (e) => {
        e.preventDefault();
        const res = await fetch_("/login", "post", { username, password });
        if (res.success) {
            document.cookie = `token=${res.token};path=/;max-age=2592000`; // 1 month to expire
            setLoginFailMsg("");
            props.login(res.user);
            updateContactAndGroup();
            socket.auth.token = res.token;
            socket.disconnect().connect();
            history.push("/");
        } else {
            setLoginFailMsg(res.reason);
        }
    };


    return (
        <div className='p-4'>
            <h3 className='text-center'>登录</h3>
            <p className="text-warning">{loginFailMsg}</p>
            <form >
                <div className="mb-3">
                    <label className="form-label">用户名:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">密码:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="text-center">
                    <button className="btn btn-primary" onClick={click}>
                        登录
                    </button>
                </div>
            </form>
        </div>
    );
}

function mapDispatchToProps(dispatch) {
    return {
        login: (user) => { dispatch({ type: 'LOGIN', user }) },
    }
}

export default connect(null, mapDispatchToProps)(Login);