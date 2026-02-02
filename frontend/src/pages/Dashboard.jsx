import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { CheckCircle, Clock, AlertCircle, Plus, Gift, ShoppingBag, CheckSquare } from 'lucide-react';
import TaskModal from '../components/TaskModal';
import RewardModal from '../components/RewardModal';

const Dashboard = () => {
    const { user, setUser } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [tasksRes, rewardsRes] = await Promise.all([
                api.get('/tasks'),
                api.get('/rewards')
            ]);
            setTasks(tasksRes.data);
            setRewards(rewardsRes.data);
        } catch (error) {
            console.error('Error fetching data', error);
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
            // Refresh tasks and user points
            const [tasksRes, usersRes] = await Promise.all([
                api.get('/tasks'),
                api.get(`/users/${user.id}`)
            ]);
            setTasks(tasksRes.data);
            // Update context
            setUser({ ...user, points: usersRes.data.current_points });
        } catch (error) {
            alert('Error updating task: ' + (error.response?.data?.message || error.message));
        }
    };

    const handlePurchaseReward = async (rewardId) => {
        try {
            const response = await api.post(`/rewards/${rewardId}/purchase`);
            alert(response.data.message);
            // Refresh user points
            const usersRes = await api.get(`/users/${user.id}`);
            setUser({ ...user, points: usersRes.data.current_points });
        } catch (error) {
            alert('Error purchasing reward: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center font-bold text-primary-600">Loading adventure...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">
                        Welcome back, {user.name}!
                    </h1>
                    <p className="text-slate-500">
                        {user.role === 'parent' ? 'Administer the family tasks and rewards.' : 'Complete tasks to earn awesome rewards!'}
                    </p>
                </div>

                {user.role === 'parent' && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsTaskModalOpen(true)}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Plus size={20} />
                            New Task
                        </button>
                        <button
                            onClick={() => setIsRewardModalOpen(true)}
                            className="btn-accent flex items-center gap-2"
                        >
                            <Plus size={20} />
                            New Reward
                        </button>
                    </div>
                )}
            </header>

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

            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <CheckSquare className="text-primary-500" />
                        Current Tasks
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.length === 0 ? (
                        <p className="col-span-full text-slate-400 italic">No tasks yet. Enjoy the free time!</p>
                    ) : (
                        tasks.map(task => (
                            <div key={task.id} className="glass p-5 rounded-2xl border-l-4 border-l-primary-500 hover:shadow-lg transition-all group">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg group-hover:text-primary-600 transition-colors">{task.title}</h3>
                                    <span className="bg-primary-50 text-primary-600 text-xs font-black px-2 py-1 rounded-full">
                                        {task.points_value} PTS
                                    </span>
                                </div>
                                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{task.description}</p>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
                                        {task.status === 'pending' && <Clock className="text-amber-500" size={14} />}
                                        {task.status === 'waiting_approval' && <AlertCircle className="text-primary-500" size={14} />}
                                        {task.status === 'completed' && <CheckCircle className="text-green-500" size={14} />}
                                        <span className={
                                            task.status === 'pending' ? 'text-amber-600' :
                                                task.status === 'waiting_approval' ? 'text-primary-600' : 'text-green-600'
                                        }>
                                            {task.status.replace('_', ' ')}
                                        </span>
                                    </div>

                                    {user.role === 'child' && task.status === 'pending' && (
                                        <button
                                            onClick={() => handleTaskStatusUpdate(task.id, 'waiting_approval')}
                                            className="text-xs btn-primary py-1 px-3 shadow-md shadow-primary-100"
                                        >
                                            Mark Done
                                        </button>
                                    )}
                                    {user.role === 'parent' && task.status === 'waiting_approval' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleTaskStatusUpdate(task.id, 'completed')}
                                                className="text-xs bg-green-500 text-white p-1.5 rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                                                title="Approve"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleTaskStatusUpdate(task.id, 'pending')}
                                                className="text-xs bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                                                title="Reject"
                                            >
                                                <AlertCircle size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Gift className="text-accent-500" />
                        Available Rewards
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {rewards.map(reward => (
                        <div key={reward.id} className="glass p-5 rounded-2xl text-center hover:scale-[1.02] transition-transform">
                            <div className="w-16 h-16 bg-accent-50 rounded-full flex items-center justify-center mx-auto mb-4 text-accent-600">
                                <ShoppingBag size={28} />
                            </div>
                            <h3 className="font-bold mb-1">{reward.title}</h3>
                            <p className="text-accent-600 font-black mb-4">{reward.cost} PTS</p>
                            <button
                                onClick={() => handlePurchaseReward(reward.id)}
                                className={`w-full py-2 rounded-xl font-bold transition-all ${user.points >= reward.cost && user.role === 'child'
                                    ? 'bg-accent-600 text-white shadow-lg shadow-accent-200 hover:bg-accent-700'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                                disabled={user.points < reward.cost || user.role === 'parent'}
                            >
                                {user.role === 'parent' ? 'Admin View' : (user.points >= reward.cost ? 'Redeem!' : 'More points needed')}
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
