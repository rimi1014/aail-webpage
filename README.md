# AAIL Website

Aerospace Autonomy and Intelligence Laboratory — Seoul National University

---

## 논문 업데이트 (교수님용)

### 방법 A — GitHub 웹사이트에서 직접 편집 (git 설치 불필요)

1. GitHub에 로그인
2. `data/publications.bib` 파일 클릭
3. 우측 상단 연필 아이콘(Edit) 클릭
4. BibTeX 항목을 파일 상단에 붙여넣기
5. **Commit changes** 버튼 클릭
6. 약 2분 후 웹사이트 자동 업데이트

### 방법 B — 로컬에서 편집 (git 설치된 경우)

1. `data/publications.bib` 파일을 텍스트 에디터로 편집
2. `update.bat` 더블클릭 (Mac이면 `update.sh`)
3. 약 2분 후 웹사이트 자동 업데이트

### BibTeX 항목 예시

Google Scholar, DOI 페이지, Zotero 등에서 BibTeX를 복사해서 붙여넣으면 됩니다.

```bibtex
% 저널 논문
@article{cho2027example,
  author  = {N. Cho and A. Pyon},
  title   = {논문 제목},
  journal = {IEEE Transactions on Automatic Control},
  year    = {2027},
  volume  = {72},
  number  = {1},
  pages   = {1--10},
}

% 학회 논문
@inproceedings{cho2027conf,
  author    = {N. Cho and A. Pyon},
  title     = {논문 제목},
  booktitle = {64th IEEE Conference on Decision and Control},
  year      = {2027},
  address   = {Seoul, Korea},
}

% Preprint (arXiv)
@misc{cho2027preprint,
  author  = {N. Cho and A. Pyon},
  title   = {논문 제목},
  year    = {2027},
  month   = {jan},
  eprint  = {2701.00000},
  archivePrefix = {arXiv},
}
```

> ⚠️ `data/publications.js`는 자동 생성 파일입니다. 직접 수정하지 마세요.

---

## 기타 콘텐츠 업데이트

`data/` 폴더 안의 파일만 수정하면 됩니다. 수정 후 GitHub에 push(또는 웹에서 커밋)하면 즉시 반영됩니다.

### 멤버 → `data/members.js`

```js
{ initials: "GD", name: "Gildong Hong", note: "Sep 2026–" },

// 하이라이트 카드
{ initials: "AP", name: "Alim Pyon", note: "Mar 2026–", highlight: true },

// 역할 직접 지정
{ initials: "SK", name: "Seunghoon Kang", role: "PhD Student (Part-time)", note: "ADD · Sep 2025–" },
```

### 뉴스 → `data/news.js`

```js
{ month: "Sep", year: "2026",
  title: "뉴스 제목",
  text: "뉴스 본문 한두 문장." },
```

### 프로젝트 → `data/projects.js`

`ongoing`(진행 중)과 `completed`(완료) 배열에 각각 추가합니다.

```js
// PROJECTS.ongoing 또는 PROJECTS.completed 배열에 추가
{
  title       : "과제명",           // 필수
  period      : "2026.1 – 2028.12", // 필수
  agency      : "NRF",              // 필수 (지원 기관)
  program     : "사업명",           // 선택
  institution : "기관명",           // 선택
  note        : "기타 설명",        // 선택
},
```

과제 완료 시 `ongoing`에서 `completed`로 이동하면 됩니다.

### 갤러리 → `data/gallery.js`

```js
{ title: "Lab Dinner 2026",
  date: "Dec 2026",
  cover: "images/gallery/lab-dinner-2026.jpg", // 이미지 없으면 빈 문자열 ""
  body: "본문 내용." },
```

이미지 파일은 `images/gallery/` 폴더에 넣으면 됩니다.

### 협력자 → `data/collaborators.js`

```js
{ name: "Collaborator Name", url: "https://homepage.edu" }, // url 없으면 빈 문자열 ""
```

---

## 배포 방법 (개발자용)

```bash
# 방법 1: 스크립트 사용
./update.sh        # Mac/Linux
update.bat         # Windows

# 방법 2: 직접 git 명령
git add data/
git commit -m "Update content"
git push
```

논문은 push 후 GitHub Actions가 자동으로 `publications.bib` → `publications.js` 변환합니다.
