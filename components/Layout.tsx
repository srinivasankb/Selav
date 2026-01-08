import React from 'react';
import { Icons } from './Icons';
import { motion } from 'framer-motion';
import { IconButton, Avatar } from '@mui/material';
import { pb } from '../services/pocketbase';

interface Props {
  children: React.ReactNode;
  user: any;
  onAddClick: () => void;
  onProfileClick: () => void;
  showAddButton?: boolean;
}

export const Layout: React.FC<Props> = ({ children, user, onAddClick, onProfileClick, showAddButton = true }) => {
  
  // Construct URL for PocketBase file
  const avatarUrl = user?.avatar ? pb.files.getUrl(user, user.avatar) : undefined;

  return (
    <div className="min-h-screen bg-background text-slate-900 font-sans flex flex-col">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shadow-lg shadow-brand-200">
                    <Icons.Calendar className="text-white" size={18} />
                 </div>
                 <span className="text-lg font-bold tracking-tight text-slate-900">Selav</span>
            </div>

            <div className="flex items-center gap-2">
                 <IconButton onClick={onProfileClick} size="small" sx={{ ml: 1 }}>
                    <Avatar 
                        src={avatarUrl}
                        alt={user?.name || user?.email}
                        sx={{ width: 32, height: 32, bgcolor: 'var(--brand-100)', color: 'var(--brand-600)', fontSize: '0.875rem', fontWeight: 'bold' }}
                    >
                        {!avatarUrl && (user?.email?.[0].toUpperCase() || 'U')}
                    </Avatar>
                 </IconButton>
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto p-4 pb-24 md:p-6 md:pb-8">
          {children}
      </main>

      {/* Floating Action Button - Desktop & Mobile */}
      {showAddButton && (
        <motion.button
            onClick={onAddClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 right-6 w-14 h-14 bg-brand-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-brand-500/30 z-50 hover:bg-brand-600 transition-colors"
        >
            <Icons.Add size={28} />
        </motion.button>
      )}
    </div>
  );
};