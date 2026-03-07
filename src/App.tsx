import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  FileText, 
  LayoutDashboard, 
  Settings2, 
  Sparkles, 
  Table as TableIcon, 
  GraduationCap,
  ChevronRight,
  Loader2,
  Copy,
  CheckCircle2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { generateAssessmentContent } from './services/geminiService';
import { TOPICS_DATA } from './constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import MatrixEditor from './MatrixEditor';
import SpecsEditor from './SpecsEditor';
import TestPreview from './TestPreview';
import { MatrixRow, SpecItem } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Step = 'config' | 'matrix' | 'specs' | 'test';

export default function App() {
  const [step, setStep] = useState<Step>('config');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [config, setConfig] = useState({
    examName: 'KIỂM TRA GIỮA HỌC KỲ II',
    schoolLevel: 'THCS',
    grade: '6',
    duration: '45',
    subject: 'Tin học',
    scores: {
      tn4: 0.25,
      ds: 0.25,
      dien: 0.25,
      tl: 1
    },
    ratios: {
      tn4: 30,
      ds: 20,
      dien: 20,
      tl: 30
    },
    levels: {
      nb: 40,
      th: 30,
      vd: 20,
      vdc: 10
    },
    topics: ''
  });

  const [selectedSubItemIds, setSelectedSubItemIds] = useState<string[]>([]);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  // Filter topics based on grade
  const availableTopics = TOPICS_DATA.filter(t => t.grade === config.grade);

  // Update config.topics whenever selection changes
  useEffect(() => {
    const selectedContentMap: Record<string, string[]> = {};
    
    TOPICS_DATA.forEach(topic => {
      const selectedSubs = topic.subItems
        .filter(sub => selectedSubItemIds.includes(sub.id))
        .map(sub => sub.title);
      
      if (selectedSubs.length > 0) {
        selectedContentMap[topic.title] = selectedSubs;
      }
    });

    const selectedContent = Object.entries(selectedContentMap)
      .map(([topicTitle, subs]) => `${topicTitle}: ${subs.join('; ')}`)
      .join('\n');
      
    setConfig(prev => ({ ...prev, topics: selectedContent }));
  }, [selectedSubItemIds]);

  // Reset selection when grade changes
  useEffect(() => {
    setSelectedSubItemIds([]);
    setExpandedTopicId(null);
  }, [config.grade]);

  const toggleSubItem = (id: string) => {
    setSelectedSubItemIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleTopicExpand = (id: string) => {
    setExpandedTopicId(prev => prev === id ? null : id);
  };

  const selectAllInTopic = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const topic = TOPICS_DATA.find(t => t.id === topicId);
    if (!topic) return;
    
    const subIds = topic.subItems.map(s => s.id);
    const allSelected = subIds.every(id => selectedSubItemIds.includes(id));
    
    if (allSelected) {
      setSelectedSubItemIds(prev => prev.filter(id => !subIds.includes(id)));
    } else {
      setSelectedSubItemIds(prev => [...new Set([...prev, ...subIds])]);
    }
  };

  const [results, setResults] = useState<{
    matrix: string;
    specs: string;
    test: string;
  }>({
    matrix: '',
    specs: '',
    test: ''
  });

  const [matrixData, setMatrixData] = useState<MatrixRow[]>([]);
  const [specsData, setSpecsData] = useState<SpecItem[]>([]);

  const handleGenerate = async (type: 'matrix' | 'specs' | 'test') => {
    if (!config.topics) {
      alert('Vui lòng chọn ít nhất một nội dung kiến thức.');
      return;
    }
    setLoading(true);
    try {
      const ratioStr = `TN4: ${config.ratios.tn4}%, Đ/S: ${config.ratios.ds}%, Điền: ${config.ratios.dien}%, TL: ${config.ratios.tl}%`;
      const levelStr = `NB: ${config.levels.nb}%, TH: ${config.levels.th}%, VD: ${config.levels.vd}%, VDC: ${config.levels.vdc}%`;
      const content = await generateAssessmentContent(type, {
        grade: config.grade,
        semester: config.examName,
        topics: config.topics,
        ratio: ratioStr,
        levels: levelStr,
        duration: config.duration.toString(),
        matrixData: type !== 'matrix' ? matrixData : undefined
      });
      
      if (type === 'matrix') {
        try {
          const parsed = JSON.parse(content);
          setMatrixData(parsed.rows || []);
          setResults(prev => ({ ...prev, matrix: content }));
        } catch (e) {
          console.error("Failed to parse matrix JSON", e);
          setResults(prev => ({ ...prev, matrix: content }));
        }
      } else if (type === 'specs') {
        try {
          const parsed = JSON.parse(content);
          setSpecsData(parsed || []);
          setResults(prev => ({ ...prev, specs: content }));
        } catch (e) {
          console.error("Failed to parse specs JSON", e);
          setResults(prev => ({ ...prev, specs: content }));
        }
      } else {
        setResults(prev => ({ ...prev, [type]: content || '' }));
      }

      if (type === 'matrix') setStep('matrix');
      else if (type === 'specs') setStep('specs');
      else if (type === 'test') setStep('test');
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalRatio = config.ratios.tn4 + config.ratios.ds + config.ratios.dien + config.ratios.tl;
  const totalLevel = config.levels.nb + config.levels.th + config.levels.vd + config.levels.vdc;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 tracking-tight">Tạo đề kiểm tra chuẩn CV 7991</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Chương trình GDPT 2018</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <NavButton active={step === 'config'} onClick={() => setStep('config')} icon={<Settings2 size={16} />} label="Cấu hình" />
            <ChevronRight size={14} className="text-slate-400" />
            <NavButton active={step === 'matrix'} onClick={() => setStep('matrix')} icon={<TableIcon size={16} />} label="Ma trận" disabled={!results.matrix} />
            <ChevronRight size={14} className="text-slate-400" />
            <NavButton active={step === 'specs'} onClick={() => setStep('specs')} icon={<FileText size={16} />} label="Bản đặc tả" disabled={!results.specs} />
            <ChevronRight size={14} className="text-slate-400" />
            <NavButton active={step === 'test'} onClick={() => setStep('test')} icon={<ClipboardCheck size={16} />} label="Đề minh họa" disabled={!results.test} />
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500 hidden sm:inline-block">v1.0.0</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        <AnimatePresence mode="wait">
          {step === 'config' && (
            <motion.div
              key="config"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              <div className="lg:col-span-4 space-y-8">
                {/* 1. THÔNG TIN & CẤU HÌNH */}
                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2">1. THÔNG TIN & CẤU HÌNH</h3>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Tên kỳ thi</label>
                    <input 
                      type="text"
                      value={config.examName}
                      onChange={(e) => setConfig({...config, examName: e.target.value})}
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm focus:border-indigo-500 outline-none transition-all font-bold text-indigo-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Cấp học</label>
                    <select 
                      value={config.schoolLevel}
                      onChange={(e) => setConfig({...config, schoolLevel: e.target.value})}
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm focus:border-indigo-500 outline-none transition-all"
                    >
                      <option value="THCS">THCS</option>
                      <option value="THPT">THPT</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-600">Khối</label>
                      <select 
                        value={config.grade}
                        onChange={(e) => setConfig({...config, grade: e.target.value})}
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm focus:border-indigo-500 outline-none transition-all"
                      >
                        {[6, 7, 8, 9, 10, 11, 12].map(g => (
                          <option key={g} value={g}>Lớp {g}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-600">Thời gian</label>
                      <div className="relative">
                        <input 
                          type="text"
                          value={config.duration}
                          onChange={(e) => setConfig({...config, duration: e.target.value})}
                          className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm focus:border-indigo-500 outline-none transition-all"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">phút</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Môn học</label>
                    <select 
                      value={config.subject}
                      onChange={(e) => setConfig({...config, subject: e.target.value})}
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm focus:border-indigo-500 outline-none transition-all"
                    >
                      <option value="Tin học">Tin học</option>
                      <option value="Toán học">Toán học</option>
                      <option value="Ngữ văn">Ngữ văn</option>
                    </select>
                  </div>
                </section>

                <div className="grid grid-cols-2 gap-8">
                  {/* 2. ĐIỂM SỐ */}
                  <section className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-800">2. ĐIỂM SỐ</h3>
                    <div className="space-y-3">
                      <ScoreInput label="TN4" color="text-blue-600" value={config.scores.tn4} onChange={(val) => setConfig({...config, scores: {...config.scores, tn4: val}})} />
                      <ScoreInput label="Đ/S" color="text-purple-600" value={config.scores.ds} onChange={(val) => setConfig({...config, scores: {...config.scores, ds: val}})} />
                      <ScoreInput label="Điền" color="text-emerald-600" value={config.scores.dien} onChange={(val) => setConfig({...config, scores: {...config.scores, dien: val}})} />
                      <ScoreInput label="TL" color="text-orange-600" value={config.scores.tl} onChange={(val) => setConfig({...config, scores: {...config.scores, tl: val}})} />
                    </div>
                  </section>

                  {/* 3. ĐỊNH MỨC (%) */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <h3 className="text-sm font-bold text-slate-800 uppercase">3. ĐỊNH MỨC (%)</h3>
                      <div className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold transition-colors",
                        totalRatio === 100 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      )}>
                        Tổng: {totalRatio}%
                      </div>
                    </div>
                    <div className="space-y-3">
                      <RatioInput label="TN4" color="text-blue-600" value={config.ratios.tn4} onChange={(val) => setConfig({...config, ratios: {...config.ratios, tn4: val}})} />
                      <RatioInput label="Đ/S" color="text-purple-600" value={config.ratios.ds} onChange={(val) => setConfig({...config, ratios: {...config.ratios, ds: val}})} />
                      <RatioInput label="Điền" color="text-emerald-600" value={config.ratios.dien} onChange={(val) => setConfig({...config, ratios: {...config.ratios, dien: val}})} />
                      <RatioInput label="TL" color="text-orange-600" value={config.ratios.tl} onChange={(val) => setConfig({...config, ratios: {...config.ratios, tl: val}})} />
                    </div>
                  </section>
                </div>

                {/* 5. MỨC ĐỘ NHẬN THỨC (%) */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="text-sm font-bold text-slate-800 uppercase">5. MỨC ĐỘ NHẬN THỨC (%)</h3>
                    <div className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold transition-colors",
                      totalLevel === 100 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    )}>
                      Tổng: {totalLevel}%
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    <RatioInput label="NB" color="text-slate-600" value={config.levels.nb} onChange={(val) => setConfig({...config, levels: {...config.levels, nb: val}})} />
                    <RatioInput label="TH" color="text-slate-600" value={config.levels.th} onChange={(val) => setConfig({...config, levels: {...config.levels, th: val}})} />
                    <RatioInput label="VD" color="text-slate-600" value={config.levels.vd} onChange={(val) => setConfig({...config, levels: {...config.levels, vd: val}})} />
                    <RatioInput label="VDC" color="text-slate-600" value={config.levels.vdc} onChange={(val) => setConfig({...config, levels: {...config.levels, vdc: val}})} />
                  </div>
                </section>

                <div className="space-y-4">
                  <button 
                    onClick={() => handleGenerate('matrix')}
                    disabled={loading || totalRatio !== 100 || totalLevel !== 100 || selectedSubItemIds.length === 0}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                    Bắt đầu tạo Ma trận
                  </button>
                  
                  {(totalRatio !== 100 || totalLevel !== 100) && (
                    <p className="text-[10px] text-red-500 font-bold text-center animate-pulse">
                      * Tổng định mức và mức độ phải bằng 100%
                    </p>
                  )}
                  
                  {selectedSubItemIds.length === 0 && (
                    <p className="text-[10px] text-amber-600 font-bold text-center">
                      * Vui lòng chọn ít nhất một nội dung kiến thức
                    </p>
                  )}
                </div>
              </div>

              {/* 4. CHỌN NỘI DUNG KIẾN THỨC */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-bold text-slate-800 uppercase">4. CHỌN NỘI DUNG KIẾN THỨC</h3>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => {
                        const allIds = availableTopics.flatMap(t => t.subItems.map(s => s.id));
                        const allSelected = allIds.every(id => selectedSubItemIds.includes(id));
                        if (allSelected) {
                          setSelectedSubItemIds(prev => prev.filter(id => !allIds.includes(id)));
                        } else {
                          setSelectedSubItemIds(prev => [...new Set([...prev, ...allIds])]);
                        }
                      }}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider transition-colors"
                    >
                      {availableTopics.flatMap(t => t.subItems.map(s => s.id)).every(id => selectedSubItemIds.includes(id)) && selectedSubItemIds.length > 0 ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                    </button>
                    {selectedSubItemIds.length > 0 && (
                      <button 
                        onClick={() => setSelectedSubItemIds([])}
                        className="text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-wider transition-colors"
                      >
                        Xóa tất cả
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-xl p-6 min-h-[500px] shadow-sm flex flex-col">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        <p className="text-xs text-slate-600 font-medium">Khối lớp {config.grade} • {availableTopics.length} Chủ đề</p>
                      </div>
                      <p className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-md">
                        Đã chọn: {selectedSubItemIds.length} nội dung
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      {availableTopics.length > 0 ? (
                        availableTopics.map((topic) => {
                          const selectedCount = topic.subItems.filter(s => selectedSubItemIds.includes(s.id)).length;
                          const isExpanded = expandedTopicId === topic.id;
                          const isAllSelected = selectedCount === topic.subItems.length && selectedCount > 0;
                          const isSomeSelected = selectedCount > 0 && selectedCount < topic.subItems.length;
                          
                          return (
                            <div 
                              key={topic.id}
                              className={cn(
                                "rounded-xl border transition-all duration-200 overflow-hidden",
                                isExpanded ? "border-indigo-400 shadow-md ring-1 ring-indigo-400/20" : "border-slate-200 hover:border-indigo-200"
                              )}
                            >
                              {/* Topic Header */}
                              <div 
                                onClick={() => toggleTopicExpand(topic.id)}
                                className={cn(
                                  "p-4 flex items-center justify-between cursor-pointer transition-colors",
                                  isExpanded ? "bg-indigo-50/30" : "bg-white hover:bg-slate-50"
                                )}
                              >
                                <div className="flex items-center gap-4">
                                  <div 
                                    onClick={(e) => selectAllInTopic(topic.id, e)}
                                    className={cn(
                                      "w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-all shadow-sm",
                                      isAllSelected
                                        ? "bg-indigo-600 border-indigo-600 text-white"
                                        : isSomeSelected
                                          ? "bg-indigo-100 border-indigo-400 text-indigo-600"
                                          : "bg-white border-slate-300 hover:border-indigo-400"
                                    )}
                                  >
                                    {isAllSelected && <Check size={16} strokeWidth={3} />}
                                    {isSomeSelected && <div className="w-2.5 h-0.5 bg-indigo-600 rounded-full" />}
                                  </div>
                                  <div>
                                    <h4 className={cn(
                                      "text-sm font-bold transition-colors",
                                      isExpanded || selectedCount > 0 ? "text-indigo-900" : "text-slate-800"
                                    )}>{topic.title}</h4>
                                    <p className="text-[10px] text-slate-500 line-clamp-1">{topic.description}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  {selectedCount > 0 && (
                                    <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                                      {selectedCount}
                                    </span>
                                  )}
                                  <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                                    isExpanded ? "bg-indigo-100 text-indigo-600" : "text-slate-400"
                                  )}>
                                    <ChevronRight 
                                      size={18} 
                                      className={cn("transition-transform duration-300", isExpanded && "rotate-90")} 
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Sub Items */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-slate-100 bg-white"
                                  >
                                    <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50/50">
                                      {topic.subItems.map((sub) => (
                                        <div 
                                          key={sub.id}
                                          onClick={() => toggleSubItem(sub.id)}
                                          className={cn(
                                            "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border",
                                            selectedSubItemIds.includes(sub.id)
                                              ? "bg-white border-indigo-200 text-indigo-700 shadow-sm"
                                              : "bg-white/50 border-transparent hover:border-slate-200 text-slate-600"
                                          )}
                                        >
                                          <div className={cn(
                                            "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all",
                                            selectedSubItemIds.includes(sub.id)
                                              ? "bg-indigo-600 border-indigo-600 text-white"
                                              : "bg-white border-slate-300"
                                          )}>
                                            {selectedSubItemIds.includes(sub.id) && <Check size={12} strokeWidth={3} />}
                                          </div>
                                          <span className="text-xs font-medium leading-tight">{sub.title}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-full py-20 text-center space-y-2">
                          <p className="text-slate-400 text-sm italic">Chưa có dữ liệu mẫu cho khối lớp này.</p>
                          <p className="text-slate-400 text-xs">Vui lòng chọn khối 6, 7 hoặc 10 để xem demo.</p>
                        </div>
                      )}
                    </div>

                    {selectedSubItemIds.length > 0 && (
                      <div className="mt-auto pt-6">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                            <Sparkles size={14} className="text-indigo-600" />
                            <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Tóm tắt nội dung đã chọn</h5>
                          </div>
                          <div className="max-h-32 overflow-auto custom-scrollbar">
                            <div className="space-y-3">
                              {Object.entries(
                                TOPICS_DATA.reduce((acc, topic) => {
                                  const selected = topic.subItems.filter(s => selectedSubItemIds.includes(s.id));
                                  if (selected.length > 0) acc[topic.title] = selected;
                                  return acc;
                                }, {} as Record<string, typeof TOPICS_DATA[0]['subItems']>)
                              ).map(([title, subs]) => (
                                <div key={title} className="space-y-1">
                                  <p className="text-[10px] font-bold text-indigo-900">{title}</p>
                                  <p className="text-[10px] text-slate-500 leading-relaxed italic">
                                    {subs.map(s => s.title).join(' • ')}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {(step === 'matrix' || step === 'specs' || step === 'test') && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    {step === 'matrix' && <><TableIcon className="text-indigo-600" /> Ma trận đề kiểm tra</>}
                    {step === 'specs' && <><FileText className="text-indigo-600" /> Bản đặc tả đề kiểm tra</>}
                    {step === 'test' && <><ClipboardCheck className="text-indigo-600" /> Đề kiểm tra minh họa</>}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Lớp {config.grade} • {config.examName} • {config.duration} phút</p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => copyToClipboard(results[step])}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all"
                  >
                    {copied ? <CheckCircle2 size={16} className="text-green-600" /> : <Copy size={16} />}
                    {copied ? 'Đã sao chép' : 'Sao chép Markdown'}
                  </button>
                  
                  {step === 'matrix' && (
                    <button 
                      onClick={() => handleGenerate('specs')}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
                    >
                      {loading ? <Loader2 className="animate-spin" size={16} /> : <ChevronRight size={16} />}
                      Tiếp tục: Tạo Bản đặc tả
                    </button>
                  )}

                  {step === 'specs' && (
                    <button 
                      onClick={() => handleGenerate('test')}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
                    >
                      {loading ? <Loader2 className="animate-spin" size={16} /> : <ChevronRight size={16} />}
                      Tiếp tục: Tạo Đề minh họa
                    </button>
                  )}

                  {step === 'test' && (
                    <button 
                      onClick={() => setStep('config')}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all"
                    >
                      <Settings2 size={16} />
                      Thiết lập mới
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10 overflow-auto max-h-[70vh] custom-scrollbar">
                {step === 'matrix' && matrixData.length > 0 ? (
                  <MatrixEditor 
                    initialData={matrixData} 
                    config={{
                      grade: config.grade,
                      semester: config.examName,
                      duration: config.duration,
                      levels: config.levels,
                      ratios: config.ratios
                    }} 
                  />
                ) : step === 'specs' && specsData.length > 0 ? (
                  <SpecsEditor 
                    data={specsData}
                    matrixData={{
                      rows: matrixData,
                      config: {
                        pointsPerQuestion: {
                          tnkq_choice: config.scores.tn4,
                          tnkq_tf: config.scores.ds,
                          tnkq_short: config.scores.dien,
                          essay: config.scores.tl
                        },
                        targets: {
                          tnkq_choice: (config.ratios.tn4 / 100) * 10,
                          tnkq_tf: (config.ratios.ds / 100) * 10,
                          tnkq_short: (config.ratios.dien / 100) * 10,
                          essay: (config.ratios.tl / 100) * 10,
                          knowing: (config.levels.nb / 100) * 10,
                          understanding: (config.levels.th / 100) * 10,
                          applying: ((config.levels.vd + config.levels.vdc) / 100) * 10
                        }
                      }
                    }}
                    config={{
                      grade: config.grade,
                      semester: config.examName,
                      duration: parseInt(config.duration)
                    }}
                    onReset={() => setStep('config')}
                  />
                ) : step === 'test' ? (
                  <TestPreview 
                    content={results.test}
                    config={{
                      grade: config.grade,
                      semester: config.examName,
                      duration: config.duration,
                      subject: config.subject,
                      schoolLevel: config.schoolLevel
                    }}
                    onReset={() => setStep('config')}
                  />
                ) : (
                  <div className="markdown-body">
                    <Markdown>{results[step]}</Markdown>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">© 2026 Tạo đề kiểm tra chuẩn CV 7991 - Thầy Lương Mạnh Hoàn hỗ trợ các thầy cô</p>
        </div>
      </footer>
    </div>
  );
}


function ScoreInput({ label, color, value, onChange }: { label: string, color: string, value: number, onChange: (val: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className={cn("text-xs font-bold w-8", color)}>{label}</span>
      <input 
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-20 bg-white border border-slate-300 rounded px-2 py-1 text-xs text-right focus:border-indigo-500 outline-none"
      />
    </div>
  );
}

function RatioInput({ label, color, value, onChange }: { label: string, color: string, value: number, onChange: (val: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className={cn("text-xs font-bold w-8", color)}>{label}</span>
      <input 
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-20 bg-white border border-slate-300 rounded px-2 py-1 text-xs text-right focus:border-indigo-500 outline-none"
      />
    </div>
  );
}

function NavButton({ active, onClick, icon, label, disabled = false }: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
        active ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900",
        disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function StepCard({ number, title, desc, active }: { number: string, title: string, desc: string, active: boolean }) {
  return (
    <div className={cn(
      "p-4 rounded-2xl border transition-all",
      active ? "bg-white/10 border-white/20" : "bg-transparent border-white/5 opacity-60"
    )}>
      <div className="flex gap-4">
        <span className="text-2xl font-mono font-bold text-indigo-300">{number}</span>
        <div>
          <h4 className="font-bold text-lg">{title}</h4>
          <p className="text-sm text-indigo-100/70 leading-snug">{desc}</p>
        </div>
      </div>
    </div>
  );
}


