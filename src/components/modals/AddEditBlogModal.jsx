import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import api from '../../services/api';

const AddEditBlogModal = ({ isOpen, onClose, blog, mode = 'create' }) => {
    const [place_name, setPlaceName] = useState('');
    const [review, setReview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (mode === 'edit' && blog) {
            setPlaceName(blog.place_name || '');
            setReview(blog.review || '');
        } else {
            setPlaceName('');
            setReview('');
        }
        setError('');
    }, [mode, blog, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let response;
            if (mode === 'create') {
                response = await api.post('/app/blog', { place_name, review });
            } else {
                response = await api.put(`/app/blog/${blog.blog_id}`, { place_name, review });
            }
            onClose(response.data.blog);
        } catch (err) {
            console.error("Error saving blog", err);
            setError('Failed to save blog. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={mode === 'create' ? 'New Travel Diary' : 'Edit Diary'}
        >
            {error && <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label className="input-label" htmlFor="header">Place Name</label>
                    <input
                        type="text"
                        id="header"
                        className="input-field"
                        value={place_name}
                        onChange={(e) => setPlaceName(e.target.value)}
                        required
                        placeholder="e.g. Kyoto, Japan"
                    />
                </div>

                <div className="input-group">
                    <label className="input-label" htmlFor="content">Review</label>
                    <textarea
                        id="content"
                        className="input-field"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        required
                        placeholder="Share your experience..."
                        rows={5}
                        style={{ resize: 'vertical' }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (mode === 'create' ? 'Post' : 'Update')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddEditBlogModal;
