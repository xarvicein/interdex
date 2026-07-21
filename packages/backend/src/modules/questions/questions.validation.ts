import { z } from "zod";
import { AnswerContentType, Difficulty, ReviewStatus } from "@interdex/shared";

export const answerInputSchema = z
  .object({
    contentType: z.nativeEnum(AnswerContentType),
    textContent: z.string().min(1).max(20000).optional(),
    codeContent: z.string().min(1).max(20000).optional(),
    codeLanguage: z.string().min(1).max(40).optional(),
  })
  .refine((a) => (a.contentType === "TEXT" ? !!a.textContent : true), {
    message: "textContent is required when contentType is TEXT",
    path: ["textContent"],
  })
  .refine((a) => (a.contentType === "CODE" ? !!a.codeContent : true), {
    message: "codeContent is required when contentType is CODE",
    path: ["codeContent"],
  })
  .refine(
    (a) =>
      a.contentType === "BOTH" ? !!a.textContent && !!a.codeContent : true,
    {
      message:
        "textContent and codeContent are both required when contentType is BOTH",
      path: ["codeContent"],
    },
  );

export const createQuestionSchema = z.object({
  title: z.string().min(5).max(200),
  prompt: z.string().min(10).max(10000),
  categoryId: z.string().uuid(),
  difficulty: z.nativeEnum(Difficulty).default(Difficulty.MEDIUM),
  tags: z.array(z.string().min(1).max(30)).max(10).default([]),
  answers: z.array(answerInputSchema).min(1).max(5),
});

export const addAnswerSchema = answerInputSchema;

export const questionListQuerySchema = z.object({
  category: z.string().optional(),
  difficulty: z.nativeEnum(Difficulty).optional(),
  tag: z.string().optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

export const reviewQueueQuerySchema = z.object({
  status: z.nativeEnum(ReviewStatus).default(ReviewStatus.PENDING),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

export const idParamSchema = z.object({ id: z.string().uuid() });

export const reviewDecisionSchema = z.object({
  note: z.string().max(1000).optional(),
});
