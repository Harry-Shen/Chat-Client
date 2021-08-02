import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';

import Msg from '../widget/msg';

export default function Msgs(props) {
    const [content, setContent] = useState('');
    useEffect(() => {
        setTimeout(() => {
            const box = document.querySelector('.msg-box');
            box.scrollTop = box.scrollHeight;
        }, 100)
    }, []);

    const send = (e) => {
        props.send(e, content);
        setContent('');
    }
    const history = useHistory();

    const { msgs, is_group, groups, counterpart, counterUser, user, getPrevMsgs, no_more_msgs } = props;
    let msgTags = msgs ? msgs.map((msg, i) => <Msg key={msg.id} msg={msg} user={user} />) : null
    let name;
    if (is_group) {
        const group = groups.filter(g => g.group_id === counterpart)[0];
        name = group.group_name;
    } else {
        name = counterUser ? counterUser.nickname : '';
    }

    return (
        <div className="page msgs">
            <div className="header">
                <div className="back">
                    <div role='button' onClick={() => { history.goBack() }}>
                        <img src="/img/angle-left-black.png" alt="<" />
                    </div>
                </div>
                <h3 className="text-center" style={{ textTransform: 'capitalize' }}>{name} </h3>
            </div>
            <div className="msg-box">
                {no_more_msgs ? null : <div onClick={getPrevMsgs} className='more-msgs'><img src="/img/more.png" alt="more" /></div>}
                {msgTags}
            </div>
            <form className="msgs-bottom">
                <input autoComplete='off' className="msg-input-box form-control" type="text" name="msg" value={content} onChange={(e) => { setContent(e.target.value) }} />
                <button className="btn btn-primary msg-send-button" style={{ whiteSpace: 'nowrap' }} onClick={send}>发送</button>
            </form>
        </div>
    )
}
