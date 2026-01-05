import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../Store/useChatStore';
import MessageSkeleton from './Skeletons/MessageSkeleton';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import useAuth from '../Store/useAuthStore';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

const ChatContainer = () => {

    const { messages, getMessages, isMessagesLoading, selectedUser } = useChatStore();
    const { user } = useAuth()
    const messageEndRef = useRef(null);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerImages, setViewerImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openViewer = (index, images) => {
        setViewerImages(images);
        setCurrentIndex(index);
        setViewerOpen(true);
    };


    useEffect(() => {
        if (selectedUser && selectedUser?._id) {
            getMessages(selectedUser._id);
        }
    }, [selectedUser, getMessages]);
    if (isMessagesLoading) {
        return <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <MessageSkeleton />
            <MessageInput />
        </div>
    }
    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`chat ${message.senderId === user._id ? "chat-end" : "chat-start"}`}
                        ref={messageEndRef}
                    >
                        <div className=" chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img
                                    src={
                                        message.senderId === user._id
                                            ? user.profilePic || "/avatar.png"
                                            : selectedUser.profilePic || "/avatar.png"
                                    }
                                    alt="profile pic"
                                />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">
                                {(new Date(message.createdAt)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                            </time>
                        </div>
                        <div className="chat-bubble flex flex-col gap-2">
                            {message.images && message.images.length > 0 && (
                                <div
                                    className="chat-image-box"
                                    onClick={() => openViewer(0, message.images)}
                                >
                                    <img src={message.images[0]} alt="Attachment" />

                                    {message.images.length > 1 && (
                                        <div className="count-layer">
                                            +{message.images.length - 1}
                                        </div>
                                    )}

                                </div>
                            )}

                            {message.text && <p>{message.text}</p>}
                        </div>

                    </div>
                ))}
            </div>
            {viewerOpen && (
                <div className="image-viewer">
                    <button className="close" onClick={() => setViewerOpen(false)}>✕</button>

                    <button
                        className="nav left"
                        onClick={() =>
                            setCurrentIndex(
                                currentIndex === 0
                                    ? viewerImages.length - 1
                                    : currentIndex - 1
                            )
                        }
                    >
                        ‹
                    </button>

                    <img src={viewerImages[currentIndex]} alt="" />

                    <button
                        className="nav right"
                        onClick={() =>
                            setCurrentIndex(
                                currentIndex === viewerImages.length - 1
                                    ? 0
                                    : currentIndex + 1
                            )
                        }
                    >
                        ›
                    </button>
                </div>
            )}


            <MessageInput />
        </div>
    )
}

export default ChatContainer