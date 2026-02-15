import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useDropzone } from 'react-dropzone';
import { FaCamera } from 'react-icons/fa';

const Profile = () => {
    const { user, login } = useAuth(); // We might need to update user in context after edit
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [profilePic, setProfilePic] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await api.post('/app/user', formData); // Specification says POST for update
            const token = response.data?.refreshToken;
            const user = JSON.parse(atob(token.split('.')[1]));
            login(token, user);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            console.error("Profile update error", err);
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    // Profile Picture Upload
    const onDrop = async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;
        const file = acceptedFiles[0];

        const formData = new FormData();
        formData.append('profile_pic', file); // API Spec: PUT /app/user/upload

        try {
            // Optimistically show the image? Or wait.
            setLoading(true);
            const response = await api.put('/app/user/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Update user context with new profile pic url
            const token = response.data?.refreshToken;
            const user = JSON.parse(atob(token.split('.')[1]));
            login(token, user);
            setMessage({ type: 'success', text: 'Profile picture updated!' });
        } catch (err) {
            console.error("Profile pic upload error", err);
            setMessage({ type: 'error', text: 'Failed to upload profile picture.' });
        } finally {
            setLoading(false);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1
    });

    return (
        <div className="container py-5" style={{ padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>My Profile</h2>

            <div className="card bg-white border border-gray-200 rounded-lg p-6 shadow-sm" style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>

                {/* Profile Picture Section */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                    <div {...getRootProps()} style={{ position: 'relative', cursor: 'pointer' }}>
                        <input {...getInputProps()} />
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {user?.profile_pic ? (
                                <img src={`${import.meta.env.VITE_API_URL}assets/profile/${user.profile_pic}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ fontSize: '2rem', fontWeight: 600 }}>{user?.firstName?.[0]}</span>
                            )}
                        </div>
                        <div style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                            <FaCamera size={14} />
                        </div>
                    </div>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tap to change photo</p>
                </div>

                {message.text && (
                    <div style={{
                        padding: '10px',
                        borderRadius: 'var(--radius)',
                        marginBottom: '1rem',
                        backgroundColor: message.type === 'success' ? '#d1e7dd' : '#f8d7da',
                        color: message.type === 'success' ? '#0f5132' : '#842029',
                        textAlign: 'center'
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleUpdateProfile}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="input-group">
                            <label className="input-label" htmlFor="first_name">First Name</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                className="input-field"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label" htmlFor="last_name">Last Name</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                className="input-field"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="input-field"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
