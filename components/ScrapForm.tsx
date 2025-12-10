import React, { useState, useRef } from 'react';
import { Location, ScrapCategory, ScrapRecord, RecordType } from '../types';
import { Camera, Upload, Sparkles, X, Check } from 'lucide-react';
import { analyzeScrapImage } from '../services/geminiService';

interface ScrapFormProps {
  onSubmit: (record: Omit<ScrapRecord, 'id' | 'timestamp'>) => void;
  onCancel: () => void;
}

export const ScrapForm: React.FC<ScrapFormProps> = ({ onSubmit, onCancel }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState<Location | ''>('');
  const [category, setCategory] = useState<ScrapCategory | ''>('');
  const [details, setDetails] = useState('');
  const [reason, setReason] = useState('');
  const [image, setImage] = useState<string | null>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIAnalysis = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    const result = await analyzeScrapImage(image);
    
    if (result.description) {
      // Auto-fill reason if empty or append
      setReason(prev => prev ? `${prev} (AI觀察: ${result.description})` : `AI觀察: ${result.description}`);
    }
    
    if (result.suggestedCategory) {
      // Find the Enum value that starts with the letter
      const foundCategory = Object.values(ScrapCategory).find(c => c.startsWith(result.suggestedCategory));
      if (foundCategory) {
        setCategory(foundCategory);
      }
    }
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !category) return;

    onSubmit({
      type: RecordType.SCRAP,
      date,
      location,
      category,
      details,
      reason,
      imageUrl: image || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm animate-fade-in-up">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><Camera size={24} /></span>
          報廢紀錄
        </h2>
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
        </button>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">照片上傳 (可選)</label>
        <div 
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-colors cursor-pointer ${image ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:bg-slate-50'}`}
          onClick={() => fileInputRef.current?.click()}
        >
          {image ? (
            <div className="relative w-full h-48">
              <img src={image} alt="Preview" className="w-full h-full object-contain rounded-md" />
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); setImage(null); }}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full shadow-md transform translate-x-1/2 -translate-y-1/2"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="text-center text-slate-500">
              <Upload className="mx-auto h-10 w-10 mb-2 text-slate-400" />
              <p className="text-sm">點擊上傳或拍攝照片</p>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
        
        {image && (
          <button 
            type="button"
            onClick={handleAIAnalysis}
            disabled={isAnalyzing}
            className="w-full py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg flex items-center justify-center gap-2 shadow-md hover:opacity-90 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <span className="animate-pulse">AI 分析中...</span>
            ) : (
              <>
                <Sparkles size={18} />
                AI 智慧辨識 (自動填寫類別與原因)
              </>
            )}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">日期 *</label>
          <input 
            type="date" 
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">地點 *</label>
          <select 
            required
            value={location}
            onChange={(e) => setLocation(e.target.value as Location)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          >
            <option value="">請選擇地點</option>
            {Object.values(Location).map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">報廢類別 *</label>
        <div className="space-y-2">
          {Object.values(ScrapCategory).map((cat) => (
            <label 
              key={cat} 
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${category === cat ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-slate-200 hover:bg-slate-50'}`}
            >
              <input 
                type="radio" 
                name="scrapCategory" 
                value={cat} 
                checked={category === cat} 
                onChange={() => setCategory(cat)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-slate-700">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">商品名稱、數量、負責人員 *</label>
        <input 
          type="text" 
          required
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="例如：原味可頌 2個 王小明"
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">報廢原因 (詳述) *</label>
        <textarea 
          required
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="請詳細說明原因..."
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
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
          className="flex-1 py-3 text-white bg-indigo-600 rounded-xl font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
        >
          <Check size={20} />
          提交報表
        </button>
      </div>
    </form>
  );
};
