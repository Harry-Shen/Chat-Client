import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';

import user_pool from '../data/UserPool';
import { fetch_ } from '../utils';

import Portrait from '../widget/portrait';

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            id: -1
        }
    }

    async componentDidMount() {
        const regx = /\/user\/([0-9]+)$/;
        const match = this.props.location.pathname.match(regx);
        console.log(match);
        if (match) {
            const id = Number(match[1]);
            console.log(id);
            const user = await user_pool.getUser(id, true);
            const { me } = this.props;
            if (user && me && user.id === me.id) {
                this.props.history.go('/me');
            }
            if (user) this.setState({ user, id });
        }
    }

    addToContact = async () => {
        const { id } = this.state;
        const res = await fetch_(`/add-to-contact/${id}`, 'post');
        if (res.success) {
            let { contact, setContact } = this.props;
            contact.push(this.state.user.id)
            setContact(contact)
        }
    }

    removeFromContact = async () => {
        const { id } = this.state;
        const res = await fetch_(`/remove-from-contact/${id}`, 'post');
        if (res.success) {
            let { contact, setContact } = this.props;
            contact = contact.filter(c => c !== this.state.user.id);
            console.log(contact);
            setContact(contact)
        }
    }


    render() {
        const { user } = this.state

        if (!user) {
            return null;
        }

        const { me, contact } = this.props;
        let button = null;
        if (me) {

            if (contact.includes(user.id)) {
                button = <button className='btn btn-primary' onClick={this.removeFromContact}>从好友列表移除</button>
            } else {
                button = <button className='btn btn-primary' onClick={this.addToContact}>加为好友</button>
            }
        }

        return (
            <div className="page text-center">
                <h3 className='mb-3'>{user.username}</h3>
                {user ? <p className='mb-4'>{user.intro}</p> : null}
                <div className="d-flex justify-content-center mb-3">
                    <Portrait id={user.id} avatar={true} />
                </div>
                <div className="w-100 d-flex justify-content-center">
                    {button}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        me: state.info.user,
        contact: state.info.contact
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setContact: (contact) => { dispatch({ type: 'SET-CONTACT', contact }) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(User));