import React, { useState } from 'react';
import { AppRecord, RecordType, ScrapRecord, DefectRecord } from '../types';
import { ArrowLeft, Search, Calendar, MapPin, FileText, Trash2, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface AdminViewProps {
  type: RecordType;
  records: AppRecord[];
  onBack: () => void;
  onDelete: (id: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ type, records, onBack, onDelete }) => {
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  // Filter records based on the selected type
  const filteredRecords = records.filter(r => r.type === type);
  
  // Sort by date descending
  const sortedRecords = [...filteredRecords].sort((a, b) => b.timestamp - a.timestamp);

  const title = type === RecordType.SCRAP ? '報廢詳細紀錄' : '缺失詳細紀錄';
  const themeColor = type === RecordType.SCRAP ? 'text-indigo-600 bg-indigo-50 border-indigo-200' : 'text-amber-600 bg-amber-50 border-amber-200';

  // Stats for Pie Chart
  const categoryCount = filteredRecords.reduce((acc, curr) => {
    // Extract just the code or first few chars for cleaner chart
    const label = type === RecordType.SCRAP 
      ? (curr as ScrapRecord).category.split('→')[0] 
      : (curr as DefectRecord).category;
    
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

  const handleDeleteClick = (id: string) => {
    setRecordToDelete(id);
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      onDelete(recordToDelete);
      setRecordToDelete(null);
    }
  };

  const cancelDelete = () => {
    setRecordToDelete(null);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex items-center gap-3 mb-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
      </div>

      {/* Summary Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold mb-4 text-slate-700">類別分佈統計</h3>
        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-full flex items-center justify-center text-slate-400">
               尚無資料可供分析
             </div>
          )}
        </div>
      </div>

      {/* Detailed List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          詳細列表 ({filteredRecords.length})
        </h3>

        {sortedRecords.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center text-slate-400 border border-slate-100">
            <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>目前沒有紀錄</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedRecords.map((record) => (
              <div key={record.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${themeColor}`}>
                    {type === RecordType.SCRAP 
                      ? (record as ScrapRecord).category.split('→')[0] 
                      : (record as DefectRecord).category}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-500 flex items-center gap-1">
                      <Calendar size={14} />
                      {record.date}
                    </div>
                    <button 
                      onClick={() => handleDeleteClick(record.id)}
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all p-2 rounded-full"
                      title="刪除紀錄"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex items-center gap-2 text-slate-700 font-medium mb-1">
                    <MapPin size={16} className="text-slate-400" />
                    {record.location}
                  </div>
                  
                  {type === RecordType.SCRAP ? (
                    <>
                      <div className="text-slate-800 font-bold text-lg mb-1">
                        {(record as ScrapRecord).details}
                      </div>
                      <p className="text-slate-600 text-sm bg-slate-50 p-2 rounded">
                        <span className="font-medium">原因：</span>{(record as ScrapRecord).reason}
                      </p>
                    </>
                  ) : (
                    <>
                       <div className="text-slate-800 font-bold mb-1">
                        原因與人員：{(record as DefectRecord).causeAndPerson}
                      </div>
                      <p className="text-slate-600 text-sm bg-slate-50 p-2 rounded">
                        <span className="font-medium">修正措施：</span>{(record as DefectRecord).correctiveAction}
                      </p>
                      {(record as DefectRecord).otherCategoryDetails && (
                         <p className="text-xs text-slate-400 mt-1">其他類型備註: {(record as DefectRecord).otherCategoryDetails}</p>
                      )}
                    </>
                  )}
                </div>

                {type === RecordType.SCRAP && (record as ScrapRecord).imageUrl && (
                  <div className="mt-3 border-t pt-3">
                    <p className="text-xs text-slate-400 mb-1">附圖：</p>
                    <img 
                      src={(record as ScrapRecord).imageUrl} 
                      alt="Scrap evidence" 
                      className="h-24 w-auto rounded-lg border border-slate-200 object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 relative">
            <button 
              onClick={cancelDelete}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>
            
            <div className="flex flex-col items-center mb-6">
              <div className="bg-red-100 p-3 rounded-full mb-3">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">確定刪除嗎？</h3>
              <p className="text-slate-500 text-sm text-center mt-2">
                此動作將永久移除該筆紀錄，<br/>確定要繼續執行嗎？
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={cancelDelete}
                className="flex-1 py-3 text-slate-600 bg-slate-100 rounded-xl font-medium hover:bg-slate-200 transition-colors"
              >
                否
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 text-white bg-red-600 rounded-xl font-medium hover:bg-red-700 shadow-lg shadow-red-200 transition-colors"
              >
                確定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};