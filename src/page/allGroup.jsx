import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'

import { fetch_ } from '../utils'

class AllGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: []
        }
    }

    async componentDidMount() {
        const res = await fetch_('/all-group');
        if (res.success) {
            this.setState({ groups: res.groups })
        }
    }

    inGroup(id) {
        for (let i = 0; i < this.props.groups.length; i++) {
            const group = this.props.groups[i];
            if (group.group_id === id) {
                return true;
            }
        }
        return false;
    }

    render() {
        return (
            <div className='page'>
                <div className="header">
                    <h3 className='text-center'>群列表</h3>
                </div>
                <div className="box groups">
                    {this.state.groups.map(g => {
                        return (
                            <Link to={`/group/${g.group_id}`} key={g.group_id} >
                                <div className='group-item'>
                                    <div >{g.group_name}</div>
                                    {this.inGroup(g.group_id) ? <div>已加入</div> : null}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        groups: state.info.group,
    }
}

export default connect(mapStateToProps, null)(AllGroup)
