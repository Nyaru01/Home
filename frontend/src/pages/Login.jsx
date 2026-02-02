import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const Login = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(name, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message === 'Invalid credentials' ? 'Identifiants invalides' : 'Erreur de connexion');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50/50 p-4">
            <div className="max-w-md w-full glass p-8 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-500 border-white/50">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-gradient-to-tr from-primary-400 to-accent-400 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary-200/50 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                        <span className="text-4xl">🏰</span>
                    </div>
                    <h1 className="text-4xl font-[900] bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-3 tracking-tight">
                        FamilyQuest
                    </h1>
                    <p className="text-slate-500 font-medium">L'aventure commence ici !</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm mb-8 border border-red-100 flex items-center gap-2 animate-bounce-short">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 ml-1">Ton Nom de Héros</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                <User size={20} />
                            </span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/70 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 outline-none transition-all placeholder:text-slate-300"
                                placeholder="Ex: Lucas"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 ml-1">Mot de Passe Magique</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                <Lock size={20} />
                            </span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/70 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 outline-none transition-all placeholder:text-slate-300"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl shadow-xl shadow-primary-200 hover:shadow-primary-300 hover:scale-[1.02] active:scale-95 transition-all text-xl font-black">
                        C'est parti ! 🚀
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400 font-medium">
                        Astuce : Demande tes identifiants à tes parents.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
