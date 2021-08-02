import React from 'react';

import { fetch_ } from '../utils';

export default function Test() {
    const click = () => {
        fetch_(`/prev-msg?counterpart=10&user_id=1&is_group=0&latest=2021-07-28T12:16:53.188Z`)
    }

    return (
        <div>
            <button onClick={click}>test</button>
        </div>
    )
}
