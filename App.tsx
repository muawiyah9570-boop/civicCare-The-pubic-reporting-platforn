
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthState, User, UserRole } from './types';
import { db } from './services/dbService';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportIssue from './pages/ReportIssue';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuthorityDashboard from './pages/AuthorityDashboard';
import Schemes from './pages/Schemes';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const savedSession = sessionStorage.getItem('civiccare_session');
    if (savedSession) {
      setAuth({ user: JSON.parse(savedSession), isAuthenticated: true });
    }
  }, []);

  const handleLogin = (user: User) => {
    sessionStorage.setItem('civiccare_session', JSON.stringify(user));
    setAuth({ user, isAuthenticated: true });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('civiccare_session');
    setAuth({ user: null, isAuthenticated: false });
  };

  const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: UserRole }) => {
    if (!auth.isAuthenticated) return <Navigate to="/login" />;
    if (role && auth.user?.role !== role) {
      const target = auth.user?.role === UserRole.ADMIN ? '/admin' : 
                     auth.user?.role === UserRole.AUTHORITY ? '/authority' : '/dashboard';
      return <Navigate to={target} />;
    }
    return <>{children}</>;
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar user={auth.user} onLogout={handleLogout} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home user={auth.user} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route path="/schemes" element={<Schemes />} />
            
            <Route path="/report" element={
              <ProtectedRoute role={UserRole.CITIZEN}>
                <ReportIssue user={auth.user!} />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute role={UserRole.CITIZEN}>
                <UserDashboard user={auth.user!} />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute role={UserRole.ADMIN}>
                <AdminDashboard user={auth.user!} />
              </ProtectedRoute>
            } />
            <Route path="/authority" element={
              <ProtectedRoute role={UserRole.AUTHORITY}>
                <AuthorityDashboard user={auth.user!} />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="border-t border-white/5 py-8 mt-12 bg-slate-950/50 backdrop-blur-md">
          <div className="container mx-auto px-4 text-center">
            <p className="text-slate-500 text-sm">© {new Date().getFullYear()} CivicCare. Empowering Citizens through Smart Governance.</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

const Navbar = ({ user, onLogout }: { user: User | null, onLogout: () => void }) => {
  const navigate = useNavigate();
  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
            CC
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tight">Civic<span className="text-indigo-400">Care</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Reports</Link>
          <Link to="/schemes" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
            Gov Schemes
          </Link>
          {user ? (
            <>
              {user.role === UserRole.CITIZEN && (
                <>
                  <Link to="/report" className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">Report Issue</Link>
                  <Link to="/dashboard" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Dashboard</Link>
                </>
              )}
              <button onClick={() => { onLogout(); navigate('/login'); }} className="text-sm font-bold text-rose-400 hover:text-rose-300">Logout</button>
            </>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-white pt-2">Login</Link>
              <Link to="/register" className="px-5 py-2.5 bg-white text-slate-950 text-sm font-extrabold rounded-full hover:bg-slate-200 transition-all">Join Us</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default App;
