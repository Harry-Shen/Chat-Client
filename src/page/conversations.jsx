import React from 'react'
import { connect } from 'react-redux'

import Conversation from '../widget/conversation'
import LoginOrRegister from '../widget/loginOrRegister'

function Conversations(props) {

    const convs = props.conversations.map((c) => {
        const lastMsg = c.msgs[c.msgs.length - 1].content;
        return (
            <Conversation counterpart={c.counterpart} lastMsg={lastMsg} is_group={c.is_group} groups={props.groups} key={c.counterpart + (c.is_group ? 1000 : 0)} deleteConversation={props.deleteConversation} />
        )
    });

    return (
        <div className="page">
            <div className="header">
                <h3 className='text-center'>对话</h3>
            </div>
            <div className="conversation-box">
                {props.user ? null : <LoginOrRegister />}
                {convs}
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        conversations: state.conversations,
        user: state.info.user,
        groups: state.info.group
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteConversation: (counterpart, is_group) => { dispatch({ type: 'DELETE-CONVERSATION', counterpart, is_group }) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Conversations)
