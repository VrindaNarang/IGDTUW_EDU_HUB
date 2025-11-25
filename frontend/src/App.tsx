import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Resources } from './pages/Resources';
import { Dashboard } from './pages/Dashboard';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [role, setRole] = useState(localStorage.getItem('role') || '');

    const handleLogin = (newToken: string, newRole: string) => {
        setToken(newToken);
        setRole(newRole);
        localStorage.setItem('token', newToken);
        localStorage.setItem('role', newRole);
    };

    const handleLogout = () => {
        setToken('');
        setRole('');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    };

    return (
        <Router>
            <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30">
                <Header
                    token={token}
                    role={role}
                    onLogout={handleLogout}
                />

                <Routes>
                    {/* Public Landing Page */}
                    <Route path="/" element={<Home />} />

                    {/* Auth Page */}
                    <Route path="/auth" element={<Auth onLogin={handleLogin} />} />

                    {/* Protected Resources Page - Requires login */}
                    <Route
                        path="/resources"
                        element={token ? <Resources /> : <Navigate to="/auth" />}
                    />

                    {/* Protected Dashboard - Only for MOD/ADMIN */}
                    <Route
                        path="/dashboard"
                        element={
                            token && (role === 'ADMIN' || role === 'MOD')
                                ? <Dashboard token={token} role={role} />
                                : <Navigate to="/auth" />
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
