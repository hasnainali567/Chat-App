import React, { useRef, useState } from 'react'
import { useChatStore } from '../Store/useChatStore';
import { Send, X, Image } from 'lucide-react';
import toast from 'react-hot-toast';

const MessageInput = () => {
    const [text, setText] = useState('');
    const [imagesPreview, setImagesPreview] = useState('');
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
    const { sendMessage } = useChatStore();

    const handleImagesUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 3) {
            toast.error('You can upload a maximum of 3 images.');
            return;
        }
        const images = files.map((file) => URL.createObjectURL(file));
        setImagesPreview(images);
        setFiles(files);
    };

    const removeImage = (index) => {
        const newImages = imagesPreview.filter((_, i) => i !== index);
        setImagesPreview(newImages);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (!text.trim() && !imagesPreview) return;
        if(text) formData.append('text', text)
        if(files.length) {
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i]);
            }
        }
        sendMessage(formData).then(() => {
            setText('');
            setImagesPreview('');
            setFiles([]);
        })
    }

    return (
        <div className='p-4 w-full'>
            {imagesPreview && (
                <div className="mb-3 flex items-center gap-2">
                    {imagesPreview.map((image, index) => (
                        <div key={index} className="relative">
                            <img
                                src={image}
                                alt={`Image ${index}`}
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                className="absolute top-0 right-0 btn btn-circle btn-sm"
                                onClick={() => { removeImage(index) }}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}


            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 flex gap-2">
                    <input
                        type="text"
                        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        multiple={true}
                        ref={fileInputRef}
                        onChange={handleImagesUpload}
                    />

                    <button
                        type="button"
                        className={`hidden sm:flex btn btn-circle
                     ${imagesPreview ? "text-emerald-500" : "text-zinc-400"}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image size={20} />
                    </button>
                </div>
                <button
                    type="submit"
                    className="btn btn-sm btn-circle"
                    disabled={!text.trim() && !imagesPreview}
                >
                    <Send size={22} />
                </button>
            </form>
        </div >
    )
}

export default MessageInput