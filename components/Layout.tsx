import React from 'react';
import { ChefHat } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onHome: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onHome }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-indigo-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={onHome} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ChefHat className="w-8 h-8" />
            <h1 className="text-xl font-bold tracking-wide">甜蜜點規範系統</h1>
          </button>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-6 pb-20">
        {children}
      </main>
    </div>
  );
};
