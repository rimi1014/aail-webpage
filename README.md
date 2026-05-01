# AAIL Website

Aerospace Autonomy and Intelligence Laboratory — Seoul National University

## 콘텐츠 업데이트 방법

디자인 파일(`index.html`, `style.css`, `script.js`)은 건드릴 필요가 없습니다.  
아래 세 파일만 수정하면 됩니다.

---

### 멤버 추가/제거 → `data/members.js`

```js
// 예시: PhD 학생 추가
{ initials: "GD", name: "Gildong Hong", note: "Sep 2026–" },

// 예시: 하이라이트 카드 (본인 등)
{ initials: "AP", name: "Alim Pyon", note: "Mar 2026–", highlight: true },

// 예시: 역할명이 기본값과 다를 때
{ initials: "SK", name: "Seunghoon Kang", role: "PhD Student (Part-time)", note: "ADD · Sep 2025–" },
```

---

### 논문 추가 → `data/publications.js`

```js
// 예시: 저널 논문 추가 (최신 논문을 위에 추가)
{ type: "journal", year: "2027",
  title: "논문 제목",
  authors: "N. Cho, ...",
  venue: "<em>저널 이름</em>, Vol. X, pp. X–X" },

// 예시: 학회 논문 추가
{ type: "conference", year: "2027",
  title: "논문 제목",
  authors: "N. Cho, ...",
  venue: "학회명, 도시" },

// 예시: Preprint 추가
{ type: "preprint", year: "Preprints",
  title: "논문 제목",
  authors: "N. Cho, ...",
  venue: "arXiv:XXXX.XXXXX, Month Year" },
```

---

### 뉴스 추가 → `data/news.js`

```js
// 예시: 뉴스 추가 (최신이 위에 오도록)
{ month: "Sep", year: "2026",
  title: "뉴스 제목",
  text: "뉴스 본문 한두 문장." },
```

---

## GitHub Pages 배포

파일을 수정하고 GitHub에 push하면 자동으로 반영됩니다.

```bash
git add .
git commit -m "Update: 논문/멤버/뉴스 업데이트"
git push
```
