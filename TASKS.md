# Задачи по верстке Unit 9 (Roadmap A1)

> **Стандарты выполнения**:
> - Стек: Next.js 16 (App Router), React 19, TypeScript (strict, без `any`), SCSS-модули.
> - SCSS: Токены `@use '@/styles/variables' as *;` и `@use '@/styles/mixins' as *;`. Никаких сырых hex-цветов и пиксельных брейкпоинтов.
> - Mobile-First: Базовая верстка на 320px+, `@include respond-to(md)`, `@include respond-to(lg)`. Без горизонтального скролла.
> - iOS A11y: Минимальный размер шрифта инпутов и селектов `16px` на экранах `<=768px`.
> - Двойной режим проверки: `isReview = Boolean(isTeacherReview || (answerKey && readOnly));`. Ошибки выносятся в отдельную строку `.feedbackRow` с карточкой учителя `TeacherAnswerBadge`, верные ответы — `correctBadge`.
> - История ревизий: Подсветка отличий от первоначальных ответов студента через `.diffHighlight`.
> - Ответы не спойлерятся в placeholder'ах — ученик думает сам, а ответы хранятся в бэкенде в объекте answerKey и в fallback ключах компонентов.
> - Все кнопки аудио приведены к единому стандарту: формат "▶ Audio X.X" / "⏸ Pause Audio X.X", единый стиль `.audioBtn`.

---



- [ ] **9C Study habits** (стр. 74–75)
- [ ] **9D English in action & Check and reflect** (стр. 76–77)

---

### Чек-лист проверок:
-  `npx tsc --noEmit` 
-  `npx eslint` 
-  `npm run build` (
-  `npm run lint` 
