import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

interface LoginModalProps {
  onLogin: (password: string) => void;
  onCancel: () => void;
  error?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onCancel, error }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 relative">
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={24} />
        </button>
        
        <div className="flex flex-col items-center mb-6">
          <div className="bg-indigo-100 p-3 rounded-full mb-3">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">管理員驗證</h3>
          <p className="text-sm text-slate-500">請輸入密碼以查看詳細紀錄</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="輸入密碼"
              autoFocus
              className={`w-full text-center text-lg p-3 border rounded-xl outline-none focus:ring-2 transition-all ${error ? 'border-red-300 focus:ring-red-200 bg-red-50' : 'border-slate-300 focus:ring-indigo-200'}`}
            />
            {error && <p className="text-red-500 text-xs text-center mt-2">密碼錯誤，請重試</p>}
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            確認
          </button>
        </form>
      </div>
    </div>
  );
};
