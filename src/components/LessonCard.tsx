import React, { useState } from 'react';
import { 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  MessageSquare, 
  BookOpen, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Save
} from 'lucide-react';
import { Lesson, LessonStatus, SUBJECT_COLORS } from '../types/lesson';

interface LessonCardProps {
  lesson: Lesson;
  onEdit: (lesson: Lesson) => void;
  onDelete: (id: string) => void;
  onDuplicate: (lesson: Lesson) => void;
  onUpdateMemo: (id: string, newMemo: string) => void;
  onUpdateStatus: (id: string, newStatus: LessonStatus) => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  onEdit,
  onDelete,
  onDuplicate,
  onUpdateMemo,
  onUpdateStatus,
}) => {
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [memoDraft, setMemoDraft] = useState(lesson.memo);

  const handleSaveMemo = () => {
    onUpdateMemo(lesson.id, memoDraft);
    setIsEditingMemo(false);
  };

  const handleCancelMemo = () => {
    setMemoDraft(lesson.memo);
    setIsEditingMemo(false);
  };

  const subjectBadgeClass = SUBJECT_COLORS[lesson.subject] || 'border-slate-300 bg-slate-100 text-slate-800';

  const statusBadges: Record<LessonStatus, { text: string; bg: string; icon: React.ReactNode }> = {
    완료: {
      text: '완료',
      bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    진행중: {
      text: '진행중',
      bg: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    보강: {
      text: '보강',
      bg: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
    },
    휴강: {
      text: '휴강',
      bg: 'bg-rose-100 text-rose-800 border-rose-200',
      icon: <HelpCircle className="w-3.5 h-3.5" />,
    },
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/60 to-transparent">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Period Badge */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-900 text-white shadow-2xs">
              <Clock className="w-3 h-3" />
              {lesson.period}
            </span>

            {/* Subject Badge */}
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${subjectBadgeClass}`}>
              {lesson.subject}
            </span>

            {/* Class / Target */}
            {lesson.className && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-slate-600 bg-slate-100">
                <Users className="w-3 h-3 text-slate-400" />
                {lesson.className}
              </span>
            )}
          </div>

          {/* Status selector badge */}
          <div className="relative group shrink-0">
            <select
              value={lesson.status}
              onChange={(e) => onUpdateStatus(lesson.id, e.target.value as LessonStatus)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer outline-hidden transition-colors ${statusBadges[lesson.status].bg}`}
            >
              <option value="완료">● 완료</option>
              <option value="진행중">● 진행중</option>
              <option value="보강">● 보강</option>
              <option value="휴강">● 휴강</option>
            </select>
          </div>
        </div>

        {/* Topic / Progress */}
        <div className="mt-3">
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-slate-500">수업 주제 및 진도</p>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5 line-clamp-2">
                {lesson.topic || '기록된 주제가 없습니다.'}
              </h3>
            </div>
          </div>
        </div>

        {/* Homework */}
        {lesson.homework && (
          <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-indigo-50/60 border border-indigo-100 flex items-start gap-2 text-xs text-indigo-900">
            <span className="font-bold text-indigo-700 shrink-0 mt-0.5">과제/숙제:</span>
            <span className="text-indigo-800 break-all">{lesson.homework}</span>
          </div>
        )}
      </div>

      {/* Memo Section (Key Feature) */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col bg-amber-50/30 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
            수업 메모 &amp; 특이사항
          </div>
          {!isEditingMemo && (
            <button
              onClick={() => {
                setMemoDraft(lesson.memo);
                setIsEditingMemo(true);
              }}
              className="text-[11px] text-amber-700 hover:text-amber-900 font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              메모 바로 수정
            </button>
          )}
        </div>

        {isEditingMemo ? (
          <div className="space-y-2 mt-1">
            <textarea
              rows={3}
              value={memoDraft}
              onChange={(e) => setMemoDraft(e.target.value)}
              placeholder="수업 메모를 입력하세요 (엑셀에 함께 저장됩니다)"
              className="w-full text-xs p-2.5 bg-white border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-slate-800"
              autoFocus
            />
            <div className="flex items-center justify-end gap-1.5">
              <button
                onClick={handleCancelMemo}
                className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200/60 rounded cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleSaveMemo}
                className="px-3 py-1 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <Save className="w-3 h-3" />
                메모 저장
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => {
              setMemoDraft(lesson.memo);
              setIsEditingMemo(true);
            }}
            className="text-xs text-slate-700 whitespace-pre-wrap rounded-lg p-2.5 bg-white/80 border border-amber-200/60 min-h-[58px] cursor-pointer hover:border-amber-300 transition-colors"
            title="클릭하여 바로 메모를 수정할 수 있습니다"
          >
            {lesson.memo ? (
              lesson.memo
            ) : (
              <span className="text-slate-400 italic">
                클릭하여 수업 중 메모, 학생 피드백, 준비사항을 작성해보세요.
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="px-4 py-2.5 bg-slate-50 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400">
          {new Date(lesson.updatedAt || lesson.createdAt).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          })}{' '}
          수정됨
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onDuplicate(lesson)}
            title="수업 복사하기 (다음 교시로 복사)"
            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200/70 rounded-md transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEdit(lesson)}
            title="수업 전체 수정"
            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (window.confirm(`'${lesson.period} ${lesson.subject}' 수업을 삭제하시겠습니까?`)) {
                onDelete(lesson.id);
              }
            }}
            title="수업 삭제"
            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
