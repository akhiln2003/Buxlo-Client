import { RouterProvider } from 'react-router-dom'
import routes from '@/routes/routes';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './contexts/themeContext';

function App() {
  return (
    <ThemeProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID} >
        <RouterProvider router={routes} />
        <Toaster />
      </GoogleOAuthProvider>
    </ThemeProvider>
  )
}

export default App