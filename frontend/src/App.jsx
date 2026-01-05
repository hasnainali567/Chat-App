import React from 'react'
import Router from './Router/Router'
import Navbar from './Components/Navbar'
import useAuth from './Store/useAuthStore'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import useTheme from './Store/useThemeStore'

const App = () => {
  const { user, checkAuth, isCheckingAuth } = useAuth();
  const { theme } = useTheme();

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  if (isCheckingAuth && !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }
  return (
    <div data-theme={theme} >
      <Navbar />
      <Router />
      <Toaster />
    </div>
  )
}

export default App