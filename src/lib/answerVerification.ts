/**
 * Модуль строгой верификации ответов ученика для режима проверки преподавателя.
 * Реализует нормализацию, сверку с эталонами answerKey и формирование подсказок.
 */

export type AnswerPrimitive = string | number | boolean;
export type ExpectedAnswer = AnswerPrimitive | readonly AnswerPrimitive[];
export type ExerciseAnswerKey = Record<string, ExpectedAnswer>;
export type LessonAnswerKey = Record<string, ExerciseAnswerKey | ExpectedAnswer>;

export type VerificationStatus = 'correct' | 'incorrect' | 'empty' | 'no_key';

export interface VerificationResult {
  /** Ответ проверен по ключу */
  hasKey: boolean;
  /** Ответ совпадает с эталоном */
  isCorrect: boolean;
  /** Студент вообще ввел ответ */
  hasAnswer: boolean;
  /** Текстовое представление эталона для подсказки учителю */
  expectedDisplay: string;
  /** Общий статус проверки для стилизации инпутов */
  status: VerificationStatus;
}

/**
 * Нормализует строковый ответ:
 * - удаляет лишние пробелы в начале и конце
 * - приводит к нижнему регистру
 * - унифицирует различные типы апострофов
 * - убирает точку в конце предложения
 */
export function normalizeAnswer(val: unknown): string {
  if (val === null || val === undefined) return '';
  return String(val)
    .trim()
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/\.+$/, '');
}

/**
 * Проверяет, совпадает ли ответ студента с ожидаемым эталоном.
 */
export function matchesExpected(studentVal: unknown, expected: ExpectedAnswer): boolean {
  const normalizedStudent = normalizeAnswer(studentVal);
  if (!normalizedStudent) return false;

  if (Array.isArray(expected)) {
    return expected.some((opt) => normalizeAnswer(opt) === normalizedStudent);
  }
  return normalizeAnswer(expected) === normalizedStudent;
}

/**
 * Возвращает читаемую строку эталонного ответа для учителя.
 */
export function formatExpectedDisplay(expected: ExpectedAnswer): string {
  if (Array.isArray(expected)) {
    // Если первый и второй вариант отличаются только регистром, берем красивый вариант
    const unique = Array.from(new Set(expected.map((e) => String(e))));
    return unique.slice(0, 2).join(' / ');
  }
  return String(expected);
}

/**
 * Проверяет конкретный ответ студента по эталонному ключу.
 */
export function verifyAnswer(
  studentVal: unknown,
  expected: ExpectedAnswer | undefined,
): VerificationResult {
  if (expected === undefined || expected === null) {
    return {
      hasKey: false,
      isCorrect: false,
      hasAnswer: normalizeAnswer(studentVal).length > 0,
      expectedDisplay: '',
      status: 'no_key',
    };
  }

  const hasAnswer = normalizeAnswer(studentVal).length > 0;
  const isCorrect = matchesExpected(studentVal, expected);
  const expectedDisplay = formatExpectedDisplay(expected);
  const status: VerificationStatus = isCorrect
    ? 'correct'
    : hasAnswer
    ? 'incorrect'
    : 'empty';

  return {
    hasKey: true,
    isCorrect,
    hasAnswer,
    expectedDisplay,
    status,
  };
}

/**
 * Извлекает ключ конкретного вопроса из структуры LessonAnswerKey
 */
export function getExerciseKey(
  lessonKey: LessonAnswerKey | null | undefined,
  exerciseName: string,
): ExerciseAnswerKey | null {
  if (!lessonKey) return null;
  const section = lessonKey[exerciseName];
  if (section && typeof section === 'object' && !Array.isArray(section)) {
    return section as ExerciseAnswerKey;
  }
  return null;
}
