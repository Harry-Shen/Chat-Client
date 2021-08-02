import React, { Component } from 'react'

import { getGroup, ENDPOINT } from '../utils';
import user_pool from '../data/UserPool';


export default class GroupImg extends Component {
    constructor(props) {
        super(props)
        this.state = {
            members: []
        }
        this.mounted = true;
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.id !== this.props.id) {
            this.loadData();
        }
    }

    async loadData() {
        const group = await getGroup(this.props.id);
        const members = await user_pool.getUsers(group.member_ids);
        if (this.mounted) {
            this.setState({ members })
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        let members = this.state.members.slice(0, 4);
        return (
            <div className='group-image'>
                {members.map(m => <img src={ENDPOINT + '/profile/' + m.profile} alt={m.nickname} key={m.id} />)}
            </div>
        )
    }
}
