import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../../public/logo.svg';
const Logo = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleClick = () => {
        if (isAuthenticated) {
            navigate('/blogs');
        } else {
            navigate('/login');
        }
    };

    return (
        <div onClick={handleClick} className="cursor-pointer font-bold text-xl text-primary tracking-wider" style={{ fontFamily: 'var(--font-heading, sans-serif)' }}>

            <div className="flex items-center gap-2">
                <img src={logo} alt="Logo" />
                <h4>Travel Diaries</h4>
            </div>
        </div>
    );
};

export default Logo;
