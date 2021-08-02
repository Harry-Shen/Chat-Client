import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
    const pages = [
        {
            path: '/',
            name: '对话',
            icon: 'dialog',
        },
        {
            path: '/contact',
            name: '通讯录',
            icon: 'friend'
        },
        {
            path: '/groups',
            name: '群',
            icon: 'group'
        },
        {
            path: '/me',
            name: '我',
            icon: 'settings'
        },
    ];
    const location = useLocation();

    return (
        <div className="navbar">
            {pages.map((page, i) => {
                let classCurrent = '';
                let { path, icon, name } = page;
                if (path === location.pathname) {
                    classCurrent = 'current-page';
                    icon += '-blue';
                }
                return (
                    <Link to={path} key={i}>
                        <div className="text-center">
                            <div><img src={"/img/" + icon + '.svg'} alt={icon} className='icon' /></div>
                            <div className={classCurrent} >{name}</div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
