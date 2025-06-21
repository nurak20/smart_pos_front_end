import React, { useState } from 'react';
import './form.css'; // Make sure this file has the styles provided below
import { loginAccount } from '../../api/UserApi';
import { encryptData } from '../../cryptoJs/Crypto';
import Cookies from 'js-cookie';

const Login = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('owner'); // To handle tab switching

    const secretKey = "kans983(*93849Jnjsbd@*^@knskldn&^@($*LLjbHHSDuBKJ_)93849uIHUSHD&#%#&^$(@80928()*&*#$&(*";

    const handleUsernameChange = (e) => {
        setUserName(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const obj = { username, password };
        loginAccount(obj)
            .then((response) => {
                const encryptedUser = encryptData(response.data, secretKey);
                Cookies.set("user-data", encryptedUser);
                Cookies.set("user_id", response.data.userId);
                location.reload();
            })
            .catch((error) => {
                alert(error.message);
            });
    };

    return (
        <div className="login-container">
            {/* Header / Logo */}
            <div className="header">
                <div>
                    <h1 className="logo">SoftWare Cambodia </h1>
                    <p className="tagline">Restaurant Managerment System POS </p>
                </div>
            </div>

            {/* Login Tabs */}
            <div className="tabs ">
                <div className='d-flex box-shadow w-100' style={{ maxWidth: '1000px' }}>
                    <button
                        className={`tab ${activeTab === 'owner' ? 'active' : ''}`}
                        onClick={() => setActiveTab('owner')}
                    >
                        Login as Owner
                    </button>
                    <button
                        className={`tab ${activeTab === 'employee' ? 'active' : ''}`}
                        onClick={() => setActiveTab('employee')}
                    >
                        Login as Employee
                    </button>
                </div>
            </div>

            {/* Form Section */}
            <div className='w-100 center'>
                <form className="form" onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder={activeTab === 'owner' ? 'Company ID or Owner email' : 'Employee email'}
                        className="input"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                    <div className="password-container">
                        <input
                            type="password"
                            placeholder="Password"
                            className="input"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <button type="submit" className="login-btn box-shadow">Login</button>
                </form>
            </div>

            {/* Footer Links */}
            <div className='w-100 center'>
                <div className="footer-links ">
                    <div>
                        <a href="/signup">Help ?</a> <br />
                    </div>
                    <div>
                        <a href="/forgot-password">Forgot Password?</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
