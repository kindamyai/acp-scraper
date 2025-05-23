import React from 'react'; import ReactDOM 
from 'react-dom/client'; import { 
BrowserRouter } from 'react-router-dom'; 
import { QueryClient, QueryClientProvider } 
from 'react-query'; import App from './App'; 
import './index.css';
// Create a client for react-query
const queryClient = new QueryClient({ 
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, 
      retry: 1,
    },
  },
});
ReactDOM.createRoot(document.getElementById('root')!).render( 
  <React.StrictMode>
    <BrowserRouter> <QueryClientProvider 
      client={queryClient}>
        <App /> </QueryClientProvider> 
    </BrowserRouter>
  </React.StrictMode>, );
