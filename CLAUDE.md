# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 언어 및 커뮤니케이션 규칙

- **기본 응답 언어**: 한국어
- **코드 주석**: 한국어로 작성
- **커밋 메시지**: 한국어로 작성
- **문서화**: 한국어로 작성
- **변수명/함수명**: 영어 (코드 표준 준수)

## 프로젝트 개요

버킷리스트(인생 목표 추적) 웹 앱. 순수 클라이언트 사이드로 빌드 도구, 프레임워크, 패키지 매니저 없이 구성. 모든 데이터는 브라우저 LocalStorage에 저장.

## 실행 방법

`bucket-list-main/index.html`을 브라우저에서 직접 열거나 정적 파일 서버로 실행:

```bash
python -m http.server 8000 --directory bucket-list-main
```

빌드, 린트, 테스트 명령어 없음 — 의존성 제로 바닐라 프로젝트.

## 아키텍처

HTML을 View로 사용하는 2계층 Model-Controller 패턴:

- **`js/storage.js`** — 데이터 계층(Model). `BucketStorage`는 객체 리터럴(클래스 아님)로 CRUD 메서드(`addItem`, `updateItem`, `deleteItem`, `toggleComplete`)와 `getStats()`, `getFilteredList()`를 제공. 모든 변경은 `localStorage['bucketList']`에 대한 전체 load/save 사이클로 수행. 항목은 JSON 배열로 최신순 정렬(`unshift`).

- **`js/app.js`** — UI 계층(Controller). `BucketListApp`은 ES6 클래스로 `DOMContentLoaded` 시 전역 변수 `app`으로 인스턴스화. `cacheElements()`로 DOM 캐싱, `bindEvents()`로 이벤트 바인딩, 단일 `render()` 메서드로 모든 상태 변경 시 전체 재렌더링. `createBucketItemHTML()`에서 템플릿 리터럴로 HTML 생성. 렌더링된 HTML의 인라인 `onclick`이 전역 `app`을 호출.

- **`index.html`** — 정적 마크업. Tailwind CSS CDN(`cdn.tailwindcss.com`) 로드 후 `storage.js` → `app.js` 순서로 로드 (순서 중요 — `app.js`가 `BucketStorage`에 의존).

- **`css/styles.css`** — Tailwind 보완 커스텀 스타일. 애니메이션(slideIn, fadeIn, scaleIn), 필터 버튼 활성 상태, `prefers-color-scheme` 다크모드, 640px 모바일 브레이크포인트.

## 주요 컨벤션

- **모듈 없음**: `<script>` 태그로 로드. `BucketStorage`는 전역 객체, `app`은 전역 변수.
- **XSS 방지**: `escapeHtml()`로 사용자 입력 이스케이프 (임시 DOM 요소의 `textContent` → `innerHTML`). 인라인 핸들러의 작은따옴표는 `replace(/'/g, "\\'")`로 이스케이프.
- **항목 ID**: `Date.now().toString()` — 빠른 연속 추가 시 중복 가능.
- **렌더링**: 모든 변경 시 전체 재렌더링 (diffing 없음). `render()`가 유일한 UI 업데이트 지점.
- **필터 값**: `'all'`, `'active'`(진행중), `'completed'` — 필터 버튼의 `data-filter` 속성에 저장.

## 데이터 스키마

`localStorage['bucketList']` (JSON 배열) 내 각 항목:

```
{ id: string, title: string, completed: boolean, createdAt: ISO string, completedAt: ISO string | null }
```

## 디렉토리 참고

실제 소스는 `bucket-list-main/` 내부에 위치. `index.html`과 모든 소스 파일이 해당 디렉토리에 포함.
