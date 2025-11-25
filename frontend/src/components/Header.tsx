import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, LayoutDashboard, LogOut, BookOpen } from 'lucide-react';

interface HeaderProps {
    token: string;
    role: string;
    onLogout: () => void;
}

export function Header({ token, role, onLogout }: HeaderProps) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                >
                    <img src="/logo.png" alt="IGDTUW" className="w-10 h-10 rounded-full" />
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        IGDTUW EDUHub
                    </h1>
                </button>

                <nav className="flex items-center space-x-4">
                    {!token ? (
                        // Not logged in
                        <button
                            onClick={() => navigate('/auth')}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <LogIn className="w-4 h-4" />
                            <span>Login</span>
                        </button>
                    ) : (
                        // Logged in
                        <>
                            <button
                                onClick={() => navigate('/resources')}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <BookOpen className="w-4 h-4" />
                                <span>Resources</span>
                            </button>

                            {(role === 'ADMIN' || role === 'MOD') && (
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span>Dashboard</span>
                                </button>
                            )}

                            <button
                                onClick={onLogout}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
