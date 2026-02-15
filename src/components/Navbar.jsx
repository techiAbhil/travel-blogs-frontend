import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) return null;

    return (
        <nav className="navbar glass">
            <div className="container navbar-content">
                <Logo />
                <div className="nav-links">
                    <NavLink
                        to="/blogs"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        Blogs
                    </NavLink>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        Profile ({user?.firstName || 'User'})
                    </NavLink>
                    <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '8px 16px' }}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
