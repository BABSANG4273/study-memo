import React, { useState, useEffect } from 'react';
import { X, Plus, Clock, BookOpen, Users, FileText, CheckCircle2 } from 'lucide-react';
import { Lesson, LessonStatus, COMMON_SUBJECTS, COMMON_PERIODS } from '../types/lesson';

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Lesson | null;
  defaultDate: string;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultDate,
}) => {
  const [date, setDate] = useState(defaultDate);
  const [period, setPeriod] = useState('1교시');
  const [subject, setSubject] = useState('수학');
  const [className, setClassName] = useState('');
  const [topic, setTopic] = useState('');
  const [homework, setHomework] = useState('');
  const [memo, setMemo] = useState('');
  const [status, setStatus] = useState<LessonStatus>('완료');

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setPeriod(initialData.period);
      setSubject(initialData.subject);
      setClassName(initialData.className || '');
      setTopic(initialData.topic || '');
      setHomework(initialData.homework || '');
      setMemo(initialData.memo || '');
      setStatus(initialData.status);
    } else {
      setDate(defaultDate);
      setPeriod('1교시');
      setSubject('수학');
      setClassName('');
      setTopic('');
      setHomework('');
      setMemo('');
      setStatus('완료');
    }
  }, [initialData, defaultDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      return;
    }
    onSave({
      date,
      period: period.trim() || '수업',
      subject: subject.trim(),
      className: className.trim(),
      topic: topic.trim(),
      homework: homework.trim(),
      memo: memo.trim(),
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {initialData ? '수업 내용 및 메모 수정' : '오늘 있었던 수업 추가하기'}
              </h2>
              <p className="text-xs text-slate-500">
                과목별 진도와 상세 메모를 기록하면 엑셀 파일로 함께 저장됩니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* 날짜 및 상태 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                수업 날짜
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                진행 상태
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LessonStatus)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-white text-slate-800"
              >
                <option value="완료">완료 (정상 진행)</option>
                <option value="진행중">진행중</option>
                <option value="보강">보강 수업</option>
                <option value="휴강">휴강</option>
              </select>
            </div>
          </div>

          {/* 교시/시간 선택 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                교시 / 시간
              </label>
              <span className="text-[11px] text-slate-400">직접 입력 가능</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {COMMON_PERIODS.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer border ${
                    period === p
                      ? 'bg-blue-600 text-white border-blue-600 font-medium'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="예: 1교시 또는 09:00 ~ 09:50"
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-white text-slate-800"
            />
          </div>

          {/* 과목 및 학급 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  과목명 *
                </label>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {COMMON_SUBJECTS.slice(0, 6).map((sub) => (
                  <button
                    type="button"
                    key={sub}
                    onClick={() => setSubject(sub)}
                    className={`text-[11px] px-2 py-0.5 rounded transition-colors cursor-pointer border ${
                      subject === sub
                        ? 'bg-blue-600 text-white border-blue-600 font-medium'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="예: 수학, 영어, 국어 등"
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                학급 / 대상
              </label>
              <div className="h-[25px] flex items-center">
                <span className="text-[11px] text-slate-400">담당 반이나 그룹명 입력</span>
              </div>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="예: 2학년 3반, 고등 심화반, 1:1 과외"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-white text-slate-800"
              />
            </div>
          </div>

          {/* 수업 주제 및 진도 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              수업 주제 및 진도
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="예: 3단원 이차방정식 풀이 및 개념 설명 (교과서 45~50p)"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-white text-slate-800"
            />
          </div>

          {/* 과제 / 숙제 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              과제 및 다음 시간 준비물
            </label>
            <input
              type="text"
              value={homework}
              onChange={(e) => setHomework(e.target.value)}
              placeholder="예: 워크북 12쪽까지 풀어오기, 다음 시간 준비물: 각도기"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-white text-slate-800"
            />
          </div>

          {/* 수업 메모 (핵심 기능) */}
          <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/70">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                수업별 상세 메모 (학생 피드백, 특이사항, 질문 등)
              </label>
              <span className="text-[11px] text-amber-700 font-medium">엑셀에 메모 열로 저장</span>
            </div>
            <textarea
              rows={4}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="수업 중 특이사항, 학생들의 이해도, 개별 피드백, 보충 필요 내용, 다음 시간 연결 포인트 등을 자유롭게 메모하세요."
              className="w-full px-3 py-2.5 text-sm border border-amber-300/80 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden bg-white text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {initialData ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  수정 완료
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  수업 등록하기
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
