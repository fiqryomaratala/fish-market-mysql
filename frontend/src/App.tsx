import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import { router } from '@/routes'

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          className: 'rounded-xl',
        }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
