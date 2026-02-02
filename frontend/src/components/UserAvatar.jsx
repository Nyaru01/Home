import React from 'react';

const UserAvatar = ({ name, role, size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-base',
        lg: 'w-20 h-20 text-2xl',
    };

    const roleColors = {
        parent: 'bg-gradient-to-br from-primary-500 to-primary-700 shadow-primary-200',
        child: 'bg-gradient-to-br from-accent-500 to-accent-700 shadow-accent-200',
    };

    const initials = name ? name[0].toUpperCase() : '?';

    return (
        <div className={`${sizeClasses[size]} ${roleColors[role]} rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-primary-100 ring-2 ring-white`}>
            {initials}
        </div>
    );
};

export default UserAvatar;
