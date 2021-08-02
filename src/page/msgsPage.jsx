import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'

import socket from '../data/socket';
import { randInt, fetch_ } from '../utils';
import Msgs from '../component/msgs'
import user_pool from '../data/UserPool';

class MsgsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            counterpart: -1,
            is_group: false,
            counterUser: null,
            no_more_msgs: false,
        }
        this.mounted = true;
    }

    componentDidMount() {
        const search = new URLSearchParams(this.props.location.search);
        const counterpart = Number(search.get('counterpart'));
        let is_group = search.get('group') === 'true' ? true : false;
        if (this.mounted) this.setState({ ...this.state, counterpart, is_group });
        if (!is_group) {
            user_pool.getUser(counterpart).then(user => {
                if (this.mounted) this.setState({ ...this.state, counterUser: user })
            })
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    getPrevMsgs = async () => {
        const { counterpart, is_group } = this.state;
        const { conversations, user, setPrevMsgs } = this.props;
        const msgs = getConvMsgs(conversations, counterpart, is_group);
        let latest;
        if (msgs && msgs.length > 0) {
            latest = new Date(msgs[0].send_at)
            latest = latest.getTime();
        } else {
            latest = Date.now();
        }
        const res = await fetch_(`/prev-msg?counterpart=${counterpart}&user_id=${user.id}&is_group=${is_group}&latest=${latest}`);
        if (res.msgs.length > 0) {
            setPrevMsgs(res.msgs, counterpart, is_group);
        }
        if (res.msgs.length < 10) {
            this.setState({ ...this.state, no_more_msgs: true })
        }
    }

    send = (e, content) => {
        e.preventDefault();
        content = content.trim();
        if (content === '') return;
        const { counterpart, is_group } = this.state;
        const { user, sendAction } = this.props
        const msg = { sender: user.id, receiver: null, content, type: "text", group: null, send_at: Date.now() }
        is_group ? msg.group = counterpart : msg.receiver = counterpart;
        socket.emit("msg", msg, withTimeout(
            (res) => {
                if (!this.mounted) return;
                msg.id = res.id;
                sendAction(msg, counterpart);
                console.log('send msg succeed', res.id);
            },
            () => {
                if (!this.mounted) return;
                msg.id = randInt();
                sendAction(msg, counterpart)
                console.warn("send msg failed");
            },
            2000)
        );
        e.target.value = '';
    };

    render() {
        const { counterpart, is_group, counterUser, no_more_msgs } = this.state;
        const { user, groups, conversations } = this.props;
        if (!conversations) return '';
        const msgs = getConvMsgs(conversations, counterpart, is_group);
        if (!user) return (<Link to='/login'>Please In fist</Link>);
        if (counterpart < 0 || (!is_group && !counterUser) || (is_group && groups.length === 0)) {
            return ('loading');
        } else {
            return (<Msgs msgs={msgs} send={this.send} user={user} is_group={is_group} counterUser={counterUser} groups={groups} counterpart={counterpart} getPrevMsgs={this.getPrevMsgs} no_more_msgs={no_more_msgs} />)
        }
    }

}

function withTimeout(onSuccess, onTimeout, timeout) {
    let active = true;
    const timer = setTimeout(() => {
        if (!active) return;
        active = false;
        onTimeout();
    }, timeout);

    return (...args) => {
        if (!active) return;
        active = false;
        clearTimeout(timer)
        onSuccess.apply(this, args);
    }
}

function getConvMsgs(conversations, counterpart, is_group) {
    for (let i = 0; i < conversations.length; i++) {
        const c = conversations[i];
        if (c.counterpart === counterpart && c.is_group === is_group) {
            return [...c.msgs];
        }
    }
    return null;
}



function mapStateToProps(state) {
    return {
        user: state.info.user,
        logged: state.info.login,
        groups: state.info.group,
        conversations: state.conversations
    }
}

function mapDispatchToProps(dispatch) {
    return {
        sendAction: (msg, counterpart) => { dispatch({ type: 'MSG', msg, counterpart }); },
        setPrevMsgs: (msgs, counterpart, is_group) => { dispatch({ type: 'SET-PREV-MSGS', msgs, counterpart, is_group }) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MsgsPage))