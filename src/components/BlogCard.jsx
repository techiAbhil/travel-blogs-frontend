import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaCamera, FaChevronLeft, FaChevronRight, FaMapMarkerAlt } from 'react-icons/fa';
// Simple user avatar placeholder if none provided
const UserAvatar = ({ name, url }) => {
    // If no url, use initials
    const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';

    return (
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', flexShrink: 0 }}>
            {url ? (
                <img src={`${import.meta.env.VITE_API_URL}assets/profile/${url}`} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
                <span style={{ fontSize: '12px', fontWeight: 600 }}>{initials}</span>
            )}
        </div>
    );
}

const BlogCard = ({ blog, onEdit, onDelete, onUpload, isOwner }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();

    const nextImage = () => {
        if (blog.pictures && blog.pictures.split(',').length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % blog.pictures.split(',').length);
        }
    };

    const prevImage = () => {
        if (blog.pictures && blog.pictures.split(',').length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + blog.pictures.split(',').length) % blog.pictures.split(',').length);
        }
    };

    const hasImages = blog.pictures && blog.pictures.split(',').length > 0;

    return (
        <div className="card bg-white border border-gray-200 rounded-lg mb-8 shadow-sm"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: '2rem', overflow: 'hidden' }}>

            {/* Header */}
            <div className="flex items-center p-3" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center' }}>
                <UserAvatar name={blog.users?.first_name + ' ' + blog.users?.last_name} url={blog.users?.profile_pic} />
                <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                        {blog.users?.first_name} {blog.users?.last_name}
                    </div>
                    {blog.place_name && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
                            <FaMapMarkerAlt size={10} style={{ marginRight: '4px' }} /> {blog.place_name}
                        </div>
                    )}
                </div>
            </div>

            {/* Image Carousel */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {hasImages ? (
                    <>
                        <img
                            src={`${import.meta.env.VITE_API_URL}assets/images/${blog.pictures.split(', ')[currentImageIndex]}`}
                            alt={`Blog ${blog.blog_id}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {blog.pictures.split(', ').length > 1 && (
                            <>
                                <button onClick={prevImage} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><FaChevronLeft /></button>
                                <button onClick={nextImage} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><FaChevronRight /></button>
                                {/* Dots indicator */}
                                <div style={{ position: 'absolute', bottom: '10px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '5px' }}>
                                    {blog.pictures.split(', ').length > 1 && blog.pictures.split(', ').map((_, idx) => (
                                        <div key={idx} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: idx === currentImageIndex ? 'var(--primary)' : 'rgba(255,255,255,0.7)' }}></div>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
                        <FaCamera size={48} style={{ opacity: 0.2, marginBottom: '10px' }} />
                        <p>No images uploaded</p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border)', minHeight: '52px' }}>
                <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                    {isOwner && (
                        <>
                            <button onClick={() => onEdit(blog)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', fontSize: '1.2rem' }} title="Edit Blog">
                                <FaEdit />
                            </button>
                            <button onClick={() => onUpload(blog)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', fontSize: '1.2rem' }} title="Upload Images">
                                <FaCamera />
                            </button>
                        </>
                    )}
                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/booking', { state: { blog } })}
                    style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: '600' }}
                >
                    Make my trip
                </button>

                <div style={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
                    {isOwner && (
                        <button onClick={() => onDelete(blog)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: '1.2rem' }} title="Delete Blog">
                            <FaTrash />
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '12px 16px' }}>
                {/* Like section could go here */}
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
                    <span style={{ fontWeight: 600, marginRight: '6px' }}>{blog.user?.firstName}</span>
                    {blog.review}
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px', textTransform: 'uppercase' }}>
                    {/* Date placeholder if API provided it */}
                    POSTED RECENTLY
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
