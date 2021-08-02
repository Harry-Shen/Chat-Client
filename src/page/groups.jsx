import React from 'react'
import { connect } from 'react-redux'
import { useHistory, Link } from 'react-router-dom';

import LoginOrRegister from '../widget/loginOrRegister';
import GroupImg from '../widget/groupImg';

function Groups(props) {
    const { user, groups } = props;
    const history = useHistory();

    const toGroup = (e, id) => {
        e.preventDefault();
        history.push(`/group/${id}`)
    }

    return (
        <div className="page">
            <div className="header">
                <h3 className='text-center'>聊天群</h3>
            </div>
            <div className="group-box">
                {user ? null : <LoginOrRegister />}
                {groups.map(g => {
                    return (
                        <Link to={`/msg?counterpart=${g.group_id}&group=true`} key={g.group_id}>
                            <div className='row mb-2'>
                                <div className="col-2">
                                    <GroupImg id={g.group_id} />
                                </div>
                                <div className="col-10 ">
                                    <div className="d-flex justify-content-between align-items-center pe-1 ps-1" style={{ height: '50px' }}>
                                        <div style={{ textTransform: 'capitalize' }}>{g.group_name}</div>
                                        <button className='btn btn-sm btn-outline-primary' onClick={(e) => { toGroup(e, g.group_id) }}>成员</button>
                                    </div>
                                    <div className="divider m-1"></div>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        user: state.info.user,
        groups: state.info.group
    }
}

export default connect(mapStateToProps, null)(Groups)
