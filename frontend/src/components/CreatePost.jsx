import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/userContext';
import { X, Image, ArrowLeft } from 'lucide-react';

const CreatePost = ({ isOpen, onClose }) => {
    const { user, uploadPost } = useUser();
    const fileInputRef = useRef(null);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [caption, setCaption] = useState('');

    useEffect(() => {
        // Reset state when modal is closed
        if (!isOpen) {
            setImage(null);
            setPreview(null);   
            setCaption('');
        }
    }, [isOpen]);

    const handleFileSelectClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handlePostSubmit = async () => {
        if (!image) return;
        const formData = new FormData();
        formData.append('image', image);
        formData.append('caption', caption);

        try {
            await uploadPost(formData);
            onClose(); // Close modal on success
        } catch (error) {
            console.error('Failed to create post:', error);
            // Optionally, show an error message to the user
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[70vh] transform transition-all flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between text-center border-b border-gray-300 py-3 px-4">
                    {preview && <button onClick={() => { setPreview(null); setImage(null); }} className="text-gray-600 hover:text-black"><ArrowLeft size={24} /></button>}
                    <h3 className="font-semibold flex-grow text-center">{preview ? 'Create new post' : 'Select a file'}</h3>
                    {preview && <button onClick={handlePostSubmit} className="text-blue-500 font-bold hover:text-blue-700">Share</button>}
                </div>

                {!preview ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-16">
                        <Image size={80} strokeWidth={1} className="text-gray-400 mb-4" />
                        <p className="text-xl text-gray-700 mb-4">Drag photos and videos here</p>
                        <button
                            className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                            onClick={handleFileSelectClick}
                        >
                            Select from computer
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*,video/*"
                        />
                    </div>
                ) : (
                    <div className="flex flex-grow h-full overflow-hidden">
                        <div className="w-2/3 bg-black flex items-center justify-center">
                            <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="w-1/3 flex flex-col p-4">
                            <div className="flex items-center mb-4">
                                <img src={user?.profilePicture || user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || user?.userName}&size=28`} alt="User" className="w-7 h-7 rounded-full mr-3" />
                                <span className="font-semibold">{user?.userName || user?.name}</span>
                            </div>
                            <textarea
                                className="w-full flex-grow resize-none border-none focus:outline-none text-base"
                                placeholder="Write a caption..."
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>
            <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-200">
                <X size={28} />
            </button>
        </div>
    );
};

export default CreatePost;
