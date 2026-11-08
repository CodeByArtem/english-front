export type SubmissionAnswerPrimitive = string | number | boolean | null;

export type SubmissionAnswerValue =
  | SubmissionAnswerPrimitive
  | readonly SubmissionAnswerPrimitive[]
  | Record<string, unknown>
  | unknown;

export type SubmissionAnswers = Record<string, unknown>;

export interface GradingDetails {
  totalQuestions?: number;
  correctAnswers?: number;
  failedQuestions?: string[];
  gradedAt?: string;
  [key: string]: unknown;
}

export interface SubmissionResponse {
  id: string;
  score?: number | null;
  grade?: number | null;
  status: string;
  answers: SubmissionAnswers;
  details?: GradingDetails | null;
  reviewedAnswers?: Record<string, unknown> | null;
  tutorComment?: string | null;
  createdAt: string;
}
