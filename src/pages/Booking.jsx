import React from 'react';
import { useLocation } from 'react-router-dom';

const Booking = () => {
    const location = useLocation();
    const { blog } = location.state || {};

    if (!blog) {
        return (
            <div className="container" style={{ padding: '40px', textAlign: 'center' }}>
                <h2>No blog details found. Please go back and select a trip.</h2>
            </div>
        );
    }

    const handleConfirm = () => {
        console.log("Confirming trip for blog:", blog);
        alert(`Trip to ${blog.place_name} confirmed! Check console for details.`);
    };

    return (
        <div className="container" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <div className="card glass" style={{ padding: '40px', borderRadius: 'var(--radius)', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
                <h1 style={{ marginBottom: '24px', color: 'var(--text-main)' }}>
                    Book your trip today to <span style={{ color: 'var(--primary)' }}>{blog.place_name}</span>
                </h1>

                <div style={{ marginBottom: '32px', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    <p>Experience the beauty of {blog.place_name} as described by {blog.users?.first_name}.</p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleConfirm}
                    style={{ padding: '16px 32px', fontSize: '1.2rem', boxShadow: '0 4px 14px 0 rgba(255, 56, 92, 0.39)' }}
                >
                    Pay Now & Confirm my seat today!
                </button>
            </div>
        </div>
    );
};

export default Booking;
