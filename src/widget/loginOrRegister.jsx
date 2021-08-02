import React from 'react'
import { Link } from 'react-router-dom'

export default function LoginOrRegister() {
    return (
        <div className='text-center mt-4'>
            <p>请登录使用全部功能</p>
            <Link className='me-4' to='/login'>登录</Link>
            <Link to='/register'>注册</Link>
        </div>
    )
}
