import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Portrait from './portrait'
import user_pool from '../data/UserPool';

import GroupImg from './groupImg';


export default function Conversation({ counterpart, lastMsg, is_group, groups, deleteConversation }) {
    const [counterUser, setCounterUser] = useState(null);
    useEffect(() => {
        let mounted = true;
        if (!is_group) {
            user_pool.getUser(counterpart).then(cu => {
                if (cu && mounted) {
                    setCounterUser({ ...cu });
                }
            })
        }
        return () => { mounted = false; }
    }, [counterpart, is_group])

    const deleteClick = (e, counterpart, is_group) => {
        e.preventDefault();
        deleteConversation(counterpart, is_group)
    }

    let group = null;
    if (is_group) {
        if (groups) {
            group = groups.filter(g => g.group_id === counterpart)[0];
        }
        if (!group) return null;
    } else {
        if (!counterUser) return null;
    }

    const name = is_group ? group.group_name : counterUser.nickname;
    if (lastMsg.length > 17) lastMsg = lastMsg.substr(0, 15) + '...';

    return (
        <div className="conversation">
            <Link to={`/msg?counterpart=${counterpart}&group=${is_group}`} >
                <div className="row">
                    <div className="col-2">
                        {is_group ? <GroupImg id={group.group_id} /> : <Portrait id={counterUser.id} is_group={is_group} />}
                    </div>
                    <div className="col-10">
                        <div className="d-flex justify-content-between align-items-center" style={{ height: '50px' }}>
                            <div >
                                <div style={{ textTransform: 'capitalize' }}>{name}</div>
                                <div className="text-dark">{lastMsg}</div>
                            </div>
                            <button className='btn btn-outline-primary btn-sm' style={{ whiteSpace: 'nowrap' }} onClick={(e) => deleteClick(e, counterpart, is_group)}>删除</button>
                        </div>
                        <div className="divider mt-1"></div>
                    </div>
                </div>
            </Link>

        </div >
    )
}
