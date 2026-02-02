import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../api';

const RewardModal = ({ isOpen, onClose, onRewardCreated }) => {
    const [title, setTitle] = useState('');
    const [cost, setCost] = useState(50);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/rewards', {
                title,
                description: '',
                cost: parseInt(cost),
                icon_ref: 'gift'
            });
            onRewardCreated();
            onClose();
            // Reset form
            setTitle('');
            setCost(50);
        } catch (error) {
            alert('Erreur lors de la création du cadeau');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm p-8 rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-200 border-2 border-slate-50">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Nouveau Cadeau</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 ml-1">Nom du trésor</label>
                        <input
                            type="text" required value={title} onChange={e => setTitle(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary-400 outline-none transition-all placeholder:text-slate-300 font-bold"
                            placeholder="Ex: Un tour de manège"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 ml-1">Prix en étoiles</label>
                        <input
                            type="number" required value={cost} onChange={e => setCost(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary-400 outline-none transition-all font-black text-accent-600"
                        />
                    </div>
                    <button type="submit" className="w-full py-5 bg-accent-500 text-white rounded-2xl shadow-xl shadow-accent-100 font-black text-lg hover:bg-accent-600 active:scale-95 transition-all mt-4">
                        Créer le trésor 🎁
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RewardModal;
