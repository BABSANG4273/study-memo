export type LessonStatus = '완료' | '진행중' | '보강' | '휴강';

export interface Lesson {
  id: string;
  date: string;          // YYYY-MM-DD
  period: string;        // e.g. "1교시", "2교시", "10:00 ~ 11:30"
  subject: string;       // e.g. "수학", "영어", "국어"
  className: string;     // e.g. "2학년 3반", "중등심화반"
  topic: string;         // 수업 내용 / 진도 / 단원
  homework: string;      // 과제 및 준비물
  memo: string;          // 수업별 상세 메모 / 학생 반응 / 특이사항
  status: LessonStatus;  // 수업 상태
  color?: string;        // 시각적 구분 컬러
  createdAt: number;
  updatedAt: number;
}

export type ViewMode = 'cards' | 'table';

export const COMMON_SUBJECTS = [
  '국어',
  '수학',
  '영어',
  '과학',
  '사회',
  '역사',
  '도덕',
  '체육',
  '음악',
  '미술',
  '정보/코딩',
  '자율/창체',
];

export const COMMON_PERIODS = [
  '1교시',
  '2교시',
  '3교시',
  '4교시',
  '5교시',
  '6교시',
  '7교시',
  '방과후',
  '야간자율',
];

export const SUBJECT_COLORS: Record<string, string> = {
  수학: 'border-blue-500 bg-blue-50 text-blue-700',
  영어: 'border-indigo-500 bg-indigo-50 text-indigo-700',
  국어: 'border-rose-500 bg-rose-50 text-rose-700',
  과학: 'border-emerald-500 bg-emerald-50 text-emerald-700',
  사회: 'border-amber-500 bg-amber-50 text-amber-700',
  역사: 'border-orange-500 bg-orange-50 text-orange-700',
  체육: 'border-cyan-500 bg-cyan-50 text-cyan-700',
  음악: 'border-purple-500 bg-purple-50 text-purple-700',
  미술: 'border-pink-500 bg-pink-50 text-pink-700',
  '정보/코딩': 'border-teal-500 bg-teal-50 text-teal-700',
};
