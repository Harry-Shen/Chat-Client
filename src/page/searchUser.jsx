import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'

import { fetch_ } from '../utils'

function SearchUser(props) {
    const [users, setUsers] = useState([]);
    const inputRef = useRef(null);

    const search = async (e) => {
        e.preventDefault();
        const keyword = inputRef.current.value.trim();
        if (keyword) {
            const res = await fetch_(`/search-user/${keyword}`);
            setUsers(res.users.filter(u => props.me.id !== u.id));
        }
    }

    const inContact = (id) => {
        return props.contact.includes(id);
    }

    return (
        <div className='page'>
            <div className="header">
                <h3 className='text-center'>搜索用户名</h3>
            </div>
            <div className="box users">
                <div className='text-center mt-4'>
                    <p className='text-muted' style={{ fontSize: '0.85rem' }}>例子：搜索 "英" 将显示 "英雄" , "小英"等包含"英"的用户</p>
                    <form onSubmit={search}>
                        <input type="text" ref={inputRef} style={{ width: '250px' }} />
                        <img role='button' onClick={search} className='search-button' src="/img/search.svg" alt="search-button" />
                    </form>
                </div>
                <div className="mt-4">
                    {users.map(user => {
                        return (
                            <Link to={`/user/${user.id}`} key={user.id} >
                                <div className='user-item'>
                                    <div >{user.username}</div>
                                    {inContact(user.id) ? <div>已在通讯录</div> : null}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        contact: state.info.contact,
        me: state.info.user,
    }
}

export default connect(mapStateToProps, null)(SearchUser)

