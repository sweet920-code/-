import React, { useState } from 'react';
import { Location, DefectCategory, DefectRecord, RecordType } from '../types';
import { AlertCircle, X, Check } from 'lucide-react';

interface DefectFormProps {
  onSubmit: (record: Omit<DefectRecord, 'id' | 'timestamp'>) => void;
  onCancel: () => void;
}

export const DefectForm: React.FC<DefectFormProps> = ({ onSubmit, onCancel }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState<Location | ''>('');
  const [category, setCategory] = useState<DefectCategory | ''>('');
  const [otherDetails, setOtherDetails] = useState('');
  const [causeAndPerson, setCauseAndPerson] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !category) return;

    onSubmit({
      type: RecordType.DEFECT,
      date,
      location,
      category,
      otherCategoryDetails: category === DefectCategory.OTHER ? otherDetails : undefined,
      causeAndPerson,
      correctiveAction
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm animate-fade-in-up">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-amber-100 p-2 rounded-lg text-amber-600"><AlertCircle size={24} /></span>
          缺失紀錄
        </h2>
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">日期 *</label>
          <input 
            type="date" 
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">地點 *</label>
          <select 
            required
            value={location}
            onChange={(e) => setLocation(e.target.value as Location)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white"
          >
            <option value="">請選擇地點</option>
            {Object.values(Location).map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">缺失類型 *</label>
        <div className="grid grid-cols-2 gap-3">
          {Object.values(DefectCategory).map((cat) => (
            <label 
              key={cat} 
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${category === cat ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500' : 'border-slate-200 hover:bg-slate-50'}`}
            >
              <input 
                type="radio" 
                name="defectCategory" 
                value={cat} 
                checked={category === cat} 
                onChange={() => setCategory(cat)}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-slate-700">{cat}</span>
            </label>
          ))}
        </div>
        {category === DefectCategory.OTHER && (
           <input 
           type="text" 
           value={otherDetails}
           onChange={(e) => setOtherDetails(e.target.value)}
           placeholder="請說明其他類型"
           className="mt-2 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
         />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">缺失原因及人員 (詳述) *</label>
        <textarea 
          required
          rows={3}
          value={causeAndPerson}
          onChange={(e) => setCauseAndPerson(e.target.value)}
          placeholder="描述發生的原因與相關責任人..."
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">改善修正措施 (詳述) *</label>
        <textarea 
          required
          rows={3}
          value={correctiveAction}
          onChange={(e) => setCorrectiveAction(e.target.value)}
          placeholder="已採取什麼行動來解決或預防..."
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
        />
      </div>

      <div className="pt-4 flex gap-3">
        <button 
          type="button" 
          onClick={onCancel}
          className="flex-1 py-3 text-slate-600 bg-slate-100 rounded-xl font-medium hover:bg-slate-200"
        >
          取消
        </button>
        <button 
          type="submit" 
          className="flex-1 py-3 text-white bg-amber-600 rounded-xl font-medium hover:bg-amber-700 shadow-lg shadow-amber-200 flex items-center justify-center gap-2"
        >
          <Check size={20} />
          提交紀錄
        </button>
      </div>
    </form>
  );
};
