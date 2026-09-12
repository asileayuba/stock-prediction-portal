import './assets/css/style.css';
import './assets/css/components.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider }  from './features/auth/AuthProvider';
import PrivateRoute      from './PrivateRoute';
import PublicRoute       from './PublicRoute';

import Header   from './components/layout/Header';
import Footer   from './components/layout/Footer';
import NewsTicker from './components/layout/NewsTicker';
import Home     from './features/Home';
import Login    from './features/auth/Login';
import Register from './features/auth/Register';
import Dashboard from './features/dashboard/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--color-surface-2)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              fontSize: '0.875rem',
              fontFamily: 'var(--font-sans)',
              boxShadow: 'var(--shadow-lg)',
            },
            success: {
              iconTheme: { primary: 'var(--color-positive)', secondary: 'var(--color-surface-2)' },
            },
            error: {
              iconTheme: { primary: 'var(--color-negative)', secondary: 'var(--color-surface-2)' },
              duration: 5000,
            },
          }}
        />
        <NewsTicker />
        <Header />
        <Routes>
          <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
