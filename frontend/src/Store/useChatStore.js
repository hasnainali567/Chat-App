import { create } from 'zustand';
import api from '../Lib/axios';
import { toast } from 'react-hot-toast';


export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    isUsersLoading: true,
    selectedUser: null,
    isMessagesLoading: false,

    getUsers: async () => {
        try {
            set({ isUsersLoading: true });
            const response = await api.get('/message/users');


            set({ users: response.data?.data, isUsersLoading: false });
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error(error.response.data.errors || 'Failed to fetch users');
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (id) => {
        set({ isMessagesLoading: true });
        try {
            const response = await api.get(`/message/${id}`);

            set({ messages: response.data?.data, isMessagesLoading: false });
        } catch (error) {
            console.error(error.response);
            toast.error(error.response.data.errors || 'Failed to fetch messages');
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (data) => {
        try {
            const { messages, selectedUser } = get()
            const res = await api.post(`/message/send/${selectedUser._id}`, data, {
                headers :{
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(res.data);
            
            set({ messages: [...messages, res.data?.data] });
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.errors || 'Failed to send message');
            throw error;
        }
    },

    setSelectedUser: (user) => {
        set({ selectedUser: user });
    }
}));