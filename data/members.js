// ══════════════════════════════════════════════════════════════
//  MEMBERS DATA
//  멤버 추가/제거는 이 파일만 수정하면 됩니다.
//
//  각 멤버 필드:
//    initials  : 아바타에 표시할 이니셜 (2글자, 예: "AP")
//    name      : 이름
//    role      : (선택) 기본값은 그룹 타이틀 사용. 다를 경우에만 작성.
//    note      : 소속, 기간, 연구 주제 등 (한 줄)
//    photo     : (선택) 프로필 사진 URL. 없으면 이니셜 아바타 표시.
//    interests : (선택) 관심 연구 분야 배열. 예: ["Control Theory", "UAV GNC"]
//    highlight : (선택) true 이면 골드 강조 카드
// ══════════════════════════════════════════════════════════════

const MEMBERS = {

  // ── Seoul National University ──────────────────────────────
  snu: {
    phd: [
      { initials: "SJ", name: "Seongmin Jeong",  note: "ROKA · Mar 2026–" },
      { initials: "JK", name: "Jaewon Kim",       note: "Mar 2026–" },
      { initials: "SK", name: "Seunghoon Kang",   role: "PhD Student (Part-time)",
        note: "ADD · Sep 2025– · Forward Reachability Analysis for Range Safety" },
    ],
    msc: [
      { initials: "AP", name: "Alim Pyon", note: "Mar 2026–", highlight: true },
    ],
    bsc: [
      { initials: "JK", name: "Junho Kim",     note: "Mar 2026–" },
      { initials: "JK", name: "Jungwon Kim",   note: "Mar 2026–" },
      { initials: "SO", name: "Seungseok Oh",  note: "Nov 2025–" },
      { initials: "JL", name: "Jaeyoung Lee",  note: "Nov 2025–" },
      { initials: "HA", name: "Hyeonseo An",   note: "Nov 2025–" },
    ],
  },

  // ── Cranfield University (Co-supervised) ──────────────────
  cranfield: {
    phd: [
      { initials: "MS", name: "Muhammad Haad Shaikh",
        note: "Advanced Energy Management for Zero-Emission Aircraft" },
      { initials: "AI", name: "Abubakar Ibrahim",
        note: "Region-of-Attraction Analysis via Sum-of-Squares" },
      { initials: "RC", name: "Rodrigo Carvalho de Paulo",
        note: "Learning-Based Autonomous Aerial Refueling" },
      { initials: "SO", name: "Saki Omi",
        note: "Dynamic Deep-RL in Partially Observed MDPs" },
      { initials: "YL", name: "Yunha Lee",
        note: "Domain-Knowledge-Aided Learning for Autopilot Design" },
    ],
  },

};
