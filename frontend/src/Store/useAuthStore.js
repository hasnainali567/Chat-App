import { create } from 'zustand'
import api from '../Lib/axios'
import toast from 'react-hot-toast';
const useAuth = create((set) => ({
    user: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],

    checkAuth: async () => {
        try {

            set({ isCheckingAuth: true });
            const res = await api.get('/auth/check-auth', {
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTU3ODNmNGZkYTE3Njg1NWFlM2Q5M2YiLCJlbWFpbCI6Imhhc25haW4yQGdtYWlsLmNvbSIsImZ1bGxOYW1lIjoiSGFzbmFpbiIsImlhdCI6MTc2NzU0NjI3NywiZXhwIjoxNzY3NTQ5ODc3fQ.K8wUsQlsNU5PGfsCiz8AOhJl4llRzXxaoRxVeIl-Mbs`,
                },
            });
            
            const { user } = res?.data?.data;

            set({ user, isCheckingAuth: false });

        } catch (error) {
            toast.error('Authentication check failed. Please log in.');
            set({ user: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    login: async (credentials) => {
        try {
            set({ isLoggingIn: true });
            const res = await api.post('/auth/login', credentials);
            const { user } = res?.data?.data;
            set({ user });
            toast.success('Login successful!');
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
            const { user } = res?.data?.data;
            if (user) toast.success('Signup successful! Please log in.');
            set({ user, isSigningUp: false });
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
        } catch (error) {
            console.error('Error during logout', error.response);
            toast.error(error.response?.data?.message || 'Logout failed. Please try again.');
        }
        
    },
}))

export default useAuth