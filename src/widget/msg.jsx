import Portrait from './portrait'

export default function Msg({ msg, user }) {
    const left = msg.sender === user.id ? false : true;
    const msgTag = <span className="msg">{msg.content} </span>

    return (
        <div className="w-100 mb-2">
            {left ?
                <div className="msg-left">
                    <Portrait id={msg.sender} />
                    {msgTag}
                </div>
                :
                <div className='msg-right'>
                    {msgTag}
                    <Portrait id={user.id} />
                </div>
            }
        </div>
    )
}
