import React from 'react';
import { Plus, BookOpen, Sparkles, FileSpreadsheet } from 'lucide-react';

interface EmptyStateProps {
  date: string;
  onAddClass: () => void;
  onLoadSamples: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  date,
  onAddClass,
  onLoadSamples,
}) => {
  return (
    <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto my-6">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
        <BookOpen className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">
        {date}에 등록된 수업이 없습니다
      </h3>
      <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto leading-relaxed">
        오늘 진행된 수업을 차례대로 추가하고 수업별 메모와 과제를 기록해보세요. 
        작성된 모든 내용은 상단의 <strong className="text-emerald-700">저장 버튼</strong>을 눌러 엑셀 파일로 바로 다운로드할 수 있습니다.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onAddClass}
          className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          수업 추가하기
        </button>

        <button
          onClick={onLoadSamples}
          className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          예시 수업 불러와보기
        </button>
      </div>

      <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
          클릭 한 번으로 엑셀(.xlsx) 저장
        </span>
        <span>•</span>
        <span>실시간 로컬 자동 저장</span>
      </div>
    </div>
  );
};
