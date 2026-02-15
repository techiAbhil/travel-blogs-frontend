import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up"
                style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', width: '100%', maxWidth: '500px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                <div className="flex justify-between items-center p-4 border-b"
                    style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="text-lg font-semibold" style={{ fontSize: '1.25rem', margin: 0 }}>{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                        <FaTimes />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto" style={{ padding: '1.5rem', overflowY: 'auto' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
