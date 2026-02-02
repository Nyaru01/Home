import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Gift, CheckSquare, User } from 'lucide-react';
import UserAvatar from './UserAvatar';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass sticky top-0 z-50 border-b">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                    FamilyQuest
                </Link>

                {user && (
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors">
                            <LayoutDashboard size={20} />
                            <span className="hidden sm:inline">Dashboard</span>
                        </Link>

                        <div className="flex items-center gap-3 bg-white/50 px-3 py-1.5 rounded-2xl border border-primary-100">
                            <UserAvatar name={user.name} role={user.role} size="sm" />
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">{user.name}</span>
                                <span className="text-xs text-primary-600 font-bold">{user.points} pts</span>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
