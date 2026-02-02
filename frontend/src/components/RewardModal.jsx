import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../api';

const RewardModal = ({ isOpen, onClose, onRewardCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cost, setCost] = useState(50);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/rewards', {
                title,
                description,
                cost: parseInt(cost),
                icon_ref: 'gift'
            });
            onRewardCreated();
            onClose();
            // Reset form
            setTitle('');
            setDescription('');
            setCost(50);
        } catch (error) {
            alert('Error creating reward');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="glass w-full max-w-sm p-6 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">New Reward</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Reward Name</label>
                        <input
                            type="text" required value={title} onChange={e => setTitle(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Points Cost</label>
                        <input
                            type="number" required value={cost} onChange={e => setCost(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                    <button type="submit" className="w-full btn-accent py-3 rounded-xl mt-4">Create Reward</button>
                </form>
            </div>
        </div>
    );
};

export default RewardModal;
