/**
 * Модуль строгой верификации ответов ученика для режима проверки преподавателя.
 * Реализует нормализацию, сверку с эталонами answerKey и формирование подсказок.
 */

export type AnswerPrimitive = string | number | boolean;
export interface ExpectedAnswerObject {
  value?: AnswerPrimitive | readonly AnswerPrimitive[];
  expected?: AnswerPrimitive | readonly AnswerPrimitive[];
  answer?: AnswerPrimitive | readonly AnswerPrimitive[];
  isExample?: boolean;
  ignored?: boolean;
}
export type ExpectedAnswer = AnswerPrimitive | readonly AnswerPrimitive[] | ExpectedAnswerObject;
export type ExerciseAnswerKey = Record<string, ExpectedAnswer>;
export type LessonAnswerKey = Record<string, ExerciseAnswerKey | ExpectedAnswer>;

export type VerificationStatus = 'correct' | 'incorrect' | 'empty' | 'no_key' | 'example';

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
  /** Является ли элемент примером или исключённым из проверки */
  isExample?: boolean;
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
    .replace(/[,;!]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\.+$/, '');
}

/**
 * Извлекает базовый примитив или список вариантов из расширенного объекта метаданных ответа
 */
export function extractExpectedPrimitive(
  expected: ExpectedAnswer | undefined,
): AnswerPrimitive | readonly AnswerPrimitive[] | null {
  if (expected === null || expected === undefined) return null;
  if (typeof expected === 'object' && !Array.isArray(expected)) {
    const obj = expected as ExpectedAnswerObject;
    if (obj.value !== undefined) return obj.value;
    if (obj.expected !== undefined) return obj.expected;
    if (obj.answer !== undefined) return obj.answer;
    return null;
  }
  return expected;
}

/**
 * Проверяет, является ли ожидаемый ключ примером или исключённым из проверки
 */
export function isExampleOrIgnored(expected: ExpectedAnswer | undefined): boolean {
  if (expected && typeof expected === 'object' && !Array.isArray(expected)) {
    const obj = expected as ExpectedAnswerObject;
    return obj.isExample === true || obj.ignored === true;
  }
  return false;
}

/**
 * Проверяет, совпадает ли ответ студента с ожидаемым эталоном.
 */
export function matchesExpected(studentVal: unknown, expected: ExpectedAnswer): boolean {
  const normalizedStudent = normalizeAnswer(studentVal);
  if (!normalizedStudent) return false;

  const actual = extractExpectedPrimitive(expected);
  if (actual === null) return false;

  if (Array.isArray(actual)) {
    return actual.some((opt) => normalizeAnswer(opt) === normalizedStudent);
  }
  return normalizeAnswer(actual) === normalizedStudent;
}

/**
 * Возвращает читаемую строку эталонного ответа для учителя.
 */
export function formatExpectedDisplay(expected: ExpectedAnswer): string {
  const actual = extractExpectedPrimitive(expected);
  if (actual === null) return '';

  if (Array.isArray(actual)) {
    // Если первый и второй вариант отличаются только регистром, берем красивый вариант
    const unique = Array.from(new Set(actual.map((e) => String(e))));
    return unique.slice(0, 2).join(' / ');
  }
  return String(actual);
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

  const isExample = isExampleOrIgnored(expected);
  const expectedDisplay = formatExpectedDisplay(expected);
  const hasAnswer = normalizeAnswer(studentVal).length > 0;

  if (isExample) {
    return {
      hasKey: true,
      isCorrect: true,
      hasAnswer: true,
      expectedDisplay,
      status: 'example',
      isExample: true,
    };
  }

  const isCorrect = matchesExpected(studentVal, expected);
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
    isExample: false,
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
