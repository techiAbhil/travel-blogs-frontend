import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import BlogCard from '../components/BlogCard';
import { FaPlus, FaSearch } from 'react-icons/fa';
// Import modals (to be created)
import AddEditBlogModal from '../components/modals/AddEditBlogModal';
import ImageUploadModal from '../components/modals/ImageUploadModal';
import Modal from '../components/Modal';

const BlogList = () => {
    const { user } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal states
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);

    // Filter and Sort states
    const [filterType, setFilterType] = useState('all'); // 'all' or 'my'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    const [searchTerm, setSearchTerm] = useState('');

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/app/blog');
            setBlogs(response.data.blogs);
        } catch (err) {
            console.error("Error fetching blogs", err);
            setError('Failed to load blogs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);



    // Handlers
    const handleEdit = (blog) => {
        setSelectedBlog(blog);
        setIsEditOpen(true);
    };

    const handleUpload = (blog) => {
        setSelectedBlog(blog);
        setIsUploadOpen(true);
    };

    const handleDeleteClick = (blog) => {
        setSelectedBlog(blog);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedBlog) return;
        try {
            await api.delete(`/app/blog/${selectedBlog.blog_id}`);
            setBlogs(blogs.filter(b => b.blog_id !== selectedBlog.blog_id));
            setIsDeleteOpen(false);
            setSelectedBlog(null);
        } catch (err) {
            console.error("Error deleting blog", err);
            alert("Failed to delete blog: " + (err.response?.data?.message || err.message));
        }
    };


    const handleImagesUploaded = () => {
        // Refresh to get new images, or update locally if API returns updated blog
        fetchBlogs();
        setIsUploadOpen(false);
        setSelectedBlog(null);
    }

    const onCloseEditModal = (blog) => {
        if (blog) {
            fetchBlogs();
        }
        setIsEditOpen(false);
        setSelectedBlog(null);
    }

    const onCloseAddModal = (blog) => {
        if (blog) {
            fetchBlogs();
        }
        setIsAddOpen(false);
    }


    if (loading && blogs.length === 0) return <div className="loading-spinner"></div>;

    return (
        <div className="container py-4" style={{
            maxWidth: '960px',
            margin: '0 auto',
            position: 'relative',
            display: 'flex',
            gap: '2rem',
            alignItems: 'flex-start',
            marginTop: '2rem'
        }}>

            <div id="filters" style={{
                width: '300px',
                flexShrink: 0,
                position: 'sticky',
                top: '90px', // Adjust based on navbar height
                alignSelf: 'flex-start'
            }}>
                {blogs.length > 0 && (
                    <div style={{
                        padding: '1.5rem',
                        backgroundColor: 'var(--surface)',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Filters & Sort</h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Search by Place Name</span>
                            <input
                                type="text"
                                placeholder="e.g., Paris"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    padding: '0.6rem 1rem 0.6rem 32px', // Added padding for the icon
                                    borderRadius: 'var(--radius)',
                                    border: '1px solid var(--border)',
                                    outline: 'none',
                                    fontFamily: 'var(--font-main)',
                                    cursor: 'pointer',
                                    backgroundColor: 'var(--background)'
                                }}
                            />
                        </div>


                        {/* Radio Group: My Blogs vs All Blogs */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Show</span>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: filterType === 'all' ? 600 : 400 }}>
                                <input
                                    type="radio"
                                    name="blogFilter"
                                    checked={filterType === 'all'}
                                    onChange={() => setFilterType('all')}
                                    style={{ accentColor: 'var(--primary)' }}
                                />
                                All Blogs
                            </label>
                            {user && (
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: filterType === 'my' ? 600 : 400 }}>
                                    <input
                                        type="radio"
                                        name="blogFilter"
                                        checked={filterType === 'my'}
                                        onChange={() => setFilterType('my')}
                                        style={{ accentColor: 'var(--primary)' }}
                                    />
                                    My Blogs
                                </label>
                            )}
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} />

                        {/* Sort Dropdown */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Sort by Place</span>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                style={{
                                    padding: '0.6rem',
                                    borderRadius: 'var(--radius)',
                                    border: '1px solid var(--border)',
                                    outline: 'none',
                                    fontFamily: 'var(--font-main)',
                                    cursor: 'pointer',
                                    width: '100%',
                                    backgroundColor: 'var(--background)'
                                }}
                            >
                                <option value="asc">Name (A-Z)</option>
                                <option value="desc">Name (Z-A)</option>
                            </select>
                        </div>

                        <button
                            onClick={() => {
                                // No-op, just for visual feedback or we could trigger a toast "Applied"
                            }}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                backgroundColor: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius)',
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                marginTop: '0.5rem'
                            }}
                        >
                            Apply Filters
                        </button>
                    </div>
                )}
            </div>

            <div id="blogs" style={{ flex: '1', minWidth: '0' }}>
                {error && <div style={{ color: 'var(--primary)', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
                {blogs.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
                        <h3>No diaries found.</h3>
                        <p>Start your journey by adding a new post.</p>
                    </div>
                )}

                {blogs.map(blog => (
                    <BlogCard
                        key={blog.blog_id}
                        blog={blog}
                        isOwner={user?.user_id === blog.users?.user_id} // Assuming user object has id match
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                        onUpload={handleUpload}
                    />
                ))}
            </div>



            {/* Floating Action Button */}
            <button
                onClick={() => setIsAddOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 10px rgba(255, 56, 92, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    cursor: 'pointer',
                    zIndex: 100
                }}
            >
                <FaPlus />
            </button>

            {/* Modals */}
            <AddEditBlogModal
                isOpen={isAddOpen}
                onClose={onCloseAddModal}
                mode="create"
            />

            {selectedBlog && (
                <>
                    <AddEditBlogModal
                        isOpen={isEditOpen}
                        onClose={onCloseEditModal}
                        blog={selectedBlog}
                        mode="edit"
                    />

                    <ImageUploadModal
                        isOpen={isUploadOpen}
                        onClose={() => { setIsUploadOpen(false); setSelectedBlog(null); }}
                        onSuccess={handleImagesUploaded}
                        blog_id={selectedBlog.blog_id}
                    />

                    <Modal
                        isOpen={isDeleteOpen}
                        onClose={() => { setIsDeleteOpen(false); setSelectedBlog(null); }}
                        title="Delete Diary?"
                    >
                        <p>Are you sure you want to delete this travel diary? This action cannot be undone.</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button onClick={() => setIsDeleteOpen(false)} className="btn btn-ghost">Cancel</button>
                            <button onClick={handleDeleteConfirm} className="btn btn-primary" style={{ backgroundColor: 'red', border: 'none' }}>Delete</button>
                        </div>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default BlogList;
