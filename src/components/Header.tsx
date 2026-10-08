import React from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  TableProperties, 
  Download,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import { ViewMode } from '../types/lesson';

interface HeaderProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  todayString: string;
  lessonCount: number;
  memoCount: number;
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  onOpenAddModal: () => void;
  onSaveToExcel: () => void;
  isAutoSaved: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedDate,
  onSelectDate,
  todayString,
  lessonCount,
  memoCount,
  viewMode,
  onToggleViewMode,
  onOpenAddModal,
  onSaveToExcel,
  isAutoSaved,
}) => {
  // Move date by +/- 1 day
  const handleShiftDate = (offsetDays: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + offsetDays);
    const newDateStr = current.toISOString().slice(0, 10);
    onSelectDate(newDateStr);
  };

  const isToday = selectedDate === todayString;

  // Format Korean date: e.g. 2026년 10월 1일 (목)
  const formattedDate = (() => {
    try {
      const parts = selectedDate.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        return `${parts[0]}년 ${parts[1]}월 ${parts[2]}일 (${dayNames[d.getDay()]})`;
      }
    } catch {
      // fallback
    }
    return selectedDate;
  })();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Top row: Brand & Primary Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo and title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/10">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  오늘의 수업 일지 &amp; 메모
                </h1>
                {isAutoSaved && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 font-medium">
                    <CheckCircle className="w-3 h-3" />
                    자동 보관됨
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                수업 추가 후 메모를 작성하고 <strong className="text-emerald-700 font-semibold">[저장]</strong>을 누르면 엑셀 파일로 바로 다운로드됩니다.
              </p>
            </div>
          </div>

          {/* Action buttons: '수업 추가하기' & '저장 (엑셀 다운로드)' */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* View Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-slate-600">
              <button
                type="button"
                onClick={() => onToggleViewMode('cards')}
                className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'hover:text-slate-900'
                }`}
                title="카드 뷰"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">카드</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleViewMode('table')}
                className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'hover:text-slate-900'
                }`}
                title="엑셀 표 뷰"
              >
                <TableProperties className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">표 (엑셀 미리보기)</span>
              </button>
            </div>

            {/* 수업 추가하기 button */}
            <button
              type="button"
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              수업 추가하기
            </button>

            {/* 저장 (엑셀 다운로드) button - Key User Requirement */}
            <button
              type="button"
              onClick={onSaveToExcel}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
              title="현재 수업 목록과 메모를 엑셀(.xlsx) 파일로 저장합니다"
            >
              <FileSpreadsheet className="w-4 h-4 stroke-[2.2]" />
              <span>저장 (엑셀 다운로드)</span>
              {lessonCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-emerald-800 text-[11px] font-bold text-emerald-100">
                  {lessonCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom row: Date selector & Quick Stats */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          {/* Date Picker Bar */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => handleShiftDate(-1)}
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              title="이전 날"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onSelectDate(e.target.value)}
                className="text-xs font-semibold text-slate-800 bg-transparent border-none outline-hidden cursor-pointer"
              />
              <span className="text-xs text-slate-500 font-medium hidden md:inline">
                ({formattedDate})
              </span>
            </div>

            <button
              onClick={() => handleShiftDate(1)}
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              title="다음 날"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {!isToday && (
              <button
                onClick={() => onSelectDate(todayString)}
                className="text-xs px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition-colors cursor-pointer border border-blue-200"
              >
                오늘로 이동
              </button>
            )}
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-1">
              <span className="text-slate-400">등록된 수업:</span>
              <span className="font-bold text-slate-900">{lessonCount}건</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1">
              <span className="text-slate-400">작성된 메모:</span>
              <span className="font-bold text-amber-700">{memoCount}건</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
