import React, { useState } from 'react';
import { X, FileSpreadsheet, Download, Calendar, CheckSquare, Layers } from 'lucide-react';
import { Lesson } from '../types/lesson';
import { exportLessonsToExcel } from '../utils/excelExport';

interface ExcelExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentDateLessons: Lesson[];
  allLessons: Lesson[];
  selectedDate: string;
  onSuccessToast: (filename: string, count: number) => void;
}

export const ExcelExportDialog: React.FC<ExcelExportDialogProps> = ({
  isOpen,
  onClose,
  currentDateLessons,
  allLessons,
  selectedDate,
  onSuccessToast,
}) => {
  const [scope, setScope] = useState<'today' | 'all'>('today');
  const [filename, setFilename] = useState(`수업일지_${selectedDate}.xlsx`);

  React.useEffect(() => {
    if (scope === 'today') {
      setFilename(`수업일지_${selectedDate}.xlsx`);
    } else {
      setFilename(`수업일지_전체_${selectedDate}.xlsx`);
    }
  }, [scope, selectedDate]);

  if (!isOpen) return null;

  const targetLessons = scope === 'today' ? currentDateLessons : allLessons;

  const handleExport = () => {
    if (targetLessons.length === 0) {
      alert('저장할 수업 데이터가 없습니다.');
      return;
    }

    const cleanFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
    const ok = exportLessonsToExcel(targetLessons, scope === 'today' ? selectedDate : undefined, {
      customFilename: cleanFilename,
      sheetName: scope === 'today' ? `${selectedDate} 수업` : '전체수업일지',
    });

    if (ok) {
      onSuccessToast(cleanFilename, targetLessons.length);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">엑셀(.xlsx)로 저장하기</h3>
              <p className="text-xs text-slate-500">작성된 수업 진도와 메모를 엑셀 파일로 추출합니다</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* 범위 선택 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">저장 범위 선택</label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setScope('today')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  scope === 'today'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    선택 날짜만
                  </span>
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {currentDateLessons.length}건
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-2">{selectedDate} 수업</span>
              </button>

              <button
                type="button"
                onClick={() => setScope('all')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  scope === 'all'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    전체 누적
                  </span>
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                    {allLessons.length}건
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-2">등록된 모든 날짜 통합</span>
              </button>
            </div>
          </div>

          {/* 파일명 입력 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              저장될 파일명
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              * 확장자(.xlsx)는 자동으로 지정되며 모든 엑셀 프로그램에서 호환됩니다.
            </p>
          </div>

          {/* 시트 포함 내용 안내 */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
              엑셀 파일에 포함되는 항목:
            </div>
            <p className="text-[11px] text-slate-500">
              교시/시간, 과목명, 학급/대상, 수업 주제 및 진도, 숙제 및 과제, <strong>수업별 상세 메모</strong>, 진행 상태 + 요약 통계 시트
            </p>
          </div>
        </div>

        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={targetLessons.length === 0}
            className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            엑셀 파일 다운로드 ({targetLessons.length}개 수업)
          </button>
        </div>
      </div>
    </div>
  );
};
