import React from 'react';
import { Lesson, LessonStatus, SUBJECT_COLORS } from '../types/lesson';
import { Edit3, Trash2, CheckCircle2, Clock, AlertCircle, HelpCircle } from 'lucide-react';

interface LessonTableViewProps {
  lessons: Lesson[];
  onEdit: (lesson: Lesson) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: LessonStatus) => void;
}

export const LessonTableView: React.FC<LessonTableViewProps> = ({
  lessons,
  onEdit,
  onDelete,
  onUpdateStatus,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-xs font-semibold text-slate-700">엑셀 시트 미리보기 형태 (총 {lessons.length}개 수업)</span>
        </div>
        <span className="text-[11px] text-slate-400">저장 시 이 표 형태 그대로 .xlsx 파일로 추출됩니다</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 border-collapse">
          <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-3 w-12 text-center">번호</th>
              <th className="py-3 px-3 w-24">교시/시간</th>
              <th className="py-3 px-3 w-20">과목</th>
              <th className="py-3 px-3 w-24">학급/대상</th>
              <th className="py-3 px-4 min-w-[180px]">수업 주제 및 진도</th>
              <th className="py-3 px-4 min-w-[160px]">숙제/과제</th>
              <th className="py-3 px-4 min-w-[220px]">수업 메모 및 특이사항</th>
              <th className="py-3 px-3 w-24 text-center">상태</th>
              <th className="py-3 px-3 w-20 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lessons.map((lesson, index) => {
              const subjectColor = SUBJECT_COLORS[lesson.subject] || 'bg-slate-100 text-slate-700 border-slate-200';
              return (
                <tr key={lesson.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3 px-3 text-center text-slate-400 font-medium">
                    {index + 1}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                    {lesson.period}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${subjectColor}`}>
                      {lesson.subject}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium whitespace-nowrap">
                    {lesson.className || '-'}
                  </td>
                  <td className="py-3 px-4 text-slate-900 font-medium">
                    {lesson.topic || '-'}
                  </td>
                  <td className="py-3 px-4 text-indigo-700">
                    {lesson.homework || '-'}
                  </td>
                  <td className="py-3 px-4 text-slate-700 bg-amber-50/30">
                    {lesson.memo || <span className="text-slate-300 italic">메모 없음</span>}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <select
                      value={lesson.status}
                      onChange={(e) => onUpdateStatus(lesson.id, e.target.value as LessonStatus)}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border cursor-pointer outline-hidden ${
                        lesson.status === '완료'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : lesson.status === '진행중'
                          ? 'bg-blue-50 text-blue-700 border-blue-300'
                          : lesson.status === '보강'
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-rose-50 text-rose-700 border-rose-300'
                      }`}
                    >
                      <option value="완료">완료</option>
                      <option value="진행중">진행중</option>
                      <option value="보강">보강</option>
                      <option value="휴강">휴강</option>
                    </select>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEdit(lesson)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded cursor-pointer"
                        title="수정"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('이 수업을 삭제하시겠습니까?')) {
                            onDelete(lesson.id);
                          }
                        }}
                        className="p-1 text-rose-500 hover:bg-rose-100 rounded cursor-pointer"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
