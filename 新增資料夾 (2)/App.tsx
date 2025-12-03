import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ScrapForm } from './components/ScrapForm';
import { DefectForm } from './components/DefectForm';
import { LoginModal } from './components/LoginModal';
import { AdminView } from './components/AdminView';
import { AppRecord, ViewState, RecordType, ScrapRecord, DefectRecord } from './types';
import { Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [records, setRecords] = useState<AppRecord[]>([]);
  const [targetAdminType, setTargetAdminType] = useState<RecordType | null>(null);
  const [loginError, setLoginError] = useState(false);

  // --- Handlers ---

  const handleNewEntry = () => {
    setView('SELECT_TYPE');
  };

  const handleSelectType = (type: RecordType) => {
    if (type === RecordType.SCRAP) setView('FORM_SCRAP');
    else setView('FORM_DEFECT');
  };

  const handleSubmitScrap = (record: Omit<ScrapRecord, 'id' | 'timestamp'>) => {
    const newRecord: ScrapRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    setRecords(prev => [newRecord, ...prev]);
    setView('SUCCESS');
  };

  const handleSubmitDefect = (record: Omit<DefectRecord, 'id' | 'timestamp'>) => {
    const newRecord: DefectRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    setRecords(prev => [newRecord, ...prev]);
    setView('SUCCESS');
  };

  const handleViewDetails = (type: RecordType) => {
    setTargetAdminType(type);
    setLoginError(false);
    setView('LOGIN');
  };

  const handleLogin = (password: string) => {
    if (password === '200200') {
      setLoginError(false);
      setView('ADMIN_VIEW');
    } else {
      setLoginError(true);
    }
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(prev => prev.filter(record => record.id !== id));
  };

  // --- Render ---

  const renderContent = () => {
    switch (view) {
      case 'DASHBOARD':
        return (
          <Dashboard 
            records={records} 
            onNewEntry={handleNewEntry} 
            onViewDetails={handleViewDetails}
          />
        );
      
      case 'LOGIN':
        return (
          <>
            <Dashboard 
              records={records} 
              onNewEntry={handleNewEntry} 
              onViewDetails={handleViewDetails}
            />
            <LoginModal 
              onLogin={handleLogin} 
              onCancel={() => setView('DASHBOARD')}
              error={loginError}
            />
          </>
        );

      case 'ADMIN_VIEW':
        if (!targetAdminType) return null;
        return (
          <AdminView 
            type={targetAdminType} 
            records={records} 
            onBack={() => setView('DASHBOARD')} 
            onDelete={handleDeleteRecord}
          />
        );

      case 'SELECT_TYPE':
        return (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-xl font-semibold text-slate-700 text-center mb-8">請選擇要建立的紀錄類型</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => handleSelectType(RecordType.SCRAP)}
                className="group relative bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-indigo-500 hover:shadow-indigo-100 transition-all flex flex-col items-center justify-center gap-4 h-64"
              >
                <div className="bg-indigo-100 p-4 rounded-full group-hover:scale-110 transition-transform">
                  <Trash2 className="w-12 h-12 text-indigo-600" />
                </div>
                <span className="text-2xl font-bold text-slate-800">報廢紀錄</span>
                <span className="text-sm text-slate-500">記錄損耗、過期或製作失敗</span>
              </button>

              <button
                onClick={() => handleSelectType(RecordType.DEFECT)}
                className="group relative bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-amber-500 hover:shadow-amber-100 transition-all flex flex-col items-center justify-center gap-4 h-64"
              >
                <div className="bg-amber-100 p-4 rounded-full group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-12 h-12 text-amber-600" />
                </div>
                <span className="text-2xl font-bold text-slate-800">缺失紀錄</span>
                <span className="text-sm text-slate-500">記錄作業疏失、設備或品質異常</span>
              </button>
            </div>
            <button 
              onClick={() => setView('DASHBOARD')}
              className="w-full text-center text-slate-400 hover:text-slate-600 mt-8 py-4"
            >
              返回首頁
            </button>
          </div>
        );

      case 'FORM_SCRAP':
        return <ScrapForm onSubmit={handleSubmitScrap} onCancel={() => setView('DASHBOARD')} />;

      case 'FORM_DEFECT':
        return <DefectForm onSubmit={handleSubmitDefect} onCancel={() => setView('DASHBOARD')} />;

      case 'SUCCESS':
        return (
          <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in text-center">
            <div className="bg-green-100 p-6 rounded-full mb-6">
              <CheckCircle className="w-20 h-20 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">提交成功！</h2>
            <p className="text-slate-500 mb-8 max-w-xs">您的紀錄已成功儲存至系統。</p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button 
                onClick={() => setView('SELECT_TYPE')}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-200 hover:bg-indigo-700"
              >
                新增下一筆
              </button>
              <button 
                onClick={() => setView('DASHBOARD')}
                className="w-full py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-xl"
              >
                回首頁
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout onHome={() => setView('DASHBOARD')}>
      {renderContent()}
    </Layout>
  );
};

export default App;