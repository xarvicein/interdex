import type { Answer, Category, Question, User } from "@prisma/client";
import type {
  AnswerDTO,
  CategoryDTO,
  QuestionDTO,
  UserDTO,
} from "@interdex/shared";

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
    authProvider: user.authProvider,
    createdAt: user.createdAt.toISOString(),
  };
}

export function toCategoryDTO(
  category: Category & { _count?: { questions: number } },
): CategoryDTO {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    icon: category.icon,
    questionCount: category._count?.questions,
    createdAt: category.createdAt.toISOString(),
  };
}

export function toAnswerDTO(
  answer: Answer & { createdBy?: Pick<User, "id" | "name"> | null },
): AnswerDTO {
  return {
    id: answer.id,
    questionId: answer.questionId,
    contentType: answer.contentType,
    textContent: answer.textContent,
    codeContent: answer.codeContent,
    codeLanguage: answer.codeLanguage,
    status: answer.status,
    reviewNote: answer.reviewNote,
    createdBy: answer.createdBy ?? null,
    createdAt: answer.createdAt.toISOString(),
  };
}

type QuestionWithRelations = Question & {
  category?: Pick<Category, "id" | "name" | "slug">;
  createdBy?: Pick<User, "id" | "name"> | null;
  reviewedBy?: Pick<User, "id" | "name"> | null;
  answers?: (Answer & { createdBy?: Pick<User, "id" | "name"> | null })[];
};

export function toQuestionDTO(question: QuestionWithRelations): QuestionDTO {
  return {
    id: question.id,
    title: question.title,
    prompt: question.prompt,
    categoryId: question.categoryId,
    category: question.category,
    difficulty: question.difficulty,
    tags: question.tags,
    status: question.status,
    reviewNote: question.reviewNote,
    createdBy: question.createdBy ?? null,
    reviewedBy: question.reviewedBy ?? null,
    answers: (question.answers ?? []).map(toAnswerDTO),
    createdAt: question.createdAt.toISOString(),
    updatedAt: question.updatedAt.toISOString(),
  };
}
