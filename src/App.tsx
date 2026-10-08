import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Sparkles, 
  Trash2, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  FileDown,
  Settings2,
  ChevronDown
} from 'lucide-react';
import { Lesson, LessonStatus, ViewMode, COMMON_SUBJECTS } from './types/lesson';
import { Header } from './components/Header';
import { LessonCard } from './components/LessonCard';
import { LessonTableView } from './components/LessonTableView';
import { EmptyState } from './components/EmptyState';
import { LessonModal } from './components/LessonModal';
import { ExcelExportDialog } from './components/ExcelExportDialog';
import { ToastContainer, ToastMessage } from './components/Toast';
import { exportLessonsToExcel } from './utils/excelExport';
import { getSampleLessons } from './utils/sampleData';

const LOCAL_STORAGE_KEY = 'school_lesson_journal_data_v1';

export default function App() {
  // Today's ISO date string (YYYY-MM-DD)
  const getTodayISO = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = useMemo(() => getTodayISO(), []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('전체');

  // Lessons storage
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load lessons from localStorage', e);
    }
    // Initial sample data for today so user can see it right away
    return getSampleLessons(getTodayISO());
  });

  const [isAutoSaved, setIsAutoSaved] = useState(true);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isExcelDialogOpen, setIsExcelDialogOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lessons));
      setIsAutoSaved(true);
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [lessons]);

  // Lessons for current selected date
  const currentDateLessons = useMemo(() => {
    return lessons
      .filter((l) => l.date === selectedDate)
      .sort((a, b) => {
        // Natural sort by period or creation
        return a.period.localeCompare(b.period, undefined, { numeric: true });
      });
  }, [lessons, selectedDate]);

  // Filtered by search & subject
  const displayedLessons = useMemo(() => {
    return currentDateLessons.filter((item) => {
      const matchSubject = subjectFilter === '전체' || item.subject === subjectFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.subject.toLowerCase().includes(q) ||
        (item.topic && item.topic.toLowerCase().includes(q)) ||
        (item.memo && item.memo.toLowerCase().includes(q)) ||
        (item.homework && item.homework.toLowerCase().includes(q)) ||
        (item.className && item.className.toLowerCase().includes(q));
      return matchSubject && matchSearch;
    });
  }, [currentDateLessons, subjectFilter, searchQuery]);

  // Available subjects for current day filter
  const daySubjects = useMemo(() => {
    const set = new Set<string>();
    currentDateLessons.forEach((l) => set.add(l.subject));
    return Array.from(set);
  }, [currentDateLessons]);

  // Memo count
  const memoCount = useMemo(() => {
    return currentDateLessons.filter((l) => l.memo && l.memo.trim().length > 0).length;
  }, [currentDateLessons]);

  // Create or Update Lesson
  const handleSaveLesson = (lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingLesson) {
      // Update
      setLessons((prev) =>
        prev.map((l) =>
          l.id === editingLesson.id
            ? { ...l, ...lessonData, updatedAt: Date.now() }
            : l
        )
      );
      addToast('success', '수업이 수정되었습니다', `${lessonData.period} ${lessonData.subject}`);
    } else {
      // Create new
      const newLesson: Lesson = {
        ...lessonData,
        id: 'lesson-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setLessons((prev) => [...prev, newLesson]);
      addToast('success', '새 수업이 추가되었습니다', `${newLesson.period} ${newLesson.subject} 메모 작성 가능`);
    }
    setEditingLesson(null);
  };

  // Quick In-place memo update
  const handleUpdateMemo = (id: string, newMemo: string) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === id ? { ...l, memo: newMemo, updatedAt: Date.now() } : l))
    );
    addToast('success', '메모가 저장되었습니다', '엑셀 저장 시 함께 반영됩니다.');
  };

  // Status update
  const handleUpdateStatus = (id: string, newStatus: LessonStatus) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus, updatedAt: Date.now() } : l))
    );
  };

  // Delete
  const handleDeleteLesson = (id: string) => {
    setLessons((prev) => prev.filter((l) => l.id !== id));
    addToast('info', '수업이 삭제되었습니다');
  };

  // Duplicate
  const handleDuplicateLesson = (lesson: Lesson) => {
    const duplicated: Lesson = {
      ...lesson,
      id: 'lesson-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      period: `${lesson.period} (복사본)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setLessons((prev) => [...prev, duplicated]);
    addToast('success', '수업이 복사되었습니다', duplicated.period);
  };

  // Main Excel Direct Save Action ("저장을 누르면 엑셀로 저장되어야해")
  const handleDirectExcelSave = () => {
    if (currentDateLessons.length === 0) {
      if (lessons.length === 0) {
        alert('저장할 수업이 없습니다. [수업 추가하기] 버튼을 눌러 수업을 먼저 등록해주세요.');
        return;
      }
      // If no lessons today but other dates have lessons, prompt to export all
      setIsExcelDialogOpen(true);
      return;
    }

    const filename = `수업일지_${selectedDate}.xlsx`;
    const ok = exportLessonsToExcel(currentDateLessons, selectedDate, {
      customFilename: filename,
    });

    if (ok) {
      addToast(
        'excel',
        '엑셀 파일로 저장되었습니다!',
        `'${filename}'에 ${currentDateLessons.length}개 수업 및 메모가 성공적으로 저장되었습니다.`
      );
    }
  };

  // Load sample lessons for current day
  const handleLoadSamples = () => {
    const samples = getSampleLessons(selectedDate);
    setLessons((prev) => {
      // Remove current date existing and append samples
      const others = prev.filter((l) => l.date !== selectedDate);
      return [...others, ...samples];
    });
    addToast('success', '예시 수업이 등록되었습니다', '메모를 확인하고 엑셀로 저장해보세요.');
  };

  // Clear current date lessons
  const handleClearCurrentDate = () => {
    if (window.confirm(`${selectedDate}의 모든 수업 기록을 삭제하시겠습니까?`)) {
      setLessons((prev) => prev.filter((l) => l.date !== selectedDate));
      addToast('info', `${selectedDate} 수업 기록이 초기화되었습니다.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Main Header with Actions */}
      <Header
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        todayString={todayStr}
        lessonCount={currentDateLessons.length}
        memoCount={memoCount}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        onOpenAddModal={() => {
          setEditingLesson(null);
          setIsModalOpen(true);
        }}
        onSaveToExcel={handleDirectExcelSave}
        isAutoSaved={isAutoSaved}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Quick Excel Export Hero Banner */}
        <section className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  {selectedDate === todayStr ? '오늘의 수업 일지' : `${selectedDate} 일지`}
                </span>
                <span className="text-xs text-slate-300">
                  총 {currentDateLessons.length}개 수업 등록됨
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-1">
                수업별 진도 &amp; 메모를 기록하고 언제든 엑셀(.xlsx)로 저장하세요
              </h2>
              <p className="text-xs text-slate-300 mt-0.5 hidden sm:block">
                교시, 과목, 학급, 진도, 숙제, 그리고 수업 중 메모까지 열 별로 완벽히 정렬된 엑셀 파일이 즉시 다운로드됩니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            {/* Direct Save Button */}
            <button
              onClick={handleDirectExcelSave}
              className="flex-1 lg:flex-initial px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>지금 엑셀로 저장</span>
            </button>

            {/* More export options */}
            <button
              onClick={() => setIsExcelDialogOpen(true)}
              className="px-3 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-white/15"
              title="저장 옵션 (전체 날짜 저장 / 파일명 변경)"
            >
              <Settings2 className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">저장 옵션</span>
            </button>
          </div>
        </section>

        {/* Filter & Search Bar */}
        {currentDateLessons.length > 0 && (
          <section className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="과목, 수업 주제, 과제, 메모 내용 검색..."
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-slate-50/50"
              />
            </div>

            {/* Subject Filter & Reset */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                과목:
              </span>
              <button
                onClick={() => setSubjectFilter('전체')}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  subjectFilter === '전체'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                전체 ({currentDateLessons.length})
              </button>

              {daySubjects.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSubjectFilter(sub)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    subjectFilter === sub
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {sub}
                </button>
              ))}

              {/* Clear day button */}
              <button
                onClick={handleClearCurrentDate}
                className="text-xs text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition-colors ml-auto cursor-pointer"
                title="오늘 수업 일지 비우기"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </section>
        )}

        {/* Content Body */}
        {currentDateLessons.length === 0 ? (
          <EmptyState
            date={selectedDate}
            onAddClass={() => {
              setEditingLesson(null);
              setIsModalOpen(true);
            }}
            onLoadSamples={handleLoadSamples}
          />
        ) : displayedLessons.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
            검색 조건에 맞는 수업이 없습니다. 검색어를 변경하거나 과목 필터를 초기화해보세요.
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {displayedLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onEdit={(l) => {
                  setEditingLesson(l);
                  setIsModalOpen(true);
                }}
                onDelete={handleDeleteLesson}
                onDuplicate={handleDuplicateLesson}
                onUpdateMemo={handleUpdateMemo}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}

            {/* Quick Add Card at the end */}
            <button
              onClick={() => {
                setEditingLesson(null);
                setIsModalOpen(true);
              }}
              className="min-h-[220px] rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 text-slate-500 hover:text-blue-600 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-white shadow-2xs border border-slate-200 group-hover:border-blue-300 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="font-bold text-sm">다음 교시 수업 추가하기</span>
              <span className="text-xs text-slate-400">클릭하여 새로운 수업을 등록합니다</span>
            </button>
          </div>
        ) : (
          <LessonTableView
            lessons={displayedLessons}
            onEdit={(l) => {
              setEditingLesson(l);
              setIsModalOpen(true);
            }}
            onDelete={handleDeleteLesson}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {/* Footer Excel Export Helper Section */}
        {currentDateLessons.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>
                수업 및 메모는 브라우저에 자동 보관되며, <strong>[저장 (엑셀 다운로드)]</strong> 클릭 시 즉시 .xlsx 파일이 생성됩니다.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingLesson(null);
                  setIsModalOpen(true);
                }}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                수업 추가
              </button>
              <button
                onClick={handleDirectExcelSave}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                엑셀 파일로 저장
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Add / Edit Lesson Modal */}
      <LessonModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLesson(null);
        }}
        onSave={handleSaveLesson}
        initialData={editingLesson}
        defaultDate={selectedDate}
      />

      {/* Detailed Excel Export Dialog */}
      <ExcelExportDialog
        isOpen={isExcelDialogOpen}
        onClose={() => setIsExcelDialogOpen(false)}
        currentDateLessons={currentDateLessons}
        allLessons={lessons}
        selectedDate={selectedDate}
        onSuccessToast={(filename, count) => {
          addToast(
            'excel',
            '엑셀 파일 저장이 완료되었습니다!',
            `'${filename}' (${count}개 수업 일지 포함)`
          );
        }}
      />
    </div>
  );
}
