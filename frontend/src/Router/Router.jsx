import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../Pages/Home'
import Signup from '../Pages/Signup'
import Login from '../Pages/Login'
import Profile from '../Pages/Profile'
import Setting from '../Pages/Setting'
import useAuth from '../Store/useAuthStore'

const Router = () => {
    const { user } = useAuth();
    
    return (
        <Routes>
            <Route path='/' element={user ? <Home /> : <Navigate to='/login' />} />
            <Route path='/signup' element={!user ? <Signup /> : <Navigate to='/' />} />
            <Route path='/login' element={!user ? <Login /> : <Navigate to='/' />} />
            <Route path='/profile' element={user ? <Profile /> : <Navigate to='/login' />} />
            <Route path='/settings' element={<Setting />} />
        </Routes>
    )
}

export default Router