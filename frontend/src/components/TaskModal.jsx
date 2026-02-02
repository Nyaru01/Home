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
            alert('Error creating task');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="glass w-full max-w-md p-6 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">New Task</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text" required value={title} onChange={e => setTitle(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            value={description} onChange={e => setDescription(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none h-24"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Points</label>
                            <input
                                type="number" required value={points} onChange={e => setPoints(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Assign to</label>
                            <select
                                value={assignedTo} onChange={e => setAssignedTo(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                <option value="">A tous</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="w-full btn-primary py-3 rounded-xl mt-4">Create Task</button>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
