import React from 'react'
import { connect } from "react-redux";
import { Link, withRouter } from 'react-router-dom';

import user_pool from '../data/UserPool'
import Portrait from '../widget/portrait';
import LoginOrRegister from '../widget/loginOrRegister';


class Contact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            friends: null
        }
        this.mounted = true;
    }

    async componentDidMount() {
        let friends = await user_pool.getUsers(this.props.friends);
        if (this.mounted) {
            friends = friends.sort((a, b) => {
                return a.nickname < b.nickname ? -1 : 1;
            });
            this.setState({ friends });
        }
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.friends !== this.props.friends) {
            const friends = await user_pool.getUsers(this.props.friends);
            if (this.mounted) this.setState({ friends });
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    toUser(e, id) {
        e.preventDefault()
        this.props.history.push(`/user/${id}`)
    }

    render() {
        const { friends } = this.state;

        return (
            <div className='page'>
                <div className="header">
                    <h3 className='text-center'>通讯录</h3>
                </div>
                <div className="contact-box">
                    {!this.props.user ? <LoginOrRegister /> : null}
                    {friends ? friends.map(friend => {
                        if (!friend) return null;
                        const { id, nickname } = friend
                        return (
                            <Link to={`msg?counterpart=${id}&group=false`} key={id}>
                                <div className='row mb-2' >
                                    <div className="col-2">
                                        <Portrait id={id} />
                                    </div>
                                    <div className="col-10">
                                        <div className="d-flex justify-content-between align-items-center pe-1 ps-1" style={{ height: '50px' }} >
                                            <div style={{ textTransform: 'capitalize' }}>{nickname}</div>
                                            <button className='btn btn-sm btn-outline-primary' onClick={(e) => this.toUser(e, id)}>查看</button>
                                        </div>
                                        <div className="divider m-1"></div>
                                    </div>

                                </div>
                            </Link>
                        )
                    }) : null}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        friends: state.info.contact,
        user: state.info.user
    }
}

export default connect(mapStateToProps, null)(withRouter(Contact))
