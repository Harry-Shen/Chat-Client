import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { Component } from 'react'

import { fetch_, getGroup } from '../utils'

import Portrait from '../widget/portrait'

class Group extends Component {
    constructor(props) {
        super(props)
        const idRegx = /^\/group\/([0-9]+)$/;
        const match = props.location.pathname.match(idRegx);
        const id = match ? Number(match[1]) : null;
        this.state = {
            id: id,
            member_ids: [],
            group_name: ''
        }
        this.mounted = true;
    }

    componentDidMount() {
        this.loadMembers();
    }

    async loadMembers() {
        if (!this.mounted || !this.state.id) return;
        const group = await getGroup(this.state.id)
        console.log("loadMembers", group);
        const { member_ids, group_name } = group
        this.setState({ ...this.state, member_ids, group_name });
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    leave = () => {
        fetch_(`/leave-group/${this.state.id}`, 'delete').then(res => {
            if (res.success && this.mounted) {
                this.loadMembers();
                this.props.leaveGroup(this.state.id);
            }
        })
    }

    join = () => {
        fetch_(`/join-group/${this.state.id}`, 'post').then(res => {
            if (res.success && this.mounted) {
                this.loadMembers();
                this.props.joinGroup(res.group);
            }
        });
    }

    render() {
        const { id, member_ids, group_name } = this.state;
        const { groups, user } = this.props;
        if (!id) return null;

        let button = null;
        if (user) {
            if (inGroup(id, groups)) {
                button = <button className='btn btn-primary' onClick={this.leave}>离开群</button>
            } else {
                button = <button className='btn btn-primary' onClick={this.join}> 加入群</button >;
            }
        }

        return (
            <div className='page'>
                <div className="header">
                    <h3 className='text-center' style={{ textTransform: 'capitalize' }}>{group_name}</h3>
                </div>
                <div className="text-center m-3">
                    {button}
                </div>

                <div className="ms-3">成员:</div>
                <div className="group-portraits">
                    {member_ids.map(id => {
                        return (
                            <Link to={`/user/${id}`} className='me-2' key={id}>
                                <Portrait id={id} key={id} />
                            </Link>
                        )
                    })}
                </div>
            </div>
        )
    }
}

function inGroup(group_id, user_groups) {
    for (let i = 0; i < user_groups.length; i++) {
        const group = user_groups[i];
        if (group.group_id === group_id) return true;
    }
    return false;
}

function mapStateToProps(state) {
    return {
        user: state.info.user,
        groups: state.info.group
    }
}

function mapPropsToDispatch(dispatch) {
    return {
        leaveGroup: (group_id) => { dispatch({ type: 'LEAVE-GROUP', group_id }) },
        joinGroup: (group) => { dispatch({ type: 'JOIN-GROUP', group }) }
    }
}

export default connect(mapStateToProps, mapPropsToDispatch)(withRouter(Group))
