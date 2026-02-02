import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import {
    CheckCircle, Clock, AlertCircle, Plus, Gift,
    ShoppingBag, CheckSquare, Lock, Settings,
    Star, Trophy, Sparkles, Heart
} from 'lucide-react';
import TaskModal from '../components/TaskModal';
import RewardModal from '../components/RewardModal';
import UserAvatar from '../components/UserAvatar';

const Dashboard = () => {
    const { user, setUser } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

    // Admin Protection
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [tasksRes, rewardsRes] = await Promise.all([
                api.get('/tasks'),
                api.get('/rewards')
            ]);
            setTasks(tasksRes.data);
            setRewards(rewardsRes.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTaskStatusUpdate = async (taskId, newStatus) => {
        try {
            await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
            const [tasksRes, usersRes] = await Promise.all([
                api.get('/tasks'),
                api.get(`/users/${user.id}`)
            ]);
            setTasks(tasksRes.data);
            setUser({ ...user, points: usersRes.data.current_points });
        } catch (error) {
            alert('Erreur lors de la mise à jour de la tâche : ' + (error.response?.data?.message || error.message));
        }
    };

    const handlePurchaseReward = async (rewardId) => {
        try {
            const response = await api.post(`/rewards/${rewardId}/purchase`);
            alert('Félicitations ! Cadeau débloqué ! 🎉');
            const usersRes = await api.get(`/users/${user.id}`);
            setUser({ ...user, points: usersRes.data.current_points });
        } catch (error) {
            alert('Erreur : ' + (error.response?.data?.message || error.message));
        }
    };

    const handleAdminAuth = (e) => {
        e.preventDefault();
        if (adminPassword === 'admin123') {
            setIsAdminMode(true);
            setIsAdminAuthOpen(false);
            setAdminPassword('');
        } else {
            alert('Mot de passe admin incorrect !');
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-blue-50/30">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="font-bold text-primary-600 text-lg animate-pulse">Chargement de ton aventure...</p>
            </div>
        </div>
    );

    const isParent = user.role === 'parent';

    return (
        <div className={`space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20`}>
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <UserAvatar name={user.name} role={user.role} size="lg" />
                    <div>
                        <h1 className={`text-3xl font-black ${isParent ? 'text-slate-800' : 'text-primary-600 font-[900]'}`}>
                            Salut {user.name} ! {isParent ? '👋' : '✨'}
                        </h1>
                        <p className="text-slate-500 font-medium">
                            {isParent
                                ? 'Prêt à gérer les quêtes de la famille ?'
                                : 'Regarde tes missions et gagne des étoiles !'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {!isParent && (
                        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-3xl shadow-lg border border-primary-100 transform hover:scale-105 transition-transform">
                            <Star className="text-amber-400 fill-amber-400" size={28} />
                            <span className="text-2xl font-[900] text-primary-700">{user.points} <span className="text-sm font-bold opacity-70">PTS</span></span>
                        </div>
                    )}

                    {isParent && (
                        <div className="flex items-center gap-2">
                            {isAdminMode ? (
                                <div className="flex gap-2 animate-in slide-in-from-right-4 duration-300">
                                    <button
                                        onClick={() => setIsTaskModalOpen(true)}
                                        className="bg-primary-600 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all active:scale-95"
                                    >
                                        <Plus size={20} /> Nouvelle Mission
                                    </button>
                                    <button
                                        onClick={() => setIsRewardModalOpen(true)}
                                        className="bg-accent-500 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-accent-600 shadow-lg shadow-accent-200 transition-all active:scale-95"
                                    >
                                        <Plus size={20} /> Nouveau Cadeau
                                    </button>
                                    <button
                                        onClick={() => setIsAdminMode(false)}
                                        className="bg-slate-100 text-slate-500 p-3 rounded-2xl hover:bg-slate-200 transition-all"
                                        title="Quitter le mode Admin"
                                    >
                                        <Lock size={20} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsAdminAuthOpen(true)}
                                    className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl border-2 border-slate-100 text-slate-600 font-bold hover:border-primary-400 hover:text-primary-600 transition-all"
                                >
                                    <Settings size={20} /> Mode Admin
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {/* Admin Password Modal */}
            {isAdminAuthOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm p-8 rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Lock size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800">Zone Parent</h2>
                            <p className="text-slate-500 text-sm">Entre le mot de passe secret</p>
                        </div>
                        <form onSubmit={handleAdminAuth} className="space-y-4">
                            <input
                                type="password"
                                autoFocus
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-400 outline-none transition-all text-center text-xl font-bold"
                                placeholder="••••••••"
                            />
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAdminAuthOpen(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-200 hover:bg-primary-700"
                                >
                                    Valider
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onTaskCreated={fetchData}
            />

            <RewardModal
                isOpen={isRewardModalOpen}
                onClose={() => setIsRewardModalOpen(false)}
                onRewardCreated={fetchData}
            />

            {/* Tasks Section */}
            <section>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 shadow-sm shadow-primary-50">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Quêtes Magiques</h2>
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Tes missions à accomplir</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tasks.length === 0 ? (
                        <div className="col-span-full py-12 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                            <p className="text-slate-400 font-bold text-lg italic">Aucune quête pour le moment. Profite bien ! 🎈</p>
                        </div>
                    ) : (
                        tasks.map(task => (
                            <div key={task.id} className="group relative bg-white p-7 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-primary-100/50 hover:-translate-y-2 transition-all duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-4 py-2 rounded-2xl font-black text-sm shadow-sm ${task.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                            task.status === 'waiting_approval' ? 'bg-primary-50 text-primary-600 animate-pulse' :
                                                'bg-green-50 text-green-600'
                                        }`}>
                                        {task.status === 'pending' ? 'À faire' :
                                            task.status === 'waiting_approval' ? 'En vérification' : 'Gagné !'}
                                    </div>
                                    <div className="bg-primary-600 text-white px-3 py-1.5 rounded-2xl font-black text-xs shadow-lg shadow-primary-200 animate-bounce-short">
                                        +{task.points_value} PTS
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-3 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{task.title}</h3>
                                <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed line-clamp-2">{task.description}</p>

                                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                        {task.status === 'pending' && <Clock size={14} />}
                                        {task.status === 'waiting_approval' && <Sparkles size={14} className="text-primary-400" />}
                                        {task.status === 'completed' && <Trophy size={14} className="text-green-500" />}
                                        {task.status.replace('_', ' ')}
                                    </span>

                                    {!isParent && task.status === 'pending' && (
                                        <button
                                            onClick={() => handleTaskStatusUpdate(task.id, 'waiting_approval')}
                                            className="bg-primary-500 text-white px-6 py-2.5 rounded-2xl font-black text-sm shadow-lg shadow-primary-200 hover:bg-primary-600 active:scale-90 transition-all"
                                        >
                                            C'est fait ! 🚀
                                        </button>
                                    )}

                                    {isParent && isAdminMode && task.status === 'waiting_approval' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleTaskStatusUpdate(task.id, 'completed')}
                                                className="bg-green-500 text-white p-2.5 rounded-xl hover:bg-green-600 transition-all shadow-md active:scale-90"
                                                title="Valider"
                                            >
                                                <CheckCircle size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleTaskStatusUpdate(task.id, 'pending')}
                                                className="bg-red-500 text-white p-2.5 rounded-xl hover:bg-red-600 transition-all shadow-md active:scale-90"
                                                title="Refuser"
                                            >
                                                <AlertCircle size={20} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Rewards Section */}
            <section>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-accent-100 rounded-2xl flex items-center justify-center text-accent-600 shadow-sm shadow-accent-50">
                        <Gift size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Le Magasin des Héros</h2>
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Échange tes points contre des surprises</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {rewards.map(reward => (
                        <div key={reward.id} className="group bg-white p-8 rounded-[2.5rem] text-center border border-slate-100 hover:shadow-2xl hover:shadow-accent-100/50 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
                            <div className="w-20 h-20 bg-accent-50 rounded-[1.8rem] flex items-center justify-center mx-auto mb-6 text-accent-600 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">
                                <ShoppingBag size={40} />
                            </div>
                            <h3 className="font-black text-lg text-slate-800 mb-2 uppercase tracking-tight h-14 flex items-center justify-center">{reward.title}</h3>
                            <div className="mb-8 flex items-center justify-center gap-2">
                                <Star size={16} className="text-amber-400 fill-amber-400" />
                                <span className="text-2xl font-[900] text-accent-600">{reward.cost} <span className="text-xs opacity-50">PTS</span></span>
                            </div>
                            <button
                                onClick={() => handlePurchaseReward(reward.id)}
                                className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${user.points >= reward.cost && !isParent
                                        ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-xl shadow-accent-200 hover:scale-[1.05] active:scale-95'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed grayscale'
                                    }`}
                                disabled={user.points < reward.cost || isParent}
                            >
                                {!isParent
                                    ? (user.points >= reward.cost ? 'Je le veux ! 🎁' : 'Pas assez d\'étoiles')
                                    : 'Vue Admin'}
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
