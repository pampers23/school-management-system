import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import UserSessionContextProvider from './context/user-session-context.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserSessionContextProvider>
      <Toaster position="bottom-right" richColors duration={3000} />
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </UserSessionContextProvider>
  </StrictMode>,
)
