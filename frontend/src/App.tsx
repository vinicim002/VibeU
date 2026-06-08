import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext'
import { AppRoutes } from '@/routes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
})

function AppToasts() {
  const { theme } = useTheme()
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      theme={theme}
    />
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <AppToasts />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
