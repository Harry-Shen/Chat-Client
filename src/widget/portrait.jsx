import { useState, useEffect } from 'react'

import user_pool from '../data/UserPool';

import { ENDPOINT } from '../utils'

export default function Portrait({ id, avatar }) {
    const [user, setUser] = useState(null);
    useEffect(() => {
        let mounted = true;
        user_pool.getUser(id).then(user => {
            if (user && mounted) {
                setUser(user)
            }
        })
        return () => mounted = false;
    }, [id])

    if (!user || !user.profile) {
        return (<div className="portrait-wrapper"></div>)
    }
    return (
        <div className={`portrait-wrapper ${avatar ? 'avatar' : ''}`}>
            <img className="portrait" src={ENDPOINT + '/profile/' + user.profile} alt="portrait" />
        </div>
    )
}
