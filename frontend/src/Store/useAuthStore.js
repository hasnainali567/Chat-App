import { create } from 'zustand'
import api from '../Lib/axios'
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3000' : '/';
const useAuth = create((set, get) => ({
    user: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket : null,

    checkAuth: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                set({ isCheckingAuth: false });
                return;
            }
            set({ isCheckingAuth: true });
            const res = await api.get('/auth/check-auth', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            const { user } = res?.data?.data;

            set({ user, isCheckingAuth: false });
            get().connectSocket();

        } finally {
            set({ isCheckingAuth: false });
        }
    },

    login: async (credentials) => {
        try {
            set({ isLoggingIn: true });
            const res = await api.post('/auth/login', credentials);
            const { user, token } = res?.data?.data;
            localStorage.setItem('token', token);
            set({ user });
            toast.success('Login successful!');
            get().connectSocket();
        } catch (error) {
            set({ user: null });
            toast.error(error.response?.data?.errors || 'Login failed. Please try again.');
            console.error(error);
        } finally {
            set({ isLoggingIn: false });
        }
        // Simulate an API call
    },

    signup: async (userInfo) => {
        try {
            set({ isSigningUp: true });
            const res = await api.post('/auth/signup', userInfo);
            const { user, token } = res?.data?.data;
            if (user) toast.success('Signup successful! Please log in.');
            localStorage.setItem('token', token);
            set({ user, isSigningUp: false });
            get().connectSocket();
        } catch (error) {
            set({ isSigningUp: false });
            set({ user: null });
            toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
            console.error(error);
        }
    },
    updateProfile: async (profileData) => {
       try {
         set({ isUpdatingProfile: true });
            const res = await api.put('/auth/update-profile', profileData, {
                headers : {
                    'Content-Type': 'multipart/form-data',
                }
            });
            const { user } = res?.data?.data;
            if (user) toast.success('Profile updated successfully!');
            set({ user, isUpdatingProfile: false });
       } catch (error) {
            toast.error(error.response?.data?.errors || 'Profile update failed. Please try again.');
            console.error(error);
            set({ isUpdatingProfile: false });
       }
        // Simulate an API call
    },

    logout: async () => {
        try {
            const res = await api.get('/auth/logout');
            toast.success(res?.data?.message || 'Logged out successfully');
            set({ user: null });
            get().disConnectSocket();
        } catch (error) {
            console.error('Error during logout', error.response);
            toast.error(error.response?.data?.message || 'Logout failed. Please try again.');
        }
        
    },

    connectSocket: () => {
        const {user} = get();
        if(!user || get().socket?.connected) return; 
        const socket = io(BASE_URL, {
            query: { userId: user._id }
        });
        socket.connect();
        set({ socket });

        socket.on('getOnlineUsers', (onlineUsers) => {
            set({ onlineUsers });
            
        });
    },

    disConnectSocket: () => {
        const {socket} = get();
        if(socket && socket.connected){
            socket.disconnect();
            set({socket: null});
        }
    }
}))

export default useAuth