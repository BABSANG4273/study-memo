import * as XLSX from 'xlsx';
import { Lesson } from '../types/lesson';

/**
 * 수업 목록을 엑셀(.xlsx) 파일로 변환하여 브라우저에서 바로 다운로드합니다.
 */
export function exportLessonsToExcel(
  lessons: Lesson[],
  targetDate?: string,
  options?: { sheetName?: string; customFilename?: string }
): boolean {
  if (!lessons || lessons.length === 0) {
    return false;
  }

  // 1. 메인 수업 데이터 포맷팅
  const formattedData = lessons.map((item, idx) => ({
    번호: idx + 1,
    날짜: item.date,
    '교시/시간': item.period,
    과목: item.subject,
    '학급/반': item.className || '-',
    '수업 주제 및 진도': item.topic || '-',
    '숙제/과제': item.homework || '없음',
    '수업 메모 및 특이사항': item.memo || '-',
    상태: item.status,
  }));

  // 워크시트 생성
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // 열 너비 지정 (엑셀 열기 시 가독성 극대화)
  worksheet['!cols'] = [
    { wch: 6 },  // 번호
    { wch: 13 }, // 날짜
    { wch: 12 }, // 교시/시간
    { wch: 14 }, // 과목
    { wch: 14 }, // 학급/반
    { wch: 32 }, // 수업 주제 및 진도
    { wch: 25 }, // 숙제/과제
    { wch: 45 }, // 수업 메모 및 특이사항
    { wch: 10 }, // 상태
  ];

  // 워크북 생성
  const workbook = XLSX.utils.book_new();
  const mainSheetName = options?.sheetName || (targetDate ? `${targetDate} 수업일지` : '수업일지');
  // 엑셀 시트 이름 최대 길이 31자 제한 대응
  const safeSheetName = mainSheetName.slice(0, 30);
  XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName);

  // 2. 통계 및 요약 시트 추가 (총 수업 수, 완료 건수, 과목별 현황)
  const totalCount = lessons.length;
  const completedCount = lessons.filter(l => l.status === '완료').length;
  const homeworkAssigned = lessons.filter(l => l.homework && l.homework.trim() !== '').length;
  
  // 과목별 카운트
  const subjectCounts: Record<string, number> = {};
  lessons.forEach(l => {
    subjectCounts[l.subject] = (subjectCounts[l.subject] || 0) + 1;
  });
  const subjectSummary = Object.entries(subjectCounts)
    .map(([subj, count]) => `${subj} (${count}건)`)
    .join(', ');

  const summaryData = [
    { 항목: '일지 기준일', 내용: targetDate || '전체' },
    { 항목: '총 수업 건수', 내용: `${totalCount}개` },
    { 항목: '수업 완료 건수', 내용: `${completedCount}개` },
    { 항목: '과제 부여 수업', 내용: `${homeworkAssigned}개` },
    { 항목: '포함 과목 목록', 내용: subjectSummary || '-' },
    { 항목: '엑셀 생성 일시', 내용: new Date().toLocaleString('ko-KR') },
  ];

  const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
  summaryWorksheet['!cols'] = [{ wch: 18 }, { wch: 45 }];
  XLSX.utils.book_append_sheet(workbook, summaryWorksheet, '일지 요약');

  // 3. 파일명 결정 및 저장 실행
  let filename = options?.customFilename;
  if (!filename) {
    if (targetDate) {
      filename = `수업일지_${targetDate}.xlsx`;
    } else {
      const todayStr = new Date().toISOString().slice(0, 10);
      filename = `수업일지_전체_${todayStr}.xlsx`;
    }
  }

  // 브라우저 파일 다운로드 트리거
  XLSX.writeFile(workbook, filename);
  return true;
}
