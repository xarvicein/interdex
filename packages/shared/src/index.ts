// Shared enums and DTO types used by both the backend (Express/Prisma) and
// the frontend (React). Keeping these in one place means the frontend never
// needs to hardcode option lists that mirror backend enums.

export const Role = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const AuthProvider = {
  LOCAL: "LOCAL",
  GOOGLE: "GOOGLE",
} as const;
export type AuthProvider = (typeof AuthProvider)[keyof typeof AuthProvider];

export const Difficulty = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
} as const;
export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export const ReviewStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;
export type ReviewStatus = (typeof ReviewStatus)[keyof typeof ReviewStatus];

export const AnswerContentType = {
  TEXT: "TEXT",
  CODE: "CODE",
  BOTH: "BOTH",
} as const;
export type AnswerContentType =
  (typeof AnswerContentType)[keyof typeof AnswerContentType];

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: Role;
  authProvider: AuthProvider;
  createdAt: string;
}

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  questionCount?: number;
  createdAt: string;
}

export interface AnswerDTO {
  id: string;
  questionId: string;
  contentType: AnswerContentType;
  textContent: string | null;
  codeContent: string | null;
  codeLanguage: string | null;
  status: ReviewStatus;
  reviewNote: string | null;
  createdBy: Pick<UserDTO, "id" | "name"> | null;
  createdAt: string;
}

export interface QuestionDTO {
  id: string;
  title: string;
  prompt: string;
  categoryId: string;
  category?: Pick<CategoryDTO, "id" | "name" | "slug">;
  difficulty: Difficulty;
  tags: string[];
  status: ReviewStatus;
  reviewNote: string | null;
  createdBy: Pick<UserDTO, "id" | "name"> | null;
  reviewedBy: Pick<UserDTO, "id" | "name"> | null;
  answers: AnswerDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuthResponse {
  user: UserDTO;
  accessToken: string;
}

export interface ApiErrorBody {
  error: string;
  details?: unknown;
}
