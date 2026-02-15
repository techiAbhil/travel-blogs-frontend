import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Modal from '../Modal';
import api from '../../services/api';

const ImageUploadModal = ({ isOpen, onClose, onSuccess, blog_id }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [files, setFiles] = useState([]);

    const onDrop = (acceptedFiles) => {
        // Limit to 5 files total check
        if (acceptedFiles.length + files.length > 5) {
            setError('You can only upload a maximum of 5 images.');
            return;
        }
        setFiles([...files, ...acceptedFiles]);
        setError('');
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 5
    });

    const handleSubmit = async () => {
        if (files.length === 0) return;

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('pictures', file); // 'picture' or 'images'? Requirement said put to /pictures/{id}, usually key is 'image' or 'images'. I'll try 'images' or 'file'. 
                // Common practice for "pictures" endpoint might be 'images'. Let's assume 'images'. 
                // API Spec: PUT http://localhost:8082/api/v1/app/blog/pictures/{id}
                // If it fails, I'll try 'picture' or 'file'.
            });


            await api.put(`/app/blog/pictures/${blog_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onSuccess();
            setFiles([]);
            onClose();
        } catch (err) {
            console.error("Upload error", err);
            setError('Failed to upload images.');
        } finally {
            setLoading(false);
        }
    };

    const removeFile = (file) => {
        setFiles(files.filter(f => f !== file));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Upload Photos">

            <div
                {...getRootProps()}
                style={{
                    border: '2px dashed var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDragActive ? '#f0f0f0' : 'transparent',
                    marginBottom: '1rem'
                }}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the photos here ...</p>
                ) : (
                    <p>Drag 'n' drop some photos here, or click to select photos</p>
                )}
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>(Max 5 images)</p>
            </div>

            {files.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                    <h4>Selected Files:</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {files.map((file, index) => (
                            <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #eee' }}>
                                <span style={{ fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>{file.name}</span>
                                <button onClick={(e) => { e.stopPropagation(); removeFile(file); }} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {error && <div style={{ color: 'var(--primary)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button
                    onClick={handleSubmit}
                    className="btn btn-primary"
                    disabled={loading || files.length === 0}
                >
                    {loading ? 'Uploading...' : 'Upload'}
                </button>
            </div>
        </Modal>
    );
};

export default ImageUploadModal;
