import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../api';

const TaskModal = ({ isOpen, onClose, onTaskCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [points, setPoints] = useState(10);
    const [assignedTo, setAssignedTo] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (isOpen) {
            api.get('/users').then(res => {
                setUsers(res.data.filter(u => u.role === 'child'));
            });
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', {
                title,
                description,
                points_value: parseInt(points),
                assigned_to_user_id: assignedTo ? parseInt(assignedTo) : null
            });
            onTaskCreated();
            onClose();
            // Reset form
            setTitle('');
            setDescription('');
            setPoints(10);
            setAssignedTo('');
        } catch (error) {
            alert('Erreur lors de la création de la tâche');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md p-8 rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-200 border-2 border-slate-50">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Nouvelle Mission</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 ml-1">Titre de la quête</label>
                        <input
                            type="text" required value={title} onChange={e => setTitle(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary-400 outline-none transition-all placeholder:text-slate-300 font-bold"
                            placeholder="Ex: Ranger les jouets"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 ml-1">Détails secrets</label>
                        <textarea
                            value={description} onChange={e => setDescription(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary-400 outline-none h-28 transition-all placeholder:text-slate-300 font-medium"
                            placeholder="Explique ce qu'il faut faire..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Récompense (PTS)</label>
                            <input
                                type="number" required value={points} onChange={e => setPoints(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary-400 outline-none transition-all font-black text-primary-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Héros désigné</label>
                            <select
                                value={assignedTo} onChange={e => setAssignedTo(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary-400 outline-none transition-all font-bold text-slate-600"
                            >
                                <option value="">À tous !</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="w-full py-5 bg-primary-600 text-white rounded-2xl shadow-xl shadow-primary-100 font-black text-lg hover:bg-primary-700 active:scale-95 transition-all mt-4">
                        Envoyer la Mission 💌
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
