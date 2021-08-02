import { Route } from 'react-router-dom'
import React from "react";

import socket from './data/socket'
import { getCookie, fetch_, updateContactAndGroup } from "./utils";
import store from "./data/store";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

import Navbar from "./component/navbar";
import Contact from './page/contact'
import Conversations from './page/conversations'
import Login from './page/login'
import Groups from './page/groups'
import Group from './page/group'
import Me from './page/me'
import MsgsPage from './page/msgsPage'
import Register from './page/register'
import User from './page/user';
import Test from './page/test'
import AllGroup from './page/allGroup';
import SearchUser from './page/searchUser';

class App extends React.Component {
    componentDidMount() {
        initApp();
    }
    render() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        return (
            <div className="app" style={{ width, height }}>
                <div className="main">
                    {/* <div>width: {window.innerWidth} height: {window.innerHeight} screenW: {window.screen.width} screenH: {window.screen.height}</div> */}
                    <Route path="/" exact component={() => <Conversations />} />
                    <Route path="/login" component={() => <Login />} />
                    <Route path="/groups" component={() => <Groups />} />
                    <Route path="/group" component={() => <Group />} />
                    <Route path="/contact" component={() => <Contact />} />
                    <Route path="/me" component={() => <Me />} />
                    <Route path="/msg" component={() => <MsgsPage />} />
                    <Route path="/register" component={() => <Register />} />
                    <Route path="/user" component={() => <User />} />
                    <Route path='/test' component={() => <Test />} />
                    <Route path='/all-group' component={() => <AllGroup />} />
                    <Route path='/search-user' component={() => <SearchUser />} />
                </div>
                <Navbar />
            </div>
        )
    }
}

export default App;

async function initApp() {
    const dispatch = store.dispatch;

    window.addEventListener('beforeunload', () => {
        dispatch({ type: 'STORE-DATA' });
    });
    socket.on('init', () => { console.log('socket init'); });

    if (getCookie("token")) {
        const res = await fetch_("/login-token", "post");
        if (res.success) {
            dispatch({ type: 'LOGIN', user: res.user })
            updateContactAndGroup();
        } else {
            window.localStorage.setItem('conversations', '');
            dispatch({ type: 'SET-CONVERSATIONS', conversations: [] })
        }
    }
}

