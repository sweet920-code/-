import React from 'react';
import { AppRecord, RecordType, ScrapCategory, DefectCategory, ScrapRecord, DefectRecord } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, AlertTriangle, Trash2, ClipboardList, Lock, Mail } from 'lucide-react';

interface DashboardProps {
  records: AppRecord[];
  onNewEntry: () => void;
  onViewDetails: (type: RecordType) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ records, onNewEntry, onViewDetails }) => {
  // Get current Year-Month string (e.g., "2023-10") in local time
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  // Filter for ONLY this month's records
  const monthlyRecords = records.filter(r => r.date.startsWith(currentMonthStr));

  const scrapCount = monthlyRecords.filter(r => r.type === RecordType.SCRAP).length;
  const defectCount = monthlyRecords.filter(r => r.type === RecordType.DEFECT).length;

  // Prepare data for Scrap Chart (Monthly)
  const scrapData = [
    { name: '成品 (A)', value: monthlyRecords.filter(r => r.type === RecordType.SCRAP && r.category.startsWith('A')).length },
    { name: '半成品 (B)', value: monthlyRecords.filter(r => r.type === RecordType.SCRAP && r.category.startsWith('B')).length },
    { name: '原料 (C)', value: monthlyRecords.filter(r => r.type === RecordType.SCRAP && r.category.startsWith('C')).length },
    { name: '包裝 (D)', value: monthlyRecords.filter(r => r.type === RecordType.SCRAP && r.category.startsWith('D')).length },
    { name: '外場 (E)', value: monthlyRecords.filter(r => r.type === RecordType.SCRAP && r.category.startsWith('E')).length },
  ];

  // Prepare data for Defect Chart (Monthly)
  const defectData = [
    { name: '作業疏失', value: monthlyRecords.filter(r => r.type === RecordType.DEFECT && r.category === DefectCategory.OPERATION).length },
    { name: '紀錄違反', value: monthlyRecords.filter(r => r.type === RecordType.DEFECT && r.category === DefectCategory.RECORD).length },
    { name: '設備問題', value: monthlyRecords.filter(r => r.type === RecordType.DEFECT && r.category === DefectCategory.EQUIPMENT).length },
    { name: '品質異常', value: monthlyRecords.filter(r => r.type === RecordType.DEFECT && r.category === DefectCategory.QUALITY).length },
    { name: '其他', value: monthlyRecords.filter(r => r.type === RecordType.DEFECT && r.category === DefectCategory.OTHER).length },
  ];

  const handleSendReport = () => {
    const subject = encodeURIComponent(`甜蜜點規範系統 - ${currentMonthStr} 月報表`);
    
    // Generate Stats Text
    const scrapStats = scrapData.map(d => `   - ${d.name}: ${d.value}`).join('\n');
    const defectStats = defectData.map(d => `   - ${d.name}: ${d.value}`).join('\n');
    
    const bodyContent = `甜蜜點規範系統 - 月結報表
月份: ${currentMonthStr}

【報廢紀錄 (SCRAP)】
本月總筆數: ${scrapCount}
依類別統計:
${scrapStats}

【缺失紀錄 (DEFECT)】
本月總筆數: ${defectCount}
依類別統計:
${defectStats}

(此郵件由系統自動生成，請確認內容後寄出)`;

    const body = encodeURIComponent(bodyContent);
    
    window.location.href = `mailto:sweetspot920@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-slate-800">
          {currentMonthStr} 月份概況
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onViewDetails(RecordType.SCRAP)}
          className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center py-6 hover:bg-indigo-50 hover:border-indigo-200 transition-all cursor-pointer group relative"
        >
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Lock className="w-4 h-4 text-indigo-400" />
          </div>
          <Trash2 className="w-8 h-8 text-indigo-500 mb-2" />
          <span className="text-3xl font-bold text-slate-800">{scrapCount}</span>
          <span className="text-sm text-slate-500 font-medium">本月報廢 (點擊查看)</span>
        </button>
        
        <button 
          onClick={() => onViewDetails(RecordType.DEFECT)}
          className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center py-6 hover:bg-amber-50 hover:border-amber-200 transition-all cursor-pointer group relative"
        >
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
          <span className="text-3xl font-bold text-slate-800">{defectCount}</span>
          <span className="text-sm text-slate-500 font-medium">本月缺失 (點擊查看)</span>
        </button>
      </div>

      <button
        onClick={onNewEntry}
        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-lg font-semibold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <Plus className="w-6 h-6" />
        新增紀錄
      </button>

      {/* Scrap Analysis */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold mb-4 text-slate-700 flex items-center gap-2">
           <div className="bg-indigo-100 p-1.5 rounded-lg"><ClipboardList className="w-5 h-5 text-indigo-600" /></div>
           本月報廢類別分析
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scrapData} layout="vertical" margin={{ left: 10, right: 10 }}>
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
              <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} name="筆數" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Defect Analysis */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold mb-4 text-slate-700 flex items-center gap-2">
           <div className="bg-amber-100 p-1.5 rounded-lg"><AlertTriangle className="w-5 h-5 text-amber-600" /></div>
           本月缺失類別分析
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={defectData} layout="vertical" margin={{ left: 10, right: 10 }}>
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
              <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={24} name="筆數" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Email Report Button */}
      <button
        onClick={handleSendReport}
        className="w-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 mt-4"
      >
        <Mail className="w-5 h-5" />
        寄送本月報表 (Mail)
      </button>
      <div className="text-center text-xs text-slate-400">
        將開啟郵件程式寄送至 sweetspot920@gmail.com
      </div>
    </div>
  );
};