// ══════════════════════════════════════════════════════════════
//  PROJECTS DATA  —  data/projects.js
//  프로젝트 추가/수정은 이 파일만 수정하면 됩니다.
//  웹페이지에는 자동으로 반영됩니다.
//
//  ── 구조 ──────────────────────────────────────────────────────
//  PROJECTS.ongoing   : 진행 중인 과제 배열
//  PROJECTS.completed : 완료된 과제 배열
//
//  ── 과제 추가 방법 ────────────────────────────────────────────
//  해당 배열(ongoing / completed)에 아래 형식으로 객체 추가:
//
//    {
//      title       : "과제명",               ← 필수
//      period      : "2025.9 – 2027.5",      ← 필수
//      agency      : "지원 기관명",           ← 필수
//      program     : "사업명",               ← 선택 (없으면 생략)
//      institution : "기관명",               ← 선택 (없으면 생략)
//      note        : "기타 설명",            ← 선택 (없으면 생략)
//    },
//
//  ── 완료 과제 추가 예시 ───────────────────────────────────────
//  completed 배열이 비어있으면 "No completed projects" 문구 표시.
//  과제가 완료되면 ongoing에서 completed로 이동하고 period 업데이트.
//
//  ── 표시되는 필드 ─────────────────────────────────────────────
//  period / agency 는 항상 표시.
//  program / institution / note 는 값이 있을 때만 표시.
// ══════════════════════════════════════════════════════════════

const PROJECTS = {

  ongoing: [
    {
      title: "D3C: Direct Data-Driven Control for Safe and Efficient Autonomous Systems",
      period: "2026.1 – 2027.1",
      agency: "Seoul National University (SNU)",
    },
    {
      title: "Data-Driven Safe and Adaptive Control of Autonomous Systems",
      period: "2025.9 – 2027.8",
      agency: "Seoul National University (SNU)",
    },
    {
      title: "ReUSV-41",
      period: "2025.9 – 2028.10",
      agency: "Korea Research Institute for Defense Technology Planning and Advancement (KRIT)",
    },
    {
      title: "UAVRC",
      period: "2025.9 – 2027.5",
      agency: "National Research Foundation of Korea (NRF)",
    },
    {
      title: "TD-21",
      period: "2025.9 – 2027.2",
      agency: "Agency for Defense Development (ADD)",
    },
  ],

  completed: [],

};
